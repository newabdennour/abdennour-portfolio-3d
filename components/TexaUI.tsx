import { useState } from "react";
import {
  Search,
  MapPin,
  Landmark,
  Castle,
  TreePine,
  Waves,
  MountainSnow,
  Plane,
  TrainFront,
  ChevronRight,
  CalendarDays,
  Map as MapIcon,
  Footprints,
} from "lucide-react";

const ministryLogo = encodeURI("/top-projects/tp1/Ministry of Tourism and Handicrafts logo.jpg");
const texaLogo = encodeURI("/top-projects/tp1/texa.png");

const hideImg = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.style.display = "none";
};

const layers = [
  { label: "UNESCO Sites", icon: Landmark },
  { label: "Historical", icon: Castle },
  { label: "National Parks", icon: TreePine },
  { label: "Beaches", icon: Waves },
  { label: "Ski Stations", icon: MountainSnow },
  { label: "Airports", icon: Plane },
  { label: "Train Stations", icon: TrainFront },
];

const circuits = ["Roman Circuit", "Sahara Route", "Mediterranean Coast"];

const myPlan = [
  { name: "Ouled Djellal", count: 4 },
  { name: "Médéa", count: 6 },
  { name: "Dar El Ghaba", count: 2 },
  { name: "Citroën Collection", count: 3 },
  { name: "Restaurant Cap Sabri", count: 1 },
  { name: "Messaad", count: 5 },
  { name: "Hotel El Djazaïr", count: 2 },
  { name: "Assekrem / Hoggar", count: 7 },
  { name: "Restaurant Étoile", count: 1 },
];

const days = [
  {
    day: "Day 1 — Chlef",
    meta: "4 stops · 6.2 km walk",
    desc: "Old town, market & river promenade.",
    grad: "from-sky-400 to-blue-600",
  },
  {
    day: "Day 2 — Tlemcen",
    meta: "5 stops · Art & history",
    desc: "Mansourah, Mechouar & waterfalls.",
    grad: "from-emerald-400 to-teal-600",
  },
  {
    day: "Day 3 — Adrar",
    meta: "3 stops · Desert escape",
    desc: "Ksars, dunes & sunset viewpoint.",
    grad: "from-amber-400 to-orange-600",
  },
];

const cityPins = [
  { name: "Algiers", x: "62%", y: "18%" },
  { name: "Oran", x: "30%", y: "22%" },
  { name: "Constantine", x: "80%", y: "24%" },
];

const southPins = [
  { name: "Ghardaïa", x: "58%", y: "52%" },
  { name: "Tamanrasset", x: "62%", y: "78%" },
];

const routeBadges = [
  { n: "1", x: "38%", y: "30%", label: "Chlef" },
  { n: "2", x: "24%", y: "38%", label: "Tlemcen" },
  { n: "3", x: "48%", y: "66%", label: "Adrar" },
];

