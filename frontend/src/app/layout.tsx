import type { Metadata } from "next";
import { getBand } from "@/lib/content";
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
  const band = await getBand();
  return (
    <html lang="en">
      <body style={band.backgroundImage ? { backgroundImage: `url(${JSON.stringify(band.backgroundImage)})`, backgroundSize: "cover", backgroundAttachment: "fixed", backgroundPosition: "center" } : undefined}>{children}</body>
    </html>
  );
}
