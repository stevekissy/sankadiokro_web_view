import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { env } from "@/lib/env";
import { KEYWORDS, SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: { default: `${SITE_NAME} — Le goût authentique de chez nous`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  keywords: KEYWORDS,
  applicationName: SITE_NAME,
  icons: { icon: "/images/logo-sankadiokro.png", apple: "/images/logo-sankadiokro.png" },
  robots: { index: true, follow: true },
  openGraph: { type: "website", locale: "fr_CI", siteName: SITE_NAME, images: ["/images/logo-sankadiokro.png"] },
};

export const viewport: Viewport = {
  themeColor: "#174A35",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
