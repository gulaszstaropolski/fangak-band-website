import Link from "next/link";

export function safeLink(value?: string): string | undefined {
  if (!value) return undefined;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

export function CMSLink({
  label,
  href,
  className,
}: {
  label: string;
  href: string;
  className?: string;
}) {
  const url = safeLink(href);
  if (!url) return null;
  const content = <>{label} <span aria-hidden="true">↗</span></>;
  return url.startsWith("/")
    ? <Link className={className} href={url}>{content}</Link>
    : <a className={className} href={url} target="_blank" rel="noreferrer">{content}</a>;
}
