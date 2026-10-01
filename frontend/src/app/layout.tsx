import type { Metadata } from "next";
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
