import { useState } from "react";
import TexaMap from "./TexaMap";
import {
  BedDouble,
  Car,
  Castle,
  ChevronRight,
  Landmark,
  MapPin,
  MountainSnow,
  Plane,
  Search,
  Tent,
  TrainFront,
  TreePine,
  Waves,
  CalendarDays,
  Footprints,
  X,
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
    color: "text-emerald-700",
    dot: "bg-emerald-600",
    transport: { icon: Plane, label: "Flight" },
    stay: "1 night",
    place: "Mediterranean coast",
    grad: "from-sky-400 to-blue-700",
    thumb: Waves,
  },
  {
    day: "Day 2 — Tlemcen",
    color: "text-blue-700",
    dot: "bg-blue-700",
    transport: { icon: Car, label: "Scenic drive" },
    stay: "2 nights",
    place: "El Mechouar Palace + Mansourah ruins",
    grad: "from-amber-500 to-stone-700",
    thumb: Castle,
  },
  {
    day: "Day 3 — Adrar",
    color: "text-amber-600",
    dot: "bg-amber-500",
    transport: { icon: Plane, label: "Flight + transfer" },
    stay: "2 nights",
    place: "Oasis / desert",
    grad: "from-orange-400 to-rose-600",
    thumb: Tent,
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
              <MapPin size={11} /> Carte (69)
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

        {/* Center map panel — real open-source map (OpenStreetMap + Leaflet) */}
        {tab === "itineraire" && (
        <section className="relative min-w-0 flex-1 overflow-hidden bg-slate-100">
          <TexaMap />

          {/* bottom Plan/Carte toggle */}
          <div className="absolute bottom-3 left-1/2 z-[500] flex -translate-x-1/2 items-center rounded-full border border-slate-200 bg-white p-0.5 text-[11px] font-semibold shadow">
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

        {/* Right journey panel — 3-day timeline */}
        <aside className="flex w-[300px] shrink-0 flex-col overflow-hidden border-l border-slate-200 bg-white">
          <div className="flex shrink-0 items-start gap-2 border-b border-slate-100 px-3 py-2.5">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-emerald-700 text-white">
              <Landmark size={14} />
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block text-[12px] font-extrabold tracking-tight text-slate-900">Your 3-Day Journey</span>
              <span className="block truncate text-[10px] text-slate-500">Chlef → Tlemcen → Adrar</span>
            </span>
            <span className="ml-auto flex shrink-0 items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-1 text-[10px] font-bold text-emerald-700">
              <CalendarDays size={11} /> 3 days
            </span>
            <X size={13} className="mt-1 shrink-0 text-slate-400" />
          </div>
          <div className="min-h-0 flex-1 overflow-hidden px-3 py-2">
            {days.map((d, i) => (
              <div key={d.day} className="flex gap-2">
                <div className="flex flex-col items-center">
                  <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-extrabold text-white ${d.dot}`}>
                    {i + 1}
                  </span>
                  {i < days.length - 1 && <span className="w-px flex-1 bg-emerald-200/70" style={{ minHeight: 34 }} />}
                </div>
                <div className="min-w-0 flex-1 pb-3">
                  <p className={`text-[11.5px] font-extrabold ${d.color}`}>{d.day}</p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[10px] text-slate-600">
                    <span className="inline-flex items-center gap-0.5"><d.transport.icon size={10} className="text-slate-500" /> {d.transport.label}</span>
                    <span className="inline-flex items-center gap-0.5"><BedDouble size={10} className="text-slate-500" /> {d.stay}</span>
                  </p>
                  <p className="mt-0.5 flex items-center gap-0.5 truncate text-[10px] text-slate-500">
                    <MapPin size={10} className="shrink-0 text-slate-400" />
                    <span className="truncate">{d.place}</span>
                  </p>
                </div>
                <div className="flex shrink-0 items-start gap-0.5">
                  <span className={`grid h-[54px] w-[64px] place-items-center overflow-hidden rounded-lg bg-gradient-to-br ${d.grad}`}>
                    <d.thumb size={18} className="text-white/90" />
                  </span>
                  <ChevronRight size={13} className="mt-5 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
          <div className="shrink-0 border-t border-slate-100 p-2.5">
            <button className="w-full rounded-md bg-blue-600 py-1.5 text-[11px] font-bold text-white">
              Export itinerary
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
