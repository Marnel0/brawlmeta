import type { Metadata } from "next";
import { Lilita_One, Fredoka, Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";

const lilitaOne = Lilita_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BrawlMeta — Tier list & map rotation",
    template: "%s | BrawlMeta",
  },
  description:
    "The most beautiful Brawl Stars stats site. Live tier lists, map rotation meta, and brawler rankings — all in one place.",
  openGraph: {
    title: "BrawlMeta",
    description: "Premium Brawl Stars tier list & map rotation",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${lilitaOne.variable} ${fredoka.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="font-body bg-brand-cream text-brand-ink min-h-screen">
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  );
}
