import Link from "next/link";

const navigation = [
  ["About", "/about"],
  ["Music", "/music"],
  ["Gallery", "/gallery"],
  ["Tour", "/events"],
  ["Contact", "/contact"],
] as const;

export function SiteHeader({ name }: { name: string }) {
  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label={`${name} home`}>
        {name}
        <span className="wordmark-dot">.</span>
      </Link>
      <nav className="main-nav" aria-label="Main navigation">
        {navigation.map(([label, href]) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
        <Link className="nav-shop" href="/shop">
          Shop ↗
        </Link>
      </nav>
    </header>
  );
}

export function SiteFooter({ name }: { name: string }) {
  return (
    <footer className="site-footer">
      <span>© {new Date().getFullYear()} {name}</span>
      <span>Made for the love of live music.</span>
      <Link href="/contact">Get in touch ↗</Link>
    </footer>
  );
}

export function PageIntro({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="page-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="intro-copy">{copy}</p>
    </div>
  );
}
