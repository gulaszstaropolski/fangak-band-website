import type { Metadata } from "next";
import { getSettings } from "@/lib/content";
import "./globals.css";

export const metadata: Metadata = {
  ...(process.env.NEXT_PUBLIC_SITE_URL
    ? { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL) }
    : {}),
  title: {
    default: "FANGAK — Independent music",
    template: "%s | FANGAK",
  },
  description: "Official home of FANGAK: music, live dates, photos and more.",
  openGraph: {
    type: "website",
    title: "FANGAK — Independent music",
    description: "Discover music, stories and upcoming live shows from FANGAK.",
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSettings();
  const style: React.CSSProperties = {
    ...(settings.backgroundImage
      ? {
          backgroundImage: `url(${JSON.stringify(settings.backgroundImage)})`,
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
        }
      : {}),
    ...(settings.primaryColor ? ({ "--orange": settings.primaryColor } as React.CSSProperties) : {}),
    ...(settings.secondaryColor ? ({ "--ink": settings.secondaryColor } as React.CSSProperties) : {}),
  };
  return (
    <html lang="en">
      <body style={Object.keys(style).length ? style : undefined}>{children}</body>
    </html>
  );
}
