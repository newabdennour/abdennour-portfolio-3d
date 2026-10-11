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

// Ring shows logo images only — no cards, no text.
const logoSlides = slides.filter((s) => s.logo);

function hideImg(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.display = "none";
}

function RingCard({ slide, index, total }: { slide: Slide; index: number; total: number }) {
  return (
    <div
      className="venue3d-card venue3d-logo"
      style={{ "--i": index, "--n": total } as React.CSSProperties}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={slide.logo}
        alt={`${slide.name} logo`}
        className="h-24 w-24 rounded-2xl border border-slate-200 bg-white object-contain p-1.5 shadow-[0_18px_40px_-16px_rgba(15,23,42,0.4)]"
        onError={hideImg}
      />
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
            Where I publish and present.
          </p>
        </div>

        {/* CSS-3D rotating ring (desktop, motion-safe) — logos only */}
        <div aria-hidden className="venue3d-scene mx-auto hidden max-w-5xl md:block">
          <div className="venue3d-ring">
            {logoSlides.map((s, i) => (
              <RingCard key={`${s.kind}-${i}`} slide={s} index={i} total={logoSlides.length} />
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
                    className="h-10 w-10 rounded-xl border border-slate-200 bg-white object-contain p-0.5 shadow-md"
                    onError={hideImg}
                  />
                ) : (
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-white">
                    {s.kind === "Journal" ? <BookOpen size={18} /> : <Mic size={18} />}
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
