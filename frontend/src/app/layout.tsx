import type { Metadata } from "next";
import { getHome, getSettings } from "@/lib/content";
import "./globals.css";

function validColor(value?: string): string | undefined {
  return value && /^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i.test(value)
    ? value
    : undefined;
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const name = settings.siteName || "FANGAK";
  const description = settings.siteDescription || "Official home of FANGAK: music, live dates, photos and more.";
  return {
    ...(process.env.NEXT_PUBLIC_SITE_URL
      ? { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL) }
      : {}),
    title: {
      default: name,
      template: `%s | ${name}`,
    },
    description,
    openGraph: { type: "website", title: name, description },
    ...(settings.favicon ? { icons: { icon: settings.favicon } } : {}),
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [settings, home] = await Promise.all([getSettings(), getHome()]);
  const primaryColor = validColor(settings.primaryColor || home?.primaryColor);
  const secondaryColor = validColor(settings.secondaryColor || home?.secondaryColor);
  const style: React.CSSProperties = {
    ...(settings.backgroundImage
      ? {
          backgroundImage: `url(${JSON.stringify(settings.backgroundImage)})`,
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
        }
      : {}),
    ...(primaryColor ? ({ "--orange": primaryColor } as React.CSSProperties) : {}),
    ...(secondaryColor ? ({ "--ink": secondaryColor } as React.CSSProperties) : {}),
  };
  return (
    <html lang="en">
      <body style={Object.keys(style).length ? style : undefined}>{children}</body>
    </html>
  );
}
