"use client";

import { useEffect, useRef, useState, type PointerEvent, type SyntheticEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Project } from "@/data/portfolio";

function hideImg(e: SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.display = "none";
}

const SWIPE_THRESHOLD = 40;
const MAX_VISIBLE = 3;

export default function ProjectScroller({
  projects,
  onSelect,
  resetKey,
}: {
  projects: Project[];
  onSelect: (p: Project) => void;
  resetKey?: string;
}) {
  const [index, setIndex] = useState(0);
  const [fallback, setFallback] = useState(false);
  const startX = useRef<number | null>(null);
  const count = projects.length;

  // Reset to first card whenever the filter changes.
  useEffect(() => {
    setIndex(0);
  }, [resetKey]);

  // Clamp if the filtered list shrinks below the current index.
  useEffect(() => {
    if (index >= count) setIndex(0);
  }, [index, count]);

  // Reduced-motion / small-screen: render a clean vertical list instead.
  useEffect(() => {
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqMobile = window.matchMedia("(max-width: 639px)");
    const update = () => setFallback(mqReduce.matches || mqMobile.matches);
    update();
    mqReduce.addEventListener("change", update);
    mqMobile.addEventListener("change", update);
    return () => {
      mqReduce.removeEventListener("change", update);
      mqMobile.removeEventListener("change", update);
    };
  }, []);

  // Manual-only: no auto-advance. The user changes slides
  // with arrows, dots, drag/swipe, or keyboard.

  if (count === 0) {
    return <p className="py-10 text-center text-sm text-slate-500">No projects in this category yet.</p>;
  }

  if (fallback) {
    return (
      <ul className="mx-auto flex max-w-2xl flex-col gap-3">
        {projects.map((p) => (
          <li key={p.id}>
            <button
              onClick={() => onSelect(p)}
              className="flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <span className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt="" loading="lazy" className="h-full w-full object-cover" onError={hideImg} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {p.category} · {p.year}
                </span>
                <span className="font-display mt-0.5 block truncate font-bold text-slate-900">{p.title}</span>
                <span className="mt-0.5 block truncate text-[13px] text-slate-500">{p.description}</span>
              </span>
              <ChevronRight size={18} className="shrink-0 text-slate-400" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    );
  }

  const goTo = (i: number) => setIndex(((i % count) + count) % count);
  const prev = () => goTo(index - 1);
  const next = () => goTo(index + 1);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    startX.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (dx <= -SWIPE_THRESHOLD) next();
    else if (dx >= SWIPE_THRESHOLD) prev();
  };
  const onPointerCancel = () => {
    startX.current = null;
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="More projects coverflow"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          prev();
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          next();
        }
      }}
      className="outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 rounded-3xl"
    >
      <div
        className="relative mx-auto h-[440px] max-w-5xl cursor-grab select-none active:cursor-grabbing"
        style={{ perspective: 1400, touchAction: "pan-y" }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >
        {projects.map((p, i) => {
          const d = i - index;
          const abs = Math.abs(d);
          const hidden = abs > MAX_VISIBLE;
          const angle = d === 0 ? 0 : d < 0 ? 42 : -42;
          return (
            <button
              key={p.id}
              onClick={() => (d === 0 ? onSelect(p) : goTo(i))}
              aria-label={d === 0 ? `Open details for ${p.title}` : `Show ${p.title}`}
              aria-current={d === 0}
              tabIndex={hidden ? -1 : 0}
              style={{
                transform: `translateX(-50%) translateX(${d * 200}px) translateZ(${-abs * 170}px) rotateY(${angle}deg) scale(${1 - abs * 0.07})`,
                zIndex: 100 - abs * 10,
                opacity: hidden ? 0 : 1 - abs * 0.22,
                pointerEvents: hidden ? "none" : "auto",
                transition: "transform 0.55s cubic-bezier(0.22, 0.8, 0.28, 1), opacity 0.4s ease",
                transformStyle: "preserve-3d",
              }}
              className={`absolute left-1/2 top-4 w-[270px] overflow-hidden rounded-2xl border bg-white text-left shadow-xl sm:w-[310px] ${
                d === 0
                  ? "border-slate-900/20 shadow-[0_30px_60px_-20px_rgba(15,23,42,0.45)]"
                  : "border-slate-200 shadow-md brightness-[0.93]"
              }`}
            >
              <span className="block h-36 overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.title} loading="lazy" draggable={false} className="h-full w-full object-cover" onError={hideImg} />
              </span>
              <span className="block p-5">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {p.category} · {p.year}
                </span>
                <span className="font-display mt-1.5 block line-clamp-2 font-bold leading-snug text-slate-900">{p.title}</span>
                <span className="mt-1.5 block line-clamp-2 text-[13px] leading-relaxed text-slate-500">{p.description}</span>
                <span className="mt-3 flex flex-wrap gap-1.5">
                  {p.technologies.slice(0, 3).map((t) => (
                    <span key={t} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                      {t}
                    </span>
                  ))}
                </span>
                {d === 0 && (
                  <span className="mt-3 block text-xs font-semibold text-slate-900">Click to open details →</span>
                )}
              </span>
            </button>
          );
        })}

        {count > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous project"
              className="absolute left-1 top-1/2 z-[200] grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-lg backdrop-blur transition hover:bg-white hover:text-slate-900 sm:left-4"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              aria-label="Next project"
              className="absolute right-1 top-1/2 z-[200] grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-lg backdrop-blur transition hover:bg-white hover:text-slate-900 sm:right-4"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      <div className="mt-2 flex flex-col items-center gap-3">
        <p className="text-xs font-medium tabular-nums text-slate-500" aria-live="polite">
          {index + 1} / {count} — drag, swipe, or use ← → keys
        </p>
        {count > 1 && (
          <div className="flex max-w-full flex-wrap justify-center gap-1.5" role="tablist" aria-label="Choose project">
            {projects.map((p, i) => (
              <button
                key={p.id}
                role="tab"
                aria-selected={i === index}
                aria-label={`Go to ${p.title}`}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index ? "w-6 bg-slate-900" : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
