import { feedbackSchema } from '../../src/feedback'

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement
  first<T>(): Promise<T | null>
  run(): Promise<{ success: boolean }>
}

interface D1Database {
  prepare(query: string): D1PreparedStatement
}

interface Env {
  DB?: D1Database
  TURNSTILE_SECRET_KEY?: string
  RESEND_API_KEY?: string
  CONTACT_EMAIL?: string
  RESEND_FROM?: string
}

interface PagesContext {
  request: Request
  env: Env
}

const MAX_BODY_BYTES = 16_384
const TURNSTILE_TIMEOUT_MS = 5_000
const RESEND_TIMEOUT_MS = 10_000
const DEFAULT_CONTACT_EMAIL = 'bettermc.org@gmail.com'
const DEFAULT_RESEND_FROM = 'BetterMC Desk <onboarding@resend.dev>'

function json(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: {
      'cache-control': 'no-store',
      'content-type': 'application/json; charset=utf-8',
      'cross-origin-resource-policy': 'same-origin',
      'x-content-type-options': 'nosniff',
    },
  })
}

async function hash(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

async function verifyTurnstile(secret: string, token: string, ip: string): Promise<boolean> {
  const body = new FormData()
  body.set('secret', secret)
  body.set('response', token)
  body.set('remoteip', ip)
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(TURNSTILE_TIMEOUT_MS),
    })
    if (!response.ok) return false
    const result = (await response.json()) as { success?: boolean }
    return result.success === true
  } catch {
    return false
  }
}

class RequestBodyTooLargeError extends Error {}

async function readJsonBody(request: Request): Promise<unknown> {
  const declaredLength = Number(request.headers.get('content-length') ?? 0)
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    throw new RequestBodyTooLargeError()
  }

  const reader = request.body?.getReader()
  if (!reader) return null
  const decoder = new TextDecoder()
  let totalBytes = 0
  let body = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    totalBytes += value.byteLength
    if (totalBytes > MAX_BODY_BYTES) {
      await reader.cancel()
      throw new RequestBodyTooLargeError()
    }
    body += decoder.decode(value, { stream: true })
  }
  body += decoder.decode()
  return JSON.parse(body)
}

function isAllowedOrigin(request: Request): boolean {
  const fetchSite = request.headers.get('sec-fetch-site')
  if (fetchSite === 'cross-site') return false
  const origin = request.headers.get('origin')
  if (!origin) return true
  try {
    const originUrl = new URL(origin)
    const requestUrl = new URL(request.url)
    if (originUrl.origin === requestUrl.origin) return true
    const host = originUrl.hostname.toLowerCase()
    if (
      host === 'bettermalaybalay.cloud' ||
      host.endsWith('.bettermalaybalay.cloud') ||
      host === 'bettermc.ph' ||
      host.endsWith('.bettermc.ph') ||
      host === 'localhost' ||
      host.endsWith('.localhost') ||
      host.endsWith('.pages.dev')
    ) {
      return true
    }
    return false
  } catch {
    return false
  }
}

interface ResendPayload {
  apiKey: string
  from: string
  to: string
  replyTo?: string
  submission: {
    category: string
    subject: string
    details: string
    sourceUrl?: string
    email?: string
  }
}

async function sendResendEmail({
  apiKey,
  from,
  to,
  replyTo,
  submission,
}: ResendPayload): Promise<{ ok: boolean; status: number; error?: string }> {
  const categoryLabel = escapeHtml(submission.category.toUpperCase())
  const subjectLabel = escapeHtml(submission.subject)
  const detailsHtml = escapeHtml(submission.details).replace(/\n/g, '<br/>')
  const emailVal = submission.email ? escapeHtml(submission.email) : 'Not provided'
  const sourceVal = submission.sourceUrl
    ? `<a href="${escapeHtml(submission.sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(submission.sourceUrl)}</a>`
    : 'None listed'

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>BetterMC Civic Submission</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden;">
    <div style="background-color: #0038a8; color: #ffffff; padding: 20px 24px;">
      <h1 style="margin: 0; font-size: 18px; font-weight: 600; letter-spacing: -0.02em;">BetterMC Community Desk</h1>
      <p style="margin: 4px 0 0; font-size: 13px; color: #dbeafe;">New civic participation submission for review</p>
    </div>
    <div style="padding: 24px;">
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 0; font-weight: 600; width: 140px; color: #475569;">Request Type</td>
          <td style="padding: 10px 0; color: #0f172a;"><span style="display: inline-block; padding: 3px 8px; background: #eff6ff; color: #0038a8; border-radius: 4px; font-weight: 600; font-size: 12px;">${categoryLabel}</span></td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 0; font-weight: 600; color: #475569;">Subject</td>
          <td style="padding: 10px 0; color: #0f172a; font-weight: 600;">${subjectLabel}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 0; font-weight: 600; color: #475569;">Submitter Email</td>
          <td style="padding: 10px 0; color: #0f172a;">${emailVal}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 0; font-weight: 600; color: #475569;">Supporting Source</td>
          <td style="padding: 10px 0; color: #0f172a;">${sourceVal}</td>
        </tr>
      </table>
      <div style="margin-top: 16px;">
        <div style="font-weight: 600; font-size: 13px; color: #475569; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em;">Details / Evidence Provided</div>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px; font-size: 14px; line-height: 1.6; color: #1e293b;">
          ${detailsHtml}
        </div>
      </div>
      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
        Delivered via BetterMC public portal (<a href="https://bettermalaybalay.cloud/participate" style="color: #0038a8;">bettermalaybalay.cloud/participate</a>).
      </div>
    </div>
  </div>
</body>
</html>`

  const text = `BetterMC Community Desk Submission
========================================
Request Type: ${submission.category.toUpperCase()}
Subject: ${submission.subject}
Submitter Email: ${submission.email || 'Not provided'}
Supporting Source: ${submission.sourceUrl || 'None listed'}

Details:
${submission.details}

----------------------------------------
Delivered via https://bettermalaybalay.cloud/participate`

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: replyTo,
        subject: `[BetterMC Participate] ${submission.category.toUpperCase()}: ${submission.subject}`,
        html,
        text,
      }),
      signal: AbortSignal.timeout(RESEND_TIMEOUT_MS),
    })

    if (!res.ok) {
      const errText = await res.text()
      return { ok: false, status: res.status, error: errText }
    }
    return { ok: true, status: res.status }
  } catch (err) {
    return {
      ok: false,
      status: 500,
      error: err instanceof Error ? err.message : 'Resend request failed',
    }
  }
}

