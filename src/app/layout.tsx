import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Premium Export Track | Supply Chain",
  description:
    "Traceable Rwanda coffee supply chain with public verification portals for buyers, lenders, and auditors.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${display.variable} ${jetbrainsMono.variable}`}
    >
      <body className={`${GeistSans.className} antialiased`}>{children}</body>
    </html>
  );
}
