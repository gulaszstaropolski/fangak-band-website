"use client";

import { useState } from "react";
import type { FormEvent } from "react";

export function ContactForm() {
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    setSending(true);
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form)),
      });
      const result = (await response.json()) as { message?: string };
      setStatus(result.message || "Something went wrong. Please try again.");
      if (response.ok) formElement.reset();
    } catch {
      setStatus("We couldn’t send your message. Please try again later.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <label>Your name<input name="name" autoComplete="name" required maxLength={100} /></label>
      <label>Email address<input type="email" name="email" autoComplete="email" required maxLength={254} /></label>
      <label>Your message<textarea name="message" rows={5} required minLength={10} maxLength={5000} /></label>
      <label className="honeypot" aria-hidden="true">Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <button className="button button-dark" type="submit" disabled={sending}>{sending ? "Sending…" : "Send message ↗"}</button>
      <p className="form-status" role="status" aria-live="polite">{status}</p>
    </form>
  );
}