export default function TexaUI(): JSX.Element {
  const [tab, setTab] = useState<"itineraire" | "carte">("itineraire");
  const tabBtn = (active: boolean) =>
    `flex items-center justify-center gap-1 rounded-md px-1 py-1 text-[10px] font-semibold ${
      active ? "bg-slate-900 text-white" : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
    }`;
  return (
    <div
      style={{ width: 1060, height: 640 }}
      className="flex flex-col overflow-hidden bg-white text-left text-slate-800"
    >
      {/* Header row */}
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-slate-200 px-3">
        <img
          src={ministryLogo}
          alt="Ministry of Tourism and Handicrafts"
          className="h-8 w-8 rounded-full border border-slate-200 object-cover"
          onError={hideImg}
        />
        <img
          src={texaLogo}
          alt="TEXA"
          className="h-8 w-8 rounded-md object-contain"
          onError={hideImg}
        />
        <p className="text-[12px] font-bold tracking-tight">
          TEXA <span className="font-normal text-slate-500">— Tourism Explorer</span>
        </p>
        <span className="ml-auto rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
          Algeria · live demo
        </span>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Left sidebar 250px */}
        <aside className="flex w-[250px] shrink-0 flex-col gap-2 overflow-hidden border-r border-slate-200 bg-slate-50/60 p-2">
          <label className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-[11px] text-slate-400">
            <Search size={12} className="shrink-0 text-slate-400" />
            <span>Search places, circuits…</span>
          </label>

          <div className="grid grid-cols-2 gap-1">
            <button onClick={() => setTab("itineraire")} aria-pressed={tab === "itineraire"} className={tabBtn(tab === "itineraire")}>
              <Footprints size={11} /> Itinéraire (3)
            </button>
            <button onClick={() => setTab("carte")} aria-pressed={tab === "carte"} className={tabBtn(tab === "carte")}>
              <MapIcon size={11} /> Carte (69)
            </button>
          </div>

          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Map layers
          </p>
          <div className="flex flex-wrap gap-1">
            {layers.map((l) => (
              <span
                key={l.label}
                className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-600"
              >
                <l.icon size={10} className="text-slate-500" />
                {l.label}
              </span>
            ))}
          </div>

          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Suggested circuits
          </p>
          <div className="flex flex-col gap-1">
            {circuits.map((c) => (
              <div
                key={c}
                className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium"
              >
                <span className="flex items-center gap-1.5">
                  <MapPin size={11} className="text-blue-600" />
                  {c}
                </span>
                <ChevronRight size={12} className="text-slate-400" />
              </div>
            ))}
          </div>

          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            My Plan
          </p>
          <ul className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-hidden">
            {myPlan.map((p) => (
              <li
                key={p.name}
                className="flex items-center justify-between rounded px-1.5 py-[3px] text-[11px] hover:bg-white"
              >
                <span className="flex items-center gap-1.5 truncate">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                  <span className="truncate">{p.name}</span>
                </span>
                <span className="rounded-full bg-slate-200/80 px-1.5 text-[10px] font-semibold text-slate-600">
                  {p.count}
                </span>
              </li>
            ))}
          </ul>
        </aside>

        {/* Center map panel */}
        {tab === "itineraire" && (
        <section className="relative min-w-0 flex-1 overflow-hidden bg-slate-100">
          <span className="pointer-events-none absolute left-[8%] top-[10%] select-none text-[28px] font-extrabold tracking-widest text-slate-300/70">
            MOROCCO
          </span>
          <span className="pointer-events-none absolute left-[42%] top-[34%] select-none text-[34px] font-extrabold tracking-widest text-slate-300/80">
            ALGERIA
          </span>
          <span className="pointer-events-none absolute bottom-[8%] right-[6%] select-none text-[11px] font-semibold tracking-widest text-slate-300">
            SAHARA
          </span>

          {/* decorative terrain blobs */}
          <div className="absolute left-[10%] top-[30%] h-40 w-56 rounded-full bg-emerald-100/60 blur-sm" />
          <div className="absolute bottom-[6%] left-[30%] h-44 w-72 rounded-full bg-amber-100/80 blur-sm" />

          {/* dashed route path Chlef -> Tlemcen -> Adrar */}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 500 560" fill="none">
            <path
              d="M190 170 C 150 190, 120 210, 120 215 M120 215 C 140 280, 180 340, 240 370"
              stroke="#2563eb"
              strokeWidth={2.5}
              strokeDasharray="7 6"
              strokeLinecap="round"
            />
          </svg>

          {/* blue city pins */}
          {cityPins.map((p) => (
            <span key={p.name} className="absolute" style={{ left: p.x, top: p.y }}>
              <span className="flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-blue-600 text-white shadow">
                <MapPin size={10} />
              </span>
              <span className="absolute left-2 top-0 whitespace-nowrap rounded bg-white/90 px-1 text-[10px] font-medium text-slate-600 shadow-sm">
                {p.name}
              </span>
            </span>
          ))}

          {/* amber south pins */}
          {southPins.map((p) => (
            <span key={p.name} className="absolute" style={{ left: p.x, top: p.y }}>
              <span className="flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-amber-500 text-white shadow">
                <MapPin size={10} />
              </span>
              <span className="absolute left-2 top-0 whitespace-nowrap rounded bg-white/90 px-1 text-[10px] font-medium text-slate-600 shadow-sm">
                {p.name}
              </span>
            </span>
          ))}

          {/* numbered route badges 1/2/3 */}
          {routeBadges.map((b) => (
            <span key={b.n} className="absolute" style={{ left: b.x, top: b.y }}>
              <span className="flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-slate-900 text-[11px] font-bold text-white ring-2 ring-white">
                {b.n}
              </span>
              <span className="absolute left-4 top-0 whitespace-nowrap rounded bg-slate-900 px-1 py-px text-[10px] font-semibold text-white">
                {b.label}
              </span>
            </span>
          ))}

          {/* bottom Plan/Carte toggle */}
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center rounded-full border border-slate-200 bg-white p-0.5 text-[11px] font-semibold shadow">
            <span className="rounded-full bg-slate-900 px-3 py-1 text-white">Plan</span>
            <button onClick={() => setTab("carte")} className="rounded-full px-3 py-1 text-slate-500 hover:text-slate-800">Carte</button>
          </div>
        </section>
        )}
        {tab === "carte" && (
          <section className="min-w-0 flex-1 overflow-y-auto bg-slate-50 p-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">69 places · Algeria</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {[...myPlan, ...cityPins.map((p) => ({ name: p.name, count: 1 })), ...southPins.map((p) => ({ name: p.name, count: 1 }))].map((p) => (
                <div key={p.name} className="rounded-lg border border-slate-200 bg-white p-2">
                  <div className="flex h-12 items-center justify-center rounded-md bg-gradient-to-br from-sky-100 to-blue-200">
                    <MapPin size={16} className="text-blue-600" />
                  </div>
                  <p className="mt-1 truncate text-[11px] font-bold text-slate-800">{p.name}</p>
                  <p className="text-[10px] text-slate-500">{p.count} {p.count === 1 ? "place" : "places"}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Right journey panel 300px */}
        <aside className="flex w-[300px] shrink-0 flex-col gap-2 overflow-hidden border-l border-slate-200 bg-white p-2.5">
          <div>
            <p className="flex items-center gap-1 text-[12px] font-bold">
              <CalendarDays size={12} className="text-blue-600" /> Your 3-Day Journey
            </p>
            <p className="mt-0.5 text-[11px] font-semibold text-blue-700">
              Chlef → Tlemcen → Adrar
            </p>
            <p className="text-[10px] text-slate-500">3 days · 12 stops · 480 km</p>
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden">
            {days.map((d) => (
              <div
                key={d.day}
                className="flex gap-2 rounded-lg border border-slate-200 p-1.5"
              >
                <div
                  className={`h-[86px] w-[86px] shrink-0 rounded-md bg-gradient-to-br ${d.grad}`}
                />
                <div className="min-w-0">
                  <p className="text-[11px] font-bold">{d.day}</p>
                  <p className="text-[10px] font-medium text-slate-500">{d.meta}</p>
                  <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-slate-600">
                    {d.desc}
                  </p>
                  <span className="mt-1 inline-block rounded-full bg-blue-50 px-2 py-px text-[10px] font-semibold text-blue-700">
                    View details
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="rounded-md bg-blue-600 py-1.5 text-[11px] font-bold text-white">
            Export itinerary
          </button>
        </aside>
      </div>
    </div>
  );
}
