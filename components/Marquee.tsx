"use client";

const items = [
  "LangChain", "RAG Systems", "Next.js 14", "Three.js", "Whisper", "FAISS",
  "Transformers", "Flutter", "Firebase", "Vector DBs", "Gemini", "Python",
  "Framer Motion", "ARIMA", "Tailwind", "TypeScript",
];

export default function Marquee() {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-slate-200 bg-slate-50 py-5">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-slate-50 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-slate-50 to-transparent" />
      <div className="flex w-max animate-marquee gap-3">
        {row.map((t, i) => (
          <span
            key={i}
            className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-600 shadow-sm"
          >
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 align-middle" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
