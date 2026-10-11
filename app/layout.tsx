import type { Metadata, Viewport } from "next";
import "./globals.css";

// NOTE: system font stack only — no next/font/google network fetch.
// This removes the Google Fonts download (Caveat/Space_Grotesk AbortError
// in dev) and makes first paint instant/offline-safe. font-display falls
// back to system-ui via tailwind.config + body style; .font-hand falls
// back to "Segoe Script", cursive via globals.css.

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
      <html lang="en" suppressHydrationWarning>
      <head>
        {/* Must run before paint: tell the browser not to restore scroll,
            otherwise it jumps back to mid-page (e.g. E-Store) on reload. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if('scrollRestoration' in history)history.scrollRestoration='manual';}catch(e){}try{if(location.hash){history.replaceState(null,'',location.pathname+location.search);}window.scrollTo(0,0);}catch(e){}`,
          }}
        />
      </head>
      <body
        className="bg-white font-display text-slate-900 antialiased"
        style={{ fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
