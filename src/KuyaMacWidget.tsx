import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { ArrowUp, Bot, MessageCircle, X } from "lucide-react";
import { Link } from "react-router-dom";
import type { KuyaMacSource } from "./kuyaMac";

type Message = {
  id: string;
  role: "assistant" | "user";
  content: string;
  sources?: KuyaMacSource[];
};

const suggestions = [
  "Unsaon pagkuha og birth certificate?",
  "Asa ang akong barangay profile?",
  "Unsa ang emergency contacts sa Malaybalay?",
];
const MAX_VISIBLE_SOURCES = 3;

const welcome: Message = {
  id: "welcome",
  role: "assistant",
  content: "Maayong adlaw! Ako si Kuya MAC, ang imohang AI Companion.",
};

export function KuyaMac() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([welcome]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryMessage, setRetryMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelId = useId();
  const errorId = `${panelId}-error`;

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  async function send(message: string, addUserMessage = true) {
    const content = message.trim();
    if (!content || pending) return;
    if (addUserMessage) {
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: "user", content }]);
    }
    setDraft("");
    setError(null);
    setRetryMessage(null);
    setPending(true);
    try {
      const response = await fetch("/api/kuya-mac", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
        }),
      });
      const result = (await response.json()) as { answer?: string; message?: string; sources?: KuyaMacSource[] };
      const answer = result.answer;
      if (!response.ok || !answer) throw new Error(result.message || "Kuya MAC is unavailable right now.");
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: "assistant", content: answer, sources: result.sources }]);
    } catch (requestError) {
      const detail = requestError instanceof Error ? requestError.message : "";
      setError(detail === "Failed to fetch"
        ? "Unable to reach Kuya MAC right now. Check your connection and try again."
        : detail || "Kuya MAC is unavailable right now. Please try again.");
      setRetryMessage(content);
    } finally {
      setPending(false);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void send(draft);
  }

  return (
    <aside className={`kuya-mac${open ? " is-open" : ""}`} aria-label="Kuya MAC assistant">
      {open && (
        <section className="kuya-mac-panel" id={panelId} aria-label="Kuya MAC conversation">
          <header className="kuya-mac-header">
            <span className="kuya-mac-avatar" aria-hidden="true"><Bot /></span>
            <strong>Kuya MAC</strong>
            <button className="kuya-mac-close" type="button" onClick={() => setOpen(false)} aria-label="Close Kuya MAC"><X aria-hidden="true" /></button>
          </header>
          <div className="kuya-mac-disclaimer">Independent BetterMC guide — not a City Government representative. Answers use available public records.</div>
          <div className="kuya-mac-messages" aria-live="polite" aria-busy={pending}>
            {messages.map((message) => (
              <article className={`kuya-mac-message is-${message.role}`} key={message.id}>
                <p>{message.content}</p>
                {message.sources && message.sources.length > 0 && (
                  <div className="kuya-mac-sources">
                    <span>Related BetterMC records</span>
                    {message.sources.slice(0, MAX_VISIBLE_SOURCES).map((source) => (
                      <Link key={source.href} to={source.href} onClick={() => setOpen(false)}>
                        <span>{source.type}</span>
                        <strong>{source.title}</strong>
                        <small>{source.detail}</small>
                      </Link>
                    ))}
                  </div>
                )}
              </article>
            ))}
            {pending && <p className="kuya-mac-status">Kuya MAC is checking verified records…</p>}
          </div>
          <div className="kuya-mac-suggestions" aria-label="Suggested questions">
            {suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => void send(suggestion)} disabled={pending}>{suggestion}</button>)}
          </div>
          <form className="kuya-mac-form" onSubmit={onSubmit}>
            <label className="sr-only" htmlFor={`${panelId}-input`}>Ask Kuya MAC</label>
            <input ref={inputRef} id={`${panelId}-input`} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Pangutana kang Kuya MAC…" maxLength={1200} disabled={pending} autoComplete="off" aria-describedby={error ? errorId : undefined} />
            <button type="submit" disabled={!draft.trim() || pending} aria-label="Send question"><ArrowUp aria-hidden="true" /></button>
          </form>
          {error && (
            <div className="kuya-mac-error" id={errorId} role="alert">
              <p>{error}</p>
              {retryMessage && <button type="button" onClick={() => void send(retryMessage, false)} disabled={pending}>Try again</button>}
            </div>
          )}
        </section>
      )}
      <button className="kuya-mac-launcher" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls={open ? panelId : undefined}>
        <MessageCircle aria-hidden="true" />
        <span><strong>Kuya MAC</strong><small>Pangutana ta</small></span>
      </button>
    </aside>
  );
}
