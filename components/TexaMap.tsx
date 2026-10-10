"use client";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

const CITIES: { name: string; pos: [number, number]; kind: "city" | "south" | "route"; label?: string }[] = [
  { name: "Algiers", pos: [36.7538, 3.0588], kind: "city" },
  { name: "Oran", pos: [35.6987, -0.6349], kind: "city" },
  { name: "Constantine", pos: [36.365, 6.6147], kind: "city" },
  { name: "Ghardaïa", pos: [32.489, 3.6735], kind: "south" },
  { name: "Tamanrasset", pos: [22.785, 5.5228], kind: "south" },
  { name: "Chlef (1)", pos: [36.1647, 1.3317], kind: "route", label: "1 · Chlef" },
  { name: "Tlemcen (2)", pos: [34.8789, -1.315], kind: "route", label: "2 · Tlemcen" },
  { name: "Adrar (3)", pos: [27.8742, -0.2939], kind: "route", label: "3 · Adrar" },
];

export default function TexaMap() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: import("leaflet").Map | null = null;
    let cancelled = false;
    (async () => {
      const L = await import("leaflet");
      if (cancelled || !ref.current) return;
      // Fix: avoid double-init on React strict re-mount
      if ((ref.current as HTMLElement & { _leaflet_id?: unknown })._leaflet_id) return;

      map = L.map(ref.current, {
        center: [28.5, 2.2],
        zoom: 5,
        minZoom: 4,
        maxZoom: 12,
        scrollWheelZoom: true,
        attributionControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const dot = (color: string) =>
        L.divIcon({
          className: "",
          html: `<span style="display:flex;width:18px;height:18px;border-radius:9999px;background:${color};border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35)"></span>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        });

      const badge = (n: string) =>
        L.divIcon({
          className: "",
          html: `<span style="display:flex;width:24px;height:24px;border-radius:9999px;background:#0f172a;color:#fff;font:700 12px/24px system-ui;text-align:center;justify-content:center;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35)">${n}</span>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

      CITIES.forEach((c) => {
        const icon = c.kind === "city" ? dot("#2563eb") : c.kind === "south" ? dot("#f59e0b") : badge(c.name.match(/\((\d)\)/)?.[1] ?? "•");
        L.marker(c.pos, { icon }).addTo(map!).bindPopup(`<b>${c.label ?? c.name}</b><br/>Algeria`);
      });

      L.polyline(
        [
          [36.1647, 1.3317],
          [34.8789, -1.315],
          [27.8742, -0.2939],
        ],
        { color: "#2563eb", weight: 3, dashArray: "8 6", opacity: 0.9 }
      ).addTo(map);
    })();
    return () => {
      cancelled = true;
      if (map) {
        map.remove();
        map = null;
      }
    };
  }, []);

  return (
    <div className="texa-leaflet relative h-full min-h-[320px] w-full">
      <div ref={ref} className="absolute inset-0 z-0" style={{ minHeight: 320 }} aria-label="OpenStreetMap of Algeria with TEXA itinerary" />
      <span className="pointer-events-none absolute bottom-2 left-2 z-[500] rounded bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-slate-600 shadow">
        OpenStreetMap · Chlef → Tlemcen → Adrar
      </span>
      <style>{`.texa-leaflet .leaflet-container{font:inherit;background:#e2e8f0}.texa-leaflet .leaflet-control-zoom{margin-top:10px}`}</style>
    </div>
  );
}
