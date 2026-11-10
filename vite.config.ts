import { defineConfig } from 'vitest/config'
import { loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

function devSubmissionsApiPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'dev-submissions-api',
    configureServer(server) {
      server.middlewares.use('/api/submissions', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ message: 'Method not allowed.' }))
          return
        }

        let body = ''
        req.on('data', (chunk) => {
          body += chunk
        })
        req.on('end', async () => {
          try {
            const data = JSON.parse(body)
            const apiKey = env.RESEND_API_KEY || process.env.RESEND_API_KEY
            const contactEmail =
              env.CONTACT_EMAIL || process.env.CONTACT_EMAIL || 'bettermc.org@gmail.com'
            const fromEmail =
              env.RESEND_FROM || process.env.RESEND_FROM || 'BetterMC Desk <onboarding@resend.dev>'

            if (apiKey) {
              const resendRes = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${apiKey}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  from: fromEmail,
                  to: [contactEmail],
                  reply_to: data.email || undefined,
                  subject: `[BetterMC Participate] ${(data.category || '').toUpperCase()}: ${data.subject || 'Correction Submission'}`,
                  text: `BetterMC Community Desk Submission (Dev Server)\n\nCategory: ${data.category}\nSubject: ${data.subject}\nSubmitter Email: ${data.email || 'None'}\nSource URL: ${data.sourceUrl || 'None'}\n\nDetails:\n${data.details}`,
                  html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; color: #0f172a; max-width: 600px;">
                    <div style="background-color: #0038a8; color: #ffffff; padding: 16px 20px; border-radius: 6px;">
                      <h2 style="margin: 0; font-size: 18px;">BetterMC Community Desk Submission (Dev Server)</h2>
                    </div>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px;">
                      <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; font-weight: 600; width: 140px; color: #475569;">Category</td><td style="padding: 8px 0;">${data.category}</td></tr>
                      <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; font-weight: 600; color: #475569;">Subject</td><td style="padding: 8px 0; font-weight: 600;">${data.subject}</td></tr>
                      <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; font-weight: 600; color: #475569;">Submitter Email</td><td style="padding: 8px 0;">${data.email || 'Not provided'}</td></tr>
                      <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; font-weight: 600; color: #475569;">Source URL</td><td style="padding: 8px 0;">${data.sourceUrl || 'None listed'}</td></tr>
                    </table>
                    <div style="margin-top: 16px;">
                      <p style="font-weight: 600; color: #475569; margin-bottom: 6px;">Details / Evidence Provided:</p>
                      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; font-size: 14px; white-space: pre-wrap; line-height: 1.5;">${data.details}</div>
                    </div>
                  </div>`,
                }),
              })

              if (!resendRes.ok) {
                const errText = await resendRes.text()
                console.error('[Vite Dev Server] Resend API error:', errText)
                res.statusCode = 502
                res.setHeader('Content-Type', 'application/json')
                res.end(
                  JSON.stringify({
                    message: 'Resend API returned an error in dev mode: ' + errText,
                  }),
                )
                return
              }
            } else {
              console.log(
                '[Vite Dev Server] Received submission without RESEND_API_KEY (mock mode):',
                data,
              )
            }

            res.statusCode = 201
            res.setHeader('Content-Type', 'application/json')
            res.end(
              JSON.stringify({
                id: 'dev-' + Date.now(),
                message: apiKey
                  ? 'Your submission was sent directly to bettermc.org@gmail.com via Resend.'
                  : 'Your submission was saved for moderator review (Local Dev Mode).',
              }),
            )
          } catch {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ message: 'Invalid JSON request.' }))
          }
        })
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), devSubmissionsApiPlugin(env)],
    build: {
      chunkSizeWarningLimit: 1800,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (
              id.includes('node_modules/react') ||
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/react-router')
            ) {
              return 'react-vendor'
            }
            if (id.includes('node_modules/lucide-react')) {
              return 'icons'
            }
            if (id.includes('node_modules/zod')) {
              return 'validation'
            }
            if (id.includes('node_modules/leaflet')) {
              return 'leaflet-vendor'
            }
            if (id.includes('src/barangayDisclosures')) {
              return 'barangay-disclosures'
            }
            if (id.includes('src/barangayOfficials')) {
              return 'barangay-officials'
            }
            if (id.includes('src/MalaybalayGisMap') || id.includes('src/malaybalayGisData')) {
              return 'malaybalay-gis'
            }
          },
        },
      },
    },
    test: {
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      globals: true,
      exclude: ['e2e/**', 'node_modules/**'],
    },
  }
})
