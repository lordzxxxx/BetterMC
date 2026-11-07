import { FormEvent, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Bot,
  ExternalLink,
  MessageCircle,
  Send,
  ShieldCheck,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  portalSearchIndex,
  searchPortal,
  type PortalSearchRecord,
} from "./searchIndex";
import { sitePages } from "./sitePages";

type AssistantReply = {
  title: string;
  text: string;
  results: PortalSearchRecord[];
};

type AssistantMessage =
  | { id: number; role: "user"; text: string }
  | { id: number; role: "assistant"; reply: AssistantReply };

const starterQuestions = [
  "Where can I find emergency contacts?",
  "Show barangay information",
  "How do I check procurement records?",
];

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const uniqueRecords = (records: PortalSearchRecord[]) =>
  Array.from(new Map(records.map((record) => [record.href, record])).values());

function relatedRecords(query: string) {
  const exact = searchPortal(query);
  if (exact.length) return exact.slice(0, 5);

  const tokens = normalize(query)
    .split(/\s+/)
    .filter((token) => token.length > 2)
    .filter((token) => !["about", "please", "where", "what", "which", "show", "find", "tell"].includes(token));

  return portalSearchIndex
    .map((record) => {
      const content = normalize(
        `${record.type} ${record.title} ${record.detail} ${record.keywords ?? ""}`,
      );
      const score = tokens.reduce(
        (total, token) => total + (content.includes(token) ? 1 : 0),
        0,
      );
      return { record, score };
    })
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 5)
    .map(({ record }) => record);
}

function answerQuestion(question: string): AssistantReply {
  const query = normalize(question);

  if (/\b(emergency|hotline|urgent|police|fire|ambulance|rescue)\b/.test(query)) {
    return {
      title: "Emergency and urgent-help contacts",
      text: "Use the verified hotlines directory to identify the responsible city response office. If someone is in immediate danger, call the appropriate emergency service directly.",
      results: uniqueRecords([
        ...searchPortal("emergency contacts"),
        ...searchPortal("emergency office"),
      ]).slice(0, 5),
    };
  }

  if (/\b(weather|temperature|rain|forecast)\b/.test(query)) {
    return {
      title: "Malaybalay weather",
      text: "The homepage weather module shows the current modeled temperature, rain chance, wind, and the next 24 hours. Values update from Open-Meteo and are not official severe-weather warnings.",
      results: [portalSearchIndex.find((record) => record.href === "/")!],
    };
  }

  if (/\b(population|residents|census)\b/.test(query) && !/barangay/.test(query)) {
    return {
      title: "Malaybalay population",
      text: "BetterMC reports 195,046 residents across 46 barangays from the 2024 Census of Population, released by the Philippine Statistics Authority in 2026.",
      results: uniqueRecords([
        portalSearchIndex.find((record) => record.href === "/")!,
        portalSearchIndex.find((record) => record.href === "/barangays")!,
      ]),
    };
  }

  if (/\b(feature|features|page|pages|website|portal|what can you do|help)\b/.test(query)) {
    return {
      title: "What you can explore in BetterMC",
      text: "BetterMC organizes source-linked city records, officials, offices, barangay profiles, public services, legislation, procurement, weather, and correction requests in one independent civic portal.",
      results: sitePages.slice(0, 5).map((page) => ({
        type: "Page",
        title: page.label,
        detail: page.description,
        href: page.to,
      })),
    };
  }

  const results = relatedRecords(question);
  if (results.length) {
    return {
      title: `Information related to “${question.trim()}”`,
      text: "These are the closest entries in BetterMC’s current public-information index. Open a result for its full context, source notes, and available contact details.",
      results,
    };
  }

  return {
    title: "I could not match that question yet",
    text: "Try asking about a barangay, official, city office, emergency contact, service, ordinance, procurement notice, financial record, weather, or transparency document.",
    results: sitePages.slice(0, 4).map((page) => ({
      type: "Page",
      title: page.label,
      detail: page.description,
      href: page.to,
    })),
  };
}

