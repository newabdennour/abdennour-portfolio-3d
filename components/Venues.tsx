"use client";
import { BookOpen, Mic } from "lucide-react";

// Edit these lists with your real journals & conferences.
// They render as a CSS-only 3D rotating ring (no WebGL, no network) with a
// static grid fallback on mobile / reduced-motion.
const journals = [
  { name: "JMLR — Journal of Machine Learning Research", note: "Target journal — forthcoming", logo: "/venues/jmlr.jpg" },
  { name: "Journal name — forthcoming", note: "Add your journal here" },
  { name: "Journal name — forthcoming", note: "Add your journal here" },
];

const conferences = [
  { name: "CVPR — Computer Vision & Pattern Recognition", note: "Target conference — forthcoming", logo: "/venues/cvpr.jpg" },
  { name: "Conference name — forthcoming", note: "Add your conference here" },
  { name: "Conference name — forthcoming", note: "Add your conference here" },
];

type Slide = { kind: "Journal" | "Conference"; name: string; note: string; logo?: string };

const slides: Slide[] = [
  ...journals.map((j) => ({ kind: "Journal" as const, ...j })),
  ...conferences.map((c) => ({ kind: "Conference" as const, ...c })),
];

function RingCard({ slide, index, total }: { slide: Slide; index: number; total: number }) {
  const isJournal = slide.kind === "Journal";
  return (
    <div
      className="venue3d-card"
      style={{ "--i": index, "--n": total } as React.CSSProperties}
    >
      <div
        className={`flex h-full flex-col rounded-2xl border p-5 text-left shadow-xl ${
          isJournal
            ? "border-amber-200 bg-[#fffdf4]"
            : "border-slate-200 bg-white"
        }`}
      >
        <span className="flex items-center gap-2.5">
          {slide.logo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={slide.logo}
              alt={`${slide.name} logo`}
              className="h-10 w-10 rounded-xl border border-slate-200 bg-white object-contain p-0.5 shadow-md"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          ) : (
            <span
              className={`grid h-10 w-10 place-items-center rounded-xl text-white shadow-md ${
                isJournal
                  ? "bg-gradient-to-br from-amber-500 to-amber-700"
                  : "bg-gradient-to-br from-slate-800 to-slate-950"
              }`}
            >
              {isJournal ? <BookOpen size={18} /> : <Mic size={18} />}
            </span>
          )}
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
              isJournal ? "bg-amber-100 text-amber-800" : "bg-slate-900 text-white"
            }`}
          >
            {slide.kind}
          </span>
        </span>
        <p className="mt-3 text-base font-bold leading-snug text-slate-900">{slide.name}</p>
        <p className="mt-1 text-xs text-slate-500">{slide.note}</p>
        <span className="mt-auto pt-4 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

export default function Venues() {
  return (
    <section id="venues" aria-label="Journals and conferences" className="relative bg-white py-16 md:py-20">
      <div className="container-x">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900">
            Journals & conferences
          </h2>
          <p className="mt-2 text-slate-600">
            Where I publish and present — edit the list in{" "}
            <code className="rounded bg-slate-100 px-1">components/Venues.tsx</code>.
          </p>
        </div>

        {/* CSS-3D rotating ring (desktop, motion-safe) */}
        <div aria-hidden className="venue3d-scene mx-auto hidden max-w-5xl md:block">
          <div className="venue3d-ring">
            {slides.map((s, i) => (
              <RingCard key={`${s.kind}-${i}`} slide={s} index={i} total={slides.length} />
            ))}
          </div>
        </div>
        <p aria-hidden className="mt-3 hidden text-center text-xs font-medium text-slate-400 md:block">
          Auto-rotating showcase · hover to pause
        </p>

        {/* Static fallback grid (mobile + reduced-motion + SEO) */}
        <div className="mx-auto grid max-w-5xl gap-4 md:hidden">
          {slides.map((s, i) => (
            <div
              key={`${s.kind}-${i}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_28px_-16px_rgba(15,23,42,0.18)]"
            >
              <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
                {s.logo ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={s.logo}
                    alt={`${s.name} logo`}
                    className="h-8 w-8 rounded-lg border border-slate-200 bg-white object-contain p-0.5"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                ) : (
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-900 text-white">
                    {s.kind === "Journal" ? <BookOpen size={16} /> : <Mic size={16} />}
                  </span>
                )}
                {s.kind}
              </p>
              <p className="mt-2 text-sm font-bold text-slate-900">{s.name}</p>
              <p className="mt-0.5 text-xs text-slate-500">{s.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
