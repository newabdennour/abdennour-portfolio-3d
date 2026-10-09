import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Caveat } from "next/font/google";
import "./globals.css";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const hand = Caveat({
  subsets: ["latin"],
  variable: "--font-hand",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Guerroudj Abdennour — AI Engineer & Full-Stack Developer",
  description:
    "Portfolio of Guerroudj Abdennour: LLM systems, RAG platforms, mobile AI apps, forecasting and full-stack builds.",
  openGraph: {
    title: "Guerroudj Abdennour — AI Engineer",
    description: "Transforming complex challenges into elegant AI-powered solutions.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en" className={`${grotesk.variable} ${hand.variable}`}>
      <body
        className="bg-white font-display text-slate-900 antialiased"
        style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
