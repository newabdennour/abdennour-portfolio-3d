import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});
const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Guerroudj Abdennour — AI Engineer & Full-Stack Developer",
  description:
    "Ultra-immersive portfolio of Guerroudj Abdennour: LLM systems, RAG platforms, mobile AI apps, forecasting and full-stack builds.",
  openGraph: {
    title: "Guerroudj Abdennour — AI Engineer",
    description: "Transforming complex challenges into elegant AI-powered solutions.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="noise bg-void font-body antialiased">{children}</body>
    </html>
  );
}
