"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  Bell,
  Box,
  Check,
  ChevronRight,
  Globe,
  Home,
  Mail,
  MapPin,
  Minus,
  Package,
  Phone,
  Plus,
  Printer,
  Search,
  Settings,
  ShoppingCart,
  Star,
  Store,
  Trash2,
  Truck,
  Wallet,
  X,
} from "lucide-react";

const posteLogo = encodeURI("/top-projects/tp3/algerie post.png");

type Tab = "home" | "orders" | "products" | "settings";
type Status = "Delivered" | "Shipped" | "Pending" | "Cancelled";

type Order = {
  id: string;
  customer: string;
  wilaya: string;
  phone: string;
  items: string;
  date: string;
  amount: number;
  status: Status;
};

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: string;
  grad: string;
  Icon: typeof Box;
};

const initialOrders: Order[] = [
  { id: "#DZ-9041", customer: "Yasmine B.", wilaya: "Alger", phone: "0550 12 34 56", items: "EMS Pack 5kg ×1", date: "Today 10:24", amount: 4800, status: "Delivered" },
  { id: "#DZ-9040", customer: "Mohamed K.", wilaya: "Oran", phone: "0661 88 20 11", items: "Post Box M ×2", date: "Today 09:12", amount: 12300, status: "Shipped" },
  { id: "#DZ-9039", customer: "Sara L.", wilaya: "Constantine", phone: "0770 45 90 33", items: "Stamp Set 2024 ×1", date: "Yesterday", amount: 2150, status: "Pending" },
  { id: "#DZ-9038", customer: "Amine T.", wilaya: "Blida", phone: "0555 67 12 89", items: "Express Label ×5", date: "Yesterday", amount: 7900, status: "Delivered" },
  { id: "#DZ-9037", customer: "Lina M.", wilaya: "Sétif", phone: "0698 11 44 72", items: "EMS Pack 5kg ×1", date: "2 days ago", amount: 3400, status: "Cancelled" },
  { id: "#DZ-9036", customer: "Riad H.", wilaya: "Annaba", phone: "0559 30 18 24", items: "Post Box M ×1 + Labels", date: "2 days ago", amount: 5600, status: "Delivered" },
];

const initialProducts: Product[] = [
  { id: "p1", name: "EMS Pack 5kg", category: "Parcels", price: 1200, stock: 42, rating: "4.9", grad: "from-amber-400 to-orange-600", Icon: Box },
  { id: "p2", name: "Stamp Set 2024", category: "Stamps", price: 850, stock: 8, rating: "4.8", grad: "from-sky-400 to-blue-700", Icon: Mail },
  { id: "p3", name: "Post Box M", category: "Packaging", price: 2400, stock: 17, rating: "4.7", grad: "from-emerald-400 to-teal-700", Icon: Package },
  { id: "p4", name: "Express Label", category: "Labels", price: 300, stock: 230, rating: "4.9", grad: "from-violet-400 to-purple-700", Icon: Truck },
  { id: "p5", name: "EMS Pack 10kg", category: "Parcels", price: 2100, stock: 25, rating: "4.8", grad: "from-rose-400 to-red-600", Icon: Box },
  { id: "p6", name: "Registered Mail", category: "Labels", price: 450, stock: 5, rating: "4.6", grad: "from-slate-500 to-slate-800", Icon: Mail },
];

const statusPill: Record<Status, string> = {
  Delivered: "bg-emerald-100 text-emerald-700",
  Shipped: "bg-blue-100 text-blue-700",
  Pending: "bg-amber-100 text-amber-700",
  Cancelled: "bg-red-100 text-red-600",
};

const steps: Status[] = ["Pending", "Shipped", "Delivered"];

const fmtDA = (n: number) => `${n.toLocaleString("fr-DZ")} DA`;

function hideImg(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.display = "none";
}

