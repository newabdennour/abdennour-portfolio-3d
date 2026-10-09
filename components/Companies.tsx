"use client";
import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { companies } from "@/data/portfolio";

const CompanyRing = dynamic(() => import("./CompanyRing"), { ssr: false });

function LogoCard({ name, logo, tag }: { name: string; logo: string; tag: string }) {
  return (
    <div className="flex w-56 shrink-0 items-center gap-3 rounded-2xl border border-[#e5ddcc] bg-white/95 px-4 py-3 shadow-[0_10px_24px_-14px_rgba(15,23,42,0.25)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={encodeURI(logo)}
        alt={name}
        loading="lazy"
        className="h-12 w-12 shrink-0 rounded-lg bg-white object-contain"
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
      <span className="min-w-0">
        <span className="block truncate text-sm font-bold text-slate-900">{name}</span>
        <span className="block text-xs text-slate-500">{tag}</span>
      </span>
    </div>
  );
}

export default function Companies() {
  const reduce = useReducedMotion();
  const rowA = companies.slice(0, 6);
  const rowB = companies.slice(6);
  return (
    <section id="companies" className="paper-bg relative py-20 md:py-24">
      <div className="container-x">
        <SectionHeading
          title={<>Companies & institutes I&apos;ve worked with</>}
          subtitle="Ministries, telecoms, energy, research labs and enterprises across Algeria, France and Canada."
        />
      </div>
      {reduce ? (
        <div className="container-x flex flex-wrap justify-center gap-3">
          {companies.map((c) => (
            <LogoCard key={c.name} {...c} />
          ))}
        </div>
      ) : (
        <div className="[perspective:1200px]">
          <div className="marquee-row animate-[marquee-left_42s_linear_infinite] hover:[animation-play-state:paused]">
            {[...rowA, ...rowA].map((c, i) => (
              <LogoCard key={`${c.name}-${i}`} {...c} />
            ))}
          </div>
          <div className="marquee-row mt-4 animate-[marquee-right_48s_linear_infinite] hover:[animation-play-state:paused]">
            {[...rowB, ...rowB].map((c, i) => (
              <LogoCard key={`${c.name}-${i}`} {...c} />
            ))}
          </div>
        </div>
      )}
      <div className="container-x mt-8">
        <CompanyRing logos={companies.map((c) => encodeURI(c.logo))} />
      </div>
    </section>
  );
}