export async function onRequestPost({ request, env }: PagesContext): Promise<Response> {
  if (!isAllowedOrigin(request)) {
    return json({ message: 'Cross-site submissions are not accepted.' }, 403)
  }
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return json({ message: 'Expected a JSON request.' }, 415)
  }
  if (!env.DB && !env.RESEND_API_KEY) {
    return json(
      {
        message: `The submission desk is currently undergoing maintenance. Please send your submission directly via email to ${DEFAULT_CONTACT_EMAIL}.`,
      },
      503,
    )
  }

  let input: unknown
  try {
    input = await readJsonBody(request)
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return json({ message: 'The request is too large.' }, 413)
    }
    return json({ message: 'The request body is not valid JSON.' }, 400)
  }
  const parsed = feedbackSchema.safeParse(input)
  if (!parsed.success) {
    return json(
      {
        message: 'Review the form fields and try again.',
        issues: parsed.error.flatten().fieldErrors,
      },
      400,
    )
  }

  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown'
  if (env.TURNSTILE_SECRET_KEY) {
    if (
      !parsed.data.turnstileToken ||
      !(await verifyTurnstile(env.TURNSTILE_SECRET_KEY, parsed.data.turnstileToken, ip))
    ) {
      return json({ message: 'Human verification failed. Please retry.' }, 400)
    }
  }

  try {
    const ipHash = await hash(ip)
    if (env.DB) {
      const recent = await env.DB.prepare(
        "SELECT COUNT(*) AS count FROM submissions WHERE ip_hash = ? AND created_at > datetime('now', '-1 hour')",
      )
        .bind(ipHash)
        .first<{ count: number }>()
      if (Number(recent?.count ?? 0) >= 5) {
        return json({ message: 'Too many recent submissions. Please try again later.' }, 429)
      }
    }

    const id = crypto.randomUUID()
    if (env.DB) {
      const result = await env.DB.prepare(`
        INSERT INTO submissions (id, category, subject, details, source_url, contact_email, ip_hash, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'pending_verification')
      `)
        .bind(
          id,
          parsed.data.category,
          parsed.data.subject,
          parsed.data.details,
          parsed.data.sourceUrl || null,
          parsed.data.email || null,
          ipHash,
        )
        .run()

      if (!result.success) {
        return json({ message: 'The submission could not be saved.' }, 500)
      }
    }

    if (env.RESEND_API_KEY) {
      const emailResult = await sendResendEmail({
        apiKey: env.RESEND_API_KEY,
        from: env.RESEND_FROM || DEFAULT_RESEND_FROM,
        to: env.CONTACT_EMAIL || DEFAULT_CONTACT_EMAIL,
        replyTo: parsed.data.email || undefined,
        submission: parsed.data,
      })

      if (!emailResult.ok && !env.DB) {
        console.error('Resend delivery failed:', emailResult.error)
        return json(
          {
            message: `The submission could not be delivered to the desk. Please email ${DEFAULT_CONTACT_EMAIL} directly.`,
          },
          502,
        )
      }
    }

    return json(
      {
        id,
        message: 'Your submission was saved for moderator review.',
      },
      201,
    )
  } catch (error) {
    console.error('Submission persistence failed', error instanceof Error ? error.message : 'Unknown error')
    return json(
      {
        message: 'The submission service is temporarily unavailable. Please try again later.',
      },
      503,
    )
  }
}

export function onRequest(): Response {
  return json({ message: 'Method not allowed.' }, 405)
}
