import Image from "next/image";
import Link from "next/link";
import { getSettings } from "@/lib/content";

const navigation = [
  ["About", "/about"],
  ["Music", "/music"],
  ["Videos", "/videos"],
  ["Gallery", "/gallery"],
  ["Tour", "/events"],
  ["Contact", "/contact"],
] as const;

export async function SiteHeader({
  name,
  logoText,
  logoImage,
  preferProvidedLogo = false,
}: {
  name: string;
  logoText?: string;
  logoImage?: string;
  preferProvidedLogo?: boolean;
}) {
  const settings = await getSettings();
  const resolvedName = settings.siteName || name;
  const resolvedLogoImage = preferProvidedLogo ? logoImage || settings.logo : settings.logo || logoImage;
  const resolvedLogoText = preferProvidedLogo
    ? logoText || settings.logoText || resolvedName
    : settings.logoText || logoText || resolvedName;
  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label={`${resolvedName} home`}>
        {resolvedLogoImage && <Image src={resolvedLogoImage} alt="" width={160} height={56} className="logo-image" />}
        <span>{resolvedLogoText}</span>
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

export async function SiteFooter({ name }: { name: string }) {
  const settings = await getSettings();
  const resolvedName = settings.siteName || name;
  return (
    <footer className="site-footer">
      <span>© {new Date().getFullYear()} {resolvedName}</span>
      <span>{settings.footerText || "Made for the love of live music."}</span>
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
