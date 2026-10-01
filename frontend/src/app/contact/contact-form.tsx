"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { defaultContactFields, type ContactFormField } from "@/lib/contact-fields";

export function ContactForm({ fields }: { fields?: ContactFormField[] }) {
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const configuredFields = (fields ?? []).filter((field) =>
    /^[a-z][a-z0-9_-]{0,49}$/.test(field.name) &&
    field.label &&
    ["text", "email", "tel", "textarea"].includes(field.type),
  );
  const formFields = configuredFields.length ? configuredFields : defaultContactFields;

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
      {formFields.map((field) => {
        const maxLength = Math.min(5000, Math.max(1, field.maxLength ?? 500));
        const props = {
          name: field.name,
          required: field.required ?? false,
          maxLength,
          placeholder: field.placeholder,
          ...(field.name === "name" ? { autoComplete: "name" } : {}),
          ...(field.name === "email" ? { autoComplete: "email" } : {}),
        };
        return (
          <label key={field.id ?? field.name}>{field.label}
            {field.type === "textarea" ? (
              <textarea {...props} rows={5} minLength={field.name === "message" ? 10 : undefined} />
            ) : (
              <input {...props} type={field.type} />
            )}
          </label>
        );
      })}
      <label className="honeypot" aria-hidden="true">Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <button className="button button-dark" type="submit" disabled={sending}>{sending ? "Sending…" : "Send message ↗"}</button>
      <p className="form-status" role="status" aria-live="polite">{status}</p>
    </form>
  );
}
