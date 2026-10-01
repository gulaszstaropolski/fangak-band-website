import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { defaultContactFields, type ContactFormField } from "@/lib/contact-fields";
import { getContact } from "@/lib/content";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ message: "Invalid request." }, { status: 415 });
  }

  const reader = request.body?.getReader();
  if (!reader) {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }
  let body = "";
  let size = 0;
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 12_000) {
      await reader.cancel();
      return NextResponse.json({ message: "Your message is too long." }, { status: 413 });
    }
    body += decoder.decode(value, { stream: true });
  }
  body += decoder.decode();

  let fields: Record<string, unknown>;
  try {
    fields = JSON.parse(body) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  if (typeof fields.website === "string" && fields.website.trim()) {
    return NextResponse.json({ message: "Thanks for getting in touch." });
  }

  const contact = await getContact();
  const configuredFields = (contact?.formFields ?? []).filter((field) =>
    /^[a-z][a-z0-9_-]{0,49}$/.test(field.name) &&
    field.label &&
    ["text", "email", "tel", "textarea"].includes(field.type),
  );
  const formFields = configuredFields.length ? configuredFields : defaultContactFields;
  const values: { field: ContactFormField; value: string }[] = [];
  for (const field of formFields) {
    const rawValue = fields[field.name];
    const value = typeof rawValue === "string" ? rawValue.trim() : "";
    const maxLength = Math.min(5000, Math.max(1, field.maxLength ?? 500));
    if (
      ((field.required ?? false) && !value) ||
      value.length > maxLength ||
      (field.name === "name" && /[\u0000-\u001f\u007f]/.test(value)) ||
      (field.name === "message" && value.length < 10) ||
      (field.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    ) {
      return NextResponse.json({ message: "Please check your details and try again." }, { status: 400 });
    }
    values.push({ field, value });
  }
  const name = values.find(({ field }) => field.name === "name")?.value || "Website contact";
  const email = values.find(({ field }) => field.type === "email")?.value;
  const message = values.find(({ field }) => field.name === "message")?.value;

  const host = process.env.SMTP_HOST;
  const from = process.env.SMTP_FROM;
  const to = contact?.email?.trim() || process.env.CONTACT_TO;
  const port = Number(process.env.SMTP_PORT || 587);
  if (!host || !from || !to || !Number.isInteger(port) || port < 1 || port > 65535) {
    return NextResponse.json({ message: "Contact form email is not configured yet. Please try again later." }, { status: 503 });
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: process.env.SMTP_SECURE === "true" || port === 465,
      auth: process.env.SMTP_USER && process.env.SMTP_PASSWORD
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
        : undefined,
      disableFileAccess: true,
      disableUrlAccess: true,
    });
    await transporter.sendMail({
      from,
      to,
      ...(email ? { replyTo: email } : {}),
      subject: `Website enquiry from ${name.replace(/[\r\n]/g, " ")}`,
      text: values.map(({ field, value }) => `${field.label}: ${value}`).join("\n\n") || message,
    });
    return NextResponse.json({ message: "Thanks — your message has been sent." });
  } catch {
    return NextResponse.json({ message: "We couldn’t send your message. Please try again later." }, { status: 502 });
  }
}