export default function EPosteUI(): JSX.Element {
  const [tab, setTab] = useState<Tab>("home");
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orderFilter, setOrderFilter] = useState<"All" | Status>("All");
  const [orderQuery, setOrderQuery] = useState("");
  const [productQuery, setProductQuery] = useState("");
  const [productCat, setProductCat] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState([
    { id: 1, title: "New order #DZ-9041", sub: "EMS Pack 5kg · Alger", time: "2m", unread: true },
    { id: 2, title: "Low stock: Stamp Set", sub: "Only 8 left — restock soon", time: "1h", unread: true },
    { id: 3, title: "EMS pickup scheduled", sub: "Courier arrives at 14:00", time: "3h", unread: false },
  ]);
  const [toast, setToast] = useState<string | null>(null);
  const [newOrderOpen, setNewOrderOpen] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftWilaya, setDraftWilaya] = useState("Alger");
  const [draftProduct, setDraftProduct] = useState(initialProducts[0].id);
  const [pushOn, setPushOn] = useState(true);
  const [smsOn, setSmsOn] = useState(true);
  const [autoPrint, setAutoPrint] = useState(false);
  const [codOn, setCodOn] = useState(true);
  const [lang, setLang] = useState<"FR" | "AR">("FR");

  const unread = notifs.filter((n) => n.unread).length;

  function flash(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  }

  const revenue = useMemo(() => orders.filter((o) => o.status !== "Cancelled").reduce((s, o) => s + o.amount, 0), [orders]);
  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  const lowStock = products.filter((p) => p.stock < 10).length;

  const filteredOrders = orders.filter((o) => {
    const okF = orderFilter === "All" || o.status === orderFilter;
    const q = orderQuery.trim().toLowerCase();
    const okQ = !q || `${o.id} ${o.customer} ${o.wilaya}`.toLowerCase().includes(q);
    return okF && okQ;
  });

  const cats = ["All", ...Array.from(new Set(products.map((p) => p.category)))];
  const filteredProducts = products.filter((p) => {
    const okC = productCat === "All" || p.category === productCat;
    const okQ = !productQuery.trim() || p.name.toLowerCase().includes(productQuery.trim().toLowerCase());
    return okC && okQ;
  });

  const weekBars = [38, 62, 45, 80, 55, 92, 70];

  function setStatus(id: string, status: Status) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    setSelectedOrder((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
    flash(`${id} → ${status}`);
  }

  function bumpStock(id: string, delta: number) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p)));
  }

  function createOrder() {
    if (!draftName.trim()) {
      flash("Enter a customer name");
      return;
    }
    const prod = products.find((p) => p.id === draftProduct);
    const id = `#DZ-${9042 + orders.length}`;
    const order: Order = {
      id,
      customer: draftName.trim(),
      wilaya: draftWilaya,
      phone: "0550 00 00 00",
      items: `${prod?.name ?? "Parcel"} ×1`,
      date: "Just now",
      amount: prod?.price ?? 1500,
      status: "Pending",
    };
    setOrders((prev) => [order, ...prev]);
    setNewOrderOpen(false);
    setDraftName("");
    setTab("orders");
    setOrderFilter("All");
    flash(`Order ${id} created`);
  }

  const nav: { id: Tab; label: string; Icon: typeof Home; badge?: number }[] = [
    { id: "home", label: "Home", Icon: Home },
    { id: "orders", label: "Orders", Icon: ShoppingCart, badge: pendingCount },
    { id: "products", label: "Products", Icon: Package, badge: lowStock },
    { id: "settings", label: "Settings", Icon: Settings },
  ];

  const titles: Record<Tab, { title: string; sub: string }> = {
    home: { title: "E-Store Manager", sub: "Algérie Poste · seller demo" },
    orders: { title: "Orders", sub: `${orders.length} total · ${pendingCount} pending` },
    products: { title: "Products", sub: `${products.length} SKUs · ${lowStock} low stock` },
    settings: { title: "Settings", sub: "Store preferences" },
  };

  return (
    <div className="relative flex h-[600px] w-full flex-col overflow-hidden bg-slate-100 text-left text-slate-800">
      {/* Header */}
      <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-[#003A93] via-[#004EBB] to-[#0072CE] px-3 pb-3 pt-2.5 text-white">
        <span aria-hidden className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-yellow-400/20" />
        <span aria-hidden className="pointer-events-none absolute -bottom-12 right-16 h-24 w-24 rounded-full bg-white/10" />
        <div className="relative flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-white p-0.5 shadow">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={posteLogo} alt="Algérie Poste" className="h-full w-full object-contain" onError={hideImg} />
          </span>
          <div className="min-w-0">
            <p className="text-[12px] font-extrabold leading-tight">{titles[tab].title}</p>
            <p className="truncate text-[10px] leading-tight text-blue-100">{titles[tab].sub}</p>
          </div>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notifications"
            className="relative ml-auto rounded-full border border-white/25 bg-white/15 p-2 backdrop-blur transition hover:bg-white/25"
          >
            <Bell size={14} />
            {unread > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-yellow-400 px-1 text-[9px] font-extrabold text-slate-900">
                {unread}
              </span>
            )}
          </button>
        </div>

        {(tab === "home" || tab === "orders") && (
          <label className="relative mt-2.5 flex items-center gap-1.5 rounded-xl bg-white px-2.5 py-2 text-slate-500 shadow">
            <Search size={13} className="shrink-0 text-slate-400" />
            <input
              value={tab === "home" ? productQuery : orderQuery}
              onChange={(e) => (tab === "home" ? setProductQuery(e.target.value) : setOrderQuery(e.target.value))}
              onFocus={() => {
                if (tab === "home" && productQuery === "") setTab("products");
              }}
              placeholder={tab === "home" ? "Search products, parcels, stamps…" : "Search order, customer, wilaya…"}
              className="w-full bg-transparent text-[11px] font-medium text-slate-800 outline-none placeholder:text-slate-400"
            />
            {(tab === "home" ? productQuery : orderQuery) && (
              <button
                onClick={() => (tab === "home" ? setProductQuery("") : setOrderQuery(""))}
                aria-label="Clear search"
                className="rounded-full bg-slate-100 p-0.5 text-slate-500"
              >
                <X size={11} />
              </button>
            )}
          </label>
        )}

        {/* Notifications dropdown */}
        <AnimatePresence>
          {notifOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-x-3 top-[58px] z-30 overflow-hidden rounded-2xl bg-white text-slate-800 shadow-2xl"
            >
              <div className="flex items-center justify-between px-3 py-2">
                <p className="text-[11px] font-extrabold">Notifications</p>
                <button
                  onClick={() => setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })))}
                  className="text-[10px] font-bold text-blue-700 hover:underline"
                >
                  Mark all read
                </button>
              </div>
              <div className="max-h-44 overflow-y-auto">
                {notifs.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => setNotifs((prev) => prev.map((x) => (x.id === n.id ? { ...x, unread: false } : x)))}
                    className="flex w-full items-start gap-2 border-t border-slate-100 px-3 py-2 text-left hover:bg-slate-50"
                  >
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.unread ? "bg-blue-600" : "bg-slate-200"}`} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[11px] font-bold">{n.title}</span>
                      <span className="block truncate text-[10px] text-slate-500">{n.sub}</span>
                    </span>
                    <span className="shrink-0 text-[10px] text-slate-400">{n.time}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Body */}
      <div className="relative min-h-0 flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {tab === "home" && (
            <motion.div key="home" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.18 }} className="flex flex-col gap-2.5 p-2.5">
              {/* Greeting + revenue */}
              <div className="overflow-hidden rounded-2xl bg-white p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold">Salam, Amine 👋</p>
                    <p className="text-[10px] text-slate-500">Alger Centre Store · DZ-16</p>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-extrabold text-emerald-700">
                    <ArrowUpRight size={11} /> +12.4%
                  </span>
                </div>
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Revenue this week</p>
                <p className="text-[20px] font-extrabold tracking-tight text-slate-900">{fmtDA(revenue)}</p>
                <div className="mt-2 flex h-12 items-end gap-1">
                  {weekBars.map((h, i) => (
                    <div key={i} className="flex flex-1 flex-col items-center gap-1">
                      <div
                        style={{ height: `${h}%` }}
                        className={`w-full rounded-md ${i === 5 ? "bg-gradient-to-t from-[#003A93] to-[#2E9BFF]" : "bg-blue-100"}`}
                      />
                      <span className="text-[8px] font-bold text-slate-400">{["S", "M", "T", "W", "T", "F", "S"][i]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { label: "Orders", value: String(orders.length), sub: `${pendingCount} pending`, Icon: ShoppingCart, bg: "bg-blue-600", go: "orders" as Tab },
                  { label: "Products", value: String(products.length), sub: `${lowStock} low stock`, Icon: Package, bg: "bg-violet-600", go: "products" as Tab },
                  { label: "Cash on delivery", value: fmtDA(revenue).split(" ")[0], sub: "collected", Icon: Wallet, bg: "bg-emerald-600", go: "orders" as Tab },
                ].map((s) => (
                  <button key={s.label} onClick={() => setTab(s.go)} className="rounded-2xl bg-white p-2 text-left shadow-sm transition hover:shadow-md active:scale-[0.98]">
                    <span className={`grid h-7 w-7 place-items-center rounded-lg text-white ${s.bg}`}>
                      <s.Icon size={14} />
                    </span>
                    <p className="mt-1.5 truncate text-[13px] font-extrabold leading-none">{s.value}</p>
                    <p className="mt-0.5 text-[10px] font-semibold text-slate-500">{s.label}</p>
                    <p className="truncate text-[9px] text-slate-400">{s.sub}</p>
                  </button>
                ))}
              </div>

              {/* Quick actions */}
              <div className="rounded-2xl bg-white p-2.5 shadow-sm">
                <p className="px-0.5 text-[11px] font-extrabold">Quick actions</p>
                <div className="mt-2 grid grid-cols-4 gap-1.5">
                  {[
                    { label: "New order", Icon: Plus, fn: () => setNewOrderOpen(true) },
                    { label: "Track EMS", Icon: Truck, fn: () => { setTab("orders"); setOrderFilter("Shipped"); } },
                    { label: "Print label", Icon: Printer, fn: () => flash("Label sent to printer") },
                    { label: "Call support", Icon: Phone, fn: () => flash("Calling 3021 — Algérie Poste…") },
                  ].map((a) => (
                    <button key={a.label} onClick={a.fn} className="flex flex-col items-center gap-1 rounded-xl bg-slate-50 px-1 py-2 transition hover:bg-blue-50 active:scale-95">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-900 text-white">
                        <a.Icon size={14} />
                      </span>
                      <span className="text-[9px] font-bold leading-tight text-slate-700">{a.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent orders */}
              <div className="rounded-2xl bg-white p-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-extrabold">Recent orders</p>
                  <button onClick={() => setTab("orders")} className="flex items-center gap-0.5 text-[10px] font-bold text-blue-700">
                    See all <ChevronRight size={12} />
                  </button>
                </div>
                <div className="mt-1.5 flex flex-col">
                  {orders.slice(0, 3).map((o) => (
                    <button key={o.id} onClick={() => setSelectedOrder(o)} className="flex items-center gap-2 border-t border-slate-100 py-2 text-left first:border-0 first:pt-1 last:pb-0 hover:bg-slate-50">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-[10px] font-extrabold text-slate-700">
                        {o.customer.slice(0, 1)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[11px] font-bold">{o.id} · {o.customer}</span>
                        <span className="block truncate text-[10px] text-slate-500">{o.wilaya} · {o.date}</span>
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold ${statusPill[o.status]}`}>{o.status}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Top products carousel */}
              <div className="rounded-2xl bg-white p-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-extrabold">Top products</p>
                  <button onClick={() => setTab("products")} className="flex items-center gap-0.5 text-[10px] font-bold text-blue-700">
                    Manage <ChevronRight size={12} />
                  </button>
                </div>
                <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1">
                  {products.slice(0, 4).map((p) => (
                    <button key={p.id} onClick={() => { setTab("products"); setProductQuery(p.name); }} className="w-[108px] shrink-0 rounded-xl border border-slate-100 p-1.5 text-left transition hover:shadow-md">
                      <span className={`flex h-14 items-end justify-end rounded-lg bg-gradient-to-br p-1 ${p.grad}`}>
                        <span className="flex items-center gap-0.5 rounded-full bg-white/95 px-1.5 py-px text-[9px] font-extrabold text-slate-700">
                          <Star size={8} className="fill-amber-400 text-amber-400" />{p.rating}
                        </span>
                      </span>
                      <span className="mt-1 block truncate text-[10px] font-bold">{p.name}</span>
                      <span className="block text-[10px] font-extrabold text-blue-700">{fmtDA(p.price)}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-1" />
            </motion.div>
          )}

          {tab === "orders" && (
            <motion.div key="orders" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.18 }} className="flex flex-col gap-2 p-2.5">
              <div className="flex gap-1 overflow-x-auto pb-0.5">
                {(["All", "Pending", "Shipped", "Delivered", "Cancelled"] as const).map((f) => {
                  const count = f === "All" ? orders.length : orders.filter((o) => o.status === f).length;
                  const active = orderFilter === f;
                  return (
                    <button
                      key={f}
                      onClick={() => setOrderFilter(f)}
                      aria-pressed={active}
                      className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-[10px] font-bold transition ${active ? "bg-slate-900 text-white shadow" : "bg-white text-slate-600 shadow-sm hover:bg-slate-50"}`}
                    >
                      {f}
                      <span className={`rounded-full px-1 text-[9px] ${active ? "bg-white/20" : "bg-slate-100"}`}>{count}</span>
                    </button>
                  );
                })}
              </div>
              {filteredOrders.length === 0 && (
                <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
                  <p className="text-[12px] font-bold">No orders found</p>
                  <p className="mt-1 text-[10px] text-slate-500">Try another filter or create one.</p>
                  <button onClick={() => setNewOrderOpen(true)} className="mt-3 rounded-xl bg-slate-900 px-4 py-2 text-[11px] font-bold text-white">+ New order</button>
                </div>
              )}
              {filteredOrders.map((o) => (
                <button key={o.id} onClick={() => setSelectedOrder(o)} className="rounded-2xl bg-white p-2.5 text-left shadow-sm transition hover:shadow-md active:scale-[0.99]">
                  <div className="flex items-center gap-2">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-[11px] font-extrabold text-white">
                      {o.customer.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1 text-[11px] font-extrabold">{o.id} <span className={`rounded-full px-1.5 py-px text-[9px] ${statusPill[o.status]}`}>{o.status}</span></span>
                      <span className="block truncate text-[10px] text-slate-500">{o.customer} · {o.wilaya}</span>
                    </span>
                    <span className="text-right">
                      <span className="block text-[11px] font-extrabold">{fmtDA(o.amount)}</span>
                      <span className="block text-[9px] text-slate-400">{o.date}</span>
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-500">
                    <MapPin size={10} className="text-slate-400" /> <span className="truncate">{o.items}</span>
                    <ChevronRight size={13} className="ml-auto shrink-0 text-slate-300" />
                  </div>
                </button>
              ))}
              <button onClick={() => setNewOrderOpen(true)} className="mt-1 flex items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/60 py-3 text-[11px] font-extrabold text-blue-700 transition hover:bg-blue-50">
                <Plus size={14} /> New order
              </button>
              <div className="h-1" />
            </motion.div>
          )}

          {tab === "products" && (
            <motion.div key="products" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.18 }} className="flex flex-col gap-2 p-2.5">
              <label className="flex items-center gap-1.5 rounded-xl bg-white px-2.5 py-2 text-slate-500 shadow-sm">
                <Search size={13} className="text-slate-400" />
                <input value={productQuery} onChange={(e) => setProductQuery(e.target.value)} placeholder="Search products…" className="w-full bg-transparent text-[11px] font-medium outline-none placeholder:text-slate-400" />
                {productQuery && <button onClick={() => setProductQuery("")} aria-label="Clear"><X size={12} /></button>}
              </label>
              <div className="flex gap-1 overflow-x-auto pb-0.5">
                {cats.map((c) => (
                  <button key={c} onClick={() => setProductCat(c)} className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-bold transition ${productCat === c ? "bg-slate-900 text-white" : "bg-white text-slate-600 shadow-sm"}`}>{c}</button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {filteredProducts.map((p) => (
                  <div key={p.id} className="rounded-2xl bg-white p-1.5 shadow-sm">
                    <div className={`relative flex h-16 items-end justify-between rounded-xl bg-gradient-to-br p-1.5 ${p.grad}`}>
                      <p.Icon size={22} className="text-white/90" />
                      <span className="flex items-center gap-0.5 rounded-full bg-white/95 px-1.5 py-px text-[9px] font-extrabold text-slate-700">
                        <Star size={8} className="fill-amber-400 text-amber-400" />{p.rating}
                      </span>
                      {p.stock < 10 && <span className="absolute left-1.5 top-1.5 rounded-full bg-red-600 px-1.5 py-px text-[8px] font-extrabold text-white">LOW · {p.stock}</span>}
                    </div>
                    <p className="mt-1.5 truncate px-0.5 text-[11px] font-extrabold">{p.name}</p>
                    <p className="px-0.5 text-[10px] text-slate-500">{p.category} · stock {p.stock}</p>
                    <p className="px-0.5 text-[11px] font-extrabold text-blue-700">{fmtDA(p.price)}</p>
                    <div className="mt-1.5 flex items-center justify-between rounded-xl bg-slate-50 p-1">
                      <button onClick={() => bumpStock(p.id, -1)} aria-label="Decrease stock" className="grid h-6 w-6 place-items-center rounded-lg bg-white text-slate-700 shadow-sm transition active:scale-90"><Minus size={12} /></button>
                      <span className="text-[11px] font-extrabold">{p.stock}</span>
                      <button onClick={() => { bumpStock(p.id, 1); }} aria-label="Increase stock" className="grid h-6 w-6 place-items-center rounded-lg bg-slate-900 text-white shadow-sm transition active:scale-90"><Plus size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>
              {filteredProducts.length === 0 && <p className="rounded-2xl bg-white p-4 text-center text-[11px] text-slate-500 shadow-sm">No products match “{productQuery}”.</p>}
              <div className="h-1" />
            </motion.div>
          )}

          {tab === "settings" && (
            <motion.div key="settings" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.18 }} className="flex flex-col gap-2 p-2.5">
              <div className="flex items-center gap-2 rounded-2xl bg-white p-3 shadow-sm">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#003A93] to-[#2E9BFF] text-white"><Store size={18} /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-extrabold">Alger Centre Store</p>
                  <p className="truncate text-[10px] text-slate-500">Rue Didouche Mourad · DZ-16</p>
                  <p className="mt-0.5 flex items-center gap-1 text-[10px] font-bold text-emerald-600"><BadgeCheck size={11} /> Verified seller</p>
                </div>
                <button onClick={() => flash("Store profile opened")} className="rounded-xl bg-slate-100 px-2.5 py-1.5 text-[10px] font-bold">Edit</button>
              </div>

              <div className="rounded-2xl bg-white p-1 shadow-sm">
                {[
                  { label: "Push notifications", sub: "Order + delivery alerts", value: pushOn, set: setPushOn },
                  { label: "SMS updates", sub: "Send tracking via SMS", value: smsOn, set: setSmsOn },
                  { label: "Auto-print labels", sub: "Print on new order", value: autoPrint, set: setAutoPrint },
                  { label: "Cash on delivery", sub: "Accept COD payments", value: codOn, set: setCodOn },
                ].map((r) => (
                  <div key={r.label} className="flex items-center gap-2 border-b border-slate-50 px-2.5 py-2.5 last:border-0">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold">{r.label}</p>
                      <p className="truncate text-[10px] text-slate-500">{r.sub}</p>
                    </div>
                    <button
                      onClick={() => r.set(!r.value)}
                      role="switch"
                      aria-checked={r.value}
                      aria-label={r.label}
                      className={`relative h-6 w-11 shrink-0 rounded-full transition ${r.value ? "bg-emerald-500" : "bg-slate-200"}`}
                    >
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${r.value ? "left-[22px]" : "left-0.5"}`} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl bg-white p-3 shadow-sm">
                <p className="flex items-center gap-1 text-[11px] font-extrabold"><Globe size={12} /> Language / اللغة</p>
                <div className="mt-2 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
                  {(["FR", "AR"] as const).map((l) => (
                    <button key={l} onClick={() => { setLang(l); flash(l === "FR" ? "Langue: Français" : "اللغة: العربية"); }} className={`rounded-lg py-1.5 text-[11px] font-extrabold transition ${lang === l ? "bg-white shadow" : "text-slate-500"}`}>
                      {l === "FR" ? "Français" : "العربية"}
                    </button>
                  ))}
                </div>
                <div className="mt-2 flex items-center justify-between rounded-xl bg-slate-50 px-2.5 py-2">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold"><Wallet size={13} /> CCP balance</span>
                  <span className="text-[11px] font-extrabold text-blue-700">84,200 DA</span>
                </div>
              </div>

              <button onClick={() => flash("Logged out (demo)")} className="rounded-2xl bg-white py-2.5 text-[11px] font-extrabold text-red-600 shadow-sm transition hover:bg-red-50">
                Log out
              </button>
              <p className="pb-1 text-center text-[9px] text-slate-400">Algérie Poste E-Store · v2.4.1 · demo build</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order detail sheet */}
        <AnimatePresence>
          {selectedOrder && (
            <motion.div
              key="order-detail"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="absolute inset-0 z-20 flex flex-col bg-white"
            >
              <div className="flex items-center gap-2 bg-gradient-to-br from-[#003A93] to-[#0072CE] px-3 py-3 text-white">
                <button onClick={() => setSelectedOrder(null)} aria-label="Back" className="grid h-8 w-8 place-items-center rounded-full bg-white/15 transition hover:bg-white/25">
                  <ArrowLeft size={15} />
                </button>
                <div className="min-w-0">
                  <p className="text-[12px] font-extrabold">{selectedOrder.id}</p>
                  <p className="truncate text-[10px] text-blue-100">{selectedOrder.customer} · {selectedOrder.wilaya}</p>
                </div>
                <span className={`ml-auto rounded-full px-2 py-1 text-[10px] font-extrabold ${statusPill[selectedOrder.status]}`}>{selectedOrder.status}</span>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto p-3">
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Delivery progress</p>
                  <div className="mt-2 flex items-center">
                    {steps.map((s, i) => {
                      const orderIdx = selectedOrder.status === "Cancelled" ? -1 : steps.indexOf(selectedOrder.status);
                      const done = i <= orderIdx;
                      return (
                        <div key={s} className="flex flex-1 items-center last:flex-none">
                          <div className="flex flex-col items-center gap-1">
                            <span className={`grid h-7 w-7 place-items-center rounded-full text-white ${done ? "bg-emerald-500" : "bg-slate-200 text-slate-400"}`}>
                              {done ? <Check size={13} /> : <span className="text-[10px] font-extrabold">{i + 1}</span>}
                            </span>
                            <span className={`text-[9px] font-bold ${done ? "text-slate-800" : "text-slate-400"}`}>{s}</span>
                          </div>
                          {i < steps.length - 1 && <span className={`mx-1 mb-4 h-0.5 flex-1 rounded ${i < orderIdx ? "bg-emerald-400" : "bg-slate-200"}`} />}
                        </div>
                      );
                    })}
                  </div>
                  {selectedOrder.status === "Cancelled" && <p className="mt-2 rounded-lg bg-red-50 px-2 py-1.5 text-center text-[10px] font-bold text-red-600">This order was cancelled by the customer.</p>}
                </div>

                <div className="mt-2 rounded-2xl border border-slate-100 p-3">
                  <p className="text-[11px] font-extrabold">Details</p>
                  <div className="mt-1.5 space-y-1.5 text-[11px]">
                    <p className="flex items-center gap-1.5 text-slate-600"><Phone size={12} className="text-slate-400" /> {selectedOrder.phone}</p>
                    <p className="flex items-center gap-1.5 text-slate-600"><MapPin size={12} className="text-slate-400" /> {selectedOrder.wilaya} · {selectedOrder.date}</p>
                    <p className="flex items-center gap-1.5 text-slate-600"><Package size={12} className="text-slate-400" /> {selectedOrder.items}</p>
                    <p className="flex items-center justify-between border-t border-dashed border-slate-200 pt-2 font-extrabold">Total <span className="text-blue-700">{fmtDA(selectedOrder.amount)}</span></p>
                  </div>
                </div>

                <p className="mb-1.5 mt-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Update status</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["Pending", "Shipped", "Delivered"] as Status[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(selectedOrder.id, s)}
                      className={`rounded-xl py-2 text-[10px] font-extrabold transition ${selectedOrder.status === s ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  <button onClick={() => flash("Shipping label printed")} className="flex items-center justify-center gap-1 rounded-xl bg-blue-600 py-2.5 text-[11px] font-bold text-white transition hover:bg-blue-700">
                    <Printer size={13} /> Print label
                  </button>
                  <button onClick={() => setStatus(selectedOrder.id, "Cancelled")} className="flex items-center justify-center gap-1 rounded-xl bg-red-50 py-2.5 text-[11px] font-bold text-red-600 transition hover:bg-red-100">
                    <Trash2 size={13} /> Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* New order sheet */}
        <AnimatePresence>
          {newOrderOpen && (
            <motion.div key="new-order" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-20 flex items-end bg-black/40">
              <motion.div initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }} className="w-full rounded-t-3xl bg-white p-3 pb-4">
                <div className="mx-auto h-1 w-10 rounded-full bg-slate-200" />
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-[13px] font-extrabold">New order</p>
                  <button onClick={() => setNewOrderOpen(false)} aria-label="Close" className="grid h-7 w-7 place-items-center rounded-full bg-slate-100"><X size={13} /></button>
                </div>
                <label className="mt-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Customer</label>
                <input value={draftName} onChange={(e) => setDraftName(e.target.value)} placeholder="e.g. Amine B." className="mt-1 w-full rounded-xl border border-slate-200 px-2.5 py-2 text-[11px] font-medium outline-none focus:border-blue-500" />
                <label className="mt-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Wilaya</label>
                <div className="mt-1 flex gap-1 overflow-x-auto">
                  {["Alger", "Oran", "Constantine", "Blida", "Sétif", "Annaba"].map((w) => (
                    <button key={w} onClick={() => setDraftWilaya(w)} className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-bold ${draftWilaya === w ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>{w}</button>
                  ))}
                </div>
                <label className="mt-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Product</label>
                <div className="mt-1 max-h-28 overflow-y-auto rounded-xl border border-slate-100">
                  {products.map((p) => (
                    <button key={p.id} onClick={() => setDraftProduct(p.id)} className={`flex w-full items-center justify-between px-2.5 py-1.5 text-left text-[11px] font-bold ${draftProduct === p.id ? "bg-blue-50 text-blue-800" : "hover:bg-slate-50"}`}>
                      <span className="truncate">{p.name}</span>
                      <span className="shrink-0 text-blue-700">{fmtDA(p.price)}</span>
                    </button>
                  ))}
                </div>
                <button onClick={createOrder} className="mt-3 w-full rounded-xl bg-slate-900 py-2.5 text-[12px] font-extrabold text-white transition hover:bg-slate-700">
                  Create order · {fmtDA(products.find((p) => p.id === draftProduct)?.price ?? 0)}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              key="toast"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="absolute inset-x-3 bottom-2 z-30 flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-white shadow-xl"
            >
              <BadgeCheck size={14} className="shrink-0 text-emerald-400" />
              <p className="truncate text-[11px] font-semibold">{toast}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom nav */}
      <nav className="grid shrink-0 grid-cols-4 gap-1 border-t border-slate-200 bg-white px-2 pb-2.5 pt-1.5">
        {nav.map((n) => {
          const active = tab === n.id;
          return (
            <button
              key={n.id}
              onClick={() => { setTab(n.id); setNotifOpen(false); }}
              aria-current={active ? "page" : undefined}
              className={`relative flex flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10px] font-bold transition ${active ? "text-blue-700" : "text-slate-400 hover:text-slate-600"}`}
            >
              {active && <motion.span layoutId="eposte-nav" className="absolute inset-0 rounded-xl bg-blue-50" />}
              <span className="relative">
                <n.Icon size={17} />
                {typeof n.badge === "number" && n.badge > 0 && (
                  <span className="absolute -right-2 -top-1 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-red-500 px-0.5 text-[8px] font-extrabold text-white">
                    {n.badge}
                  </span>
                )}
              </span>
              <span className="relative">{n.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
