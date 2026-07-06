"use client";

import { useEffect, useRef, useState } from "react";
import { ChatIcon, CloseIcon, SendIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Bonjour 👋 Je suis l'assistant HEXA. Décrivez-moi votre projet (site web, application mobile, agent IA...) et je vous prépare une estimation indicative.",
};

export function QuoteAgentWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isSending]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    if (isOpen) document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);
    setError(null);

    try {
      const response = await fetch("/api/quote-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError(body?.error ?? "Une erreur est survenue. Réessayez dans un instant.");
        return;
      }

      const data = (await response.json()) as { reply: string; completed: boolean };
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      if (data.completed) setCompleted(true);
    } catch {
      setError("Impossible de contacter l'assistant. Vérifiez votre connexion.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-controls="quote-agent-panel"
        aria-label={isOpen ? "Fermer l'assistant HEXA" : "Ouvrir l'assistant HEXA"}
        className="bg-primary text-primary-foreground fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-[var(--shadow-glow-primary)] transition-transform hover:scale-105"
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </button>

      {isOpen && (
        <div
          id="quote-agent-panel"
          role="dialog"
          aria-label="Assistant de devis HEXA"
          className="border-border-strong bg-surface fixed right-6 bottom-24 z-50 flex h-[32rem] max-h-[70vh] w-96 max-w-[calc(100vw-3rem)] flex-col rounded-2xl border shadow-2xl"
        >
          <header className="border-border-strong flex items-center justify-between border-b px-4 py-3">
            <p className="text-foreground text-sm font-semibold">Assistant HEXA</p>
            {completed && (
              <span className="text-accent text-xs font-medium">✓ Demande transmise</span>
            )}
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
            <ul className="flex flex-col gap-3">
              {messages.map((message, index) => (
                <li
                  key={index}
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3 py-2 text-sm text-pretty",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "bg-surface-2 text-foreground",
                  )}
                >
                  {message.content}
                </li>
              ))}
              {isSending && (
                <li className="bg-surface-2 text-foreground/60 max-w-[85%] rounded-2xl px-3 py-2 text-sm">
                  …
                </li>
              )}
            </ul>
          </div>

          {error && (
            <p role="alert" className="px-4 pb-2 text-xs text-red-400">
              {error}
            </p>
          )}

          <form
            onSubmit={sendMessage}
            className="border-border-strong flex gap-2 border-t p-3"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Décrivez votre projet…"
              disabled={isSending}
              className="border-border-strong bg-background text-foreground focus-visible:outline-accent flex-1 rounded-full border px-4 py-2 text-sm outline-none"
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              aria-label="Envoyer"
              className="bg-primary text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full disabled:opacity-50"
            >
              <SendIcon />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