const initialReply: AssistantReply = {
  title: "How can I help you navigate BetterMC?",
  text: "Ask about records, barangays, officials, offices, services, projects, procurement, legislation, weather, or emergency contacts. Answers come from the portal’s current indexed content.",
  results: [],
};

export default function SiteAssistant() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<AssistantMessage[]>([
    { id: 0, role: "assistant", reply: initialReply },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus({ preventScroll: true });
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  const ask = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const userId = nextId.current++;
    const assistantId = nextId.current++;
    setMessages((current) => [
      ...current,
      { id: userId, role: "user", text: trimmed },
      { id: assistantId, role: "assistant", reply: answerQuestion(trimmed) },
    ]);
    setQuestion("");
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    ask(question);
  };

  return (
    <aside className={`site-assistant${open ? " is-open" : ""}`}>
      <button
        className="assistant-launcher"
        type="button"
        aria-label={open ? "Close BetterMC guide" : "Open BetterMC guide"}
        aria-expanded={open}
        aria-controls="bettermc-assistant"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X aria-hidden="true" /> : <MessageCircle aria-hidden="true" />}
        <span>{open ? "Close" : "Ask BetterMC"}</span>
      </button>

      <section
        id="bettermc-assistant"
        className="assistant-panel"
        role="dialog"
        aria-modal="false"
        aria-labelledby="assistant-title"
        aria-hidden={!open}
      >
        <header>
          <span className="assistant-mark"><Bot aria-hidden="true" /></span>
          <div>
            <strong id="assistant-title">BetterMC Guide</strong>
            <span><ShieldCheck aria-hidden="true" /> Uses the current portal index</span>
          </div>
          <button type="button" aria-label="Close BetterMC guide" onClick={() => setOpen(false)}>
            <X aria-hidden="true" />
          </button>
        </header>

        <div className="assistant-messages" aria-live="polite">
          {messages.map((message) =>
            message.role === "user" ? (
              <p className="assistant-user-message" key={message.id}>{message.text}</p>
            ) : (
              <article className="assistant-reply" key={message.id}>
                <strong>{message.reply.title}</strong>
                <p>{message.reply.text}</p>
                {message.reply.results.length > 0 && (
                  <div className="assistant-results">
                    {message.reply.results.map((result) =>
                      result.href.startsWith("http") ? (
                        <a key={`${message.id}-${result.href}`} href={result.href} target="_blank" rel="noreferrer">
                          <span><small>{result.type}</small><strong>{result.title}</strong><em>{result.detail}</em></span>
                          <ExternalLink aria-hidden="true" />
                        </a>
                      ) : (
                        <Link key={`${message.id}-${result.href}`} to={result.href} onClick={() => setOpen(false)}>
                          <span><small>{result.type}</small><strong>{result.title}</strong><em>{result.detail}</em></span>
                          <ArrowRight aria-hidden="true" />
                        </Link>
                      ),
                    )}
                  </div>
                )}
              </article>
            ),
          )}
        </div>

        {messages.length === 1 && (
          <div className="assistant-prompts" aria-label="Suggested questions">
            {starterQuestions.map((prompt) => (
              <button type="button" key={prompt} onClick={() => ask(prompt)}>{prompt}</button>
            ))}
          </div>
        )}

        <form className="assistant-form" onSubmit={submit}>
          <label className="sr-only" htmlFor="assistant-question">Ask BetterMC a question</label>
          <input
            ref={inputRef}
            id="assistant-question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask about a service or public record…"
            autoComplete="off"
          />
          <button type="submit" aria-label="Send question" disabled={!question.trim()}>
            <Send aria-hidden="true" />
          </button>
        </form>
        <small className="assistant-disclaimer">Independent navigation help—not an official government response.</small>
      </section>
    </aside>
  );
}
