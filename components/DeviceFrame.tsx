import type { ReactNode } from "react";

// CSS-only 3D device frames — no WebGL, no Canvas, no network, no buttons.
// .browser3d / .phone3d styles live in app/globals.css (pure transforms +
// shadows). Sizes are fluid so nothing gets cut off with scrollbars.

export function BrowserFrame({
  children,
  label,
  tilt = "left",
}: {
  children: ReactNode;
  label: string;
  tilt?: "left" | "right";
}) {
  return (
    <div aria-label={label} className="browser3d-scene mx-auto w-full">
      <div className={`browser3d ${tilt === "right" ? "browser3d-right" : "browser3d-left"}`}>
        <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-100 px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="ml-2 flex-1 truncate rounded-md bg-white px-2 py-0.5 text-[10px] text-slate-400">
            {label}
          </span>
        </div>
        <div className="browser3d-screen noscroll">{children}</div>
      </div>
    </div>
  );
}

export function MonitorFrame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div aria-label={label} className="mx-auto w-full overflow-hidden rounded-2xl bg-slate-900 p-2 shadow-xl">
      <div className="noscroll overflow-hidden rounded-xl bg-white">{children}</div>
      <div className="mx-auto mt-2 h-8 w-24 rounded-b-xl bg-slate-700" />
    </div>
  );
}

export function PhoneFrame({
  children,
  label,
  tilt = "right",
}: {
  children: ReactNode;
  label: string;
  tilt?: "left" | "right";
}) {
  return (
    <div aria-label={label} className="phone3d-scene mx-auto w-fit">
      <div className={`phone3d ${tilt === "left" ? "phone3d-left" : "phone3d-right"}`}>
        <span aria-hidden className="phone3d-btn phone3d-btn-left" />
        <span aria-hidden className="phone3d-btn phone3d-btn-right" />
        <div className="flex items-center justify-center px-2 pb-1 pt-2.5">
          <span aria-hidden className="h-5 w-24 rounded-full bg-black" />
        </div>
        <div className="phone3d-screen noscroll">{children}</div>
        <div className="flex items-center justify-center px-2 py-2.5">
          <span aria-hidden className="h-1 w-24 rounded-full bg-slate-700" />
        </div>
      </div>
    </div>
  );
}
