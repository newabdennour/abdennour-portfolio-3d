import { Bell, Home, Package, Settings, ShoppingCart, Star } from "lucide-react";

const posteLogo = encodeURI("/top-projects/tp3/algerie post.png");

const hideImg = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.style.display = "none";
};

const stats = [
  { label: "Revenue", value: "2.4M DA", sub: "+12% vs last month", bg: "bg-emerald-50", text: "text-emerald-700" },
  { label: "Orders", value: "1,284", sub: "+8% this week", bg: "bg-blue-50", text: "text-blue-700" },
  { label: "Products", value: "356", sub: "24 low stock", bg: "bg-amber-50", text: "text-amber-700" },
];

const orders = [
  { id: "#DZ-9041", customer: "Yasmine B.", status: "Delivered", amount: "4,800 DA", pill: "bg-emerald-100 text-emerald-700" },
  { id: "#DZ-9040", customer: "Mohamed K.", status: "Shipped", amount: "12,300 DA", pill: "bg-blue-100 text-blue-700" },
  { id: "#DZ-9039", customer: "Sara L.", status: "Pending", amount: "2,150 DA", pill: "bg-amber-100 text-amber-700" },
  { id: "#DZ-9038", customer: "Amine T.", status: "Delivered", amount: "7,900 DA", pill: "bg-emerald-100 text-emerald-700" },
  { id: "#DZ-9037", customer: "Lina M.", status: "Cancelled", amount: "3,400 DA", pill: "bg-red-100 text-red-600" },
];

const products = [
  { name: "EMS Pack 5kg", price: "1,200 DA", grad: "from-yellow-400 to-amber-600", rating: "4.9" },
  { name: "Stamp Set 2024", price: "850 DA", grad: "from-sky-400 to-blue-600", rating: "4.8" },
  { name: "Post Box M", price: "2,400 DA", grad: "from-emerald-400 to-teal-600", rating: "4.7" },
  { name: "Express Label", price: "300 DA", grad: "from-violet-400 to-purple-600", rating: "4.9" },
];

const nav = [
  { label: "Home", icon: Home, active: true },
  { label: "Orders", icon: ShoppingCart, active: false },
  { label: "Products", icon: Package, active: false },
  { label: "Settings", icon: Settings, active: false },
];

export default function EPosteUI(): JSX.Element {
  return (
    <div
      className="flex h-[600px] w-full flex-col overflow-hidden bg-slate-50 text-left text-slate-800"
    >
      {/* Header */}
      <div className="flex shrink-0 items-center gap-2 bg-white px-3 py-2.5 shadow-sm">
        <img
          src={posteLogo}
          alt="Algérie Poste"
          className="h-9 w-9 rounded-md border border-slate-200 object-contain"
          onError={hideImg}
        />
        <div className="min-w-0">
          <p className="text-[12px] font-bold leading-tight">E-Store Manager</p>
          <p className="text-[10px] leading-tight text-slate-500">Algérie Poste · seller demo</p>
        </div>
        <span className="relative ml-auto rounded-full border border-slate-200 bg-white p-1.5">
          <Bell size={14} className="text-slate-600" />
          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-red-500" />
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden p-2.5">
        {/* Stat cards row */}
        <div className="grid shrink-0 grid-cols-3 gap-1.5">
          {stats.map((s) => (
            <div key={s.label} className={`rounded-lg ${s.bg} p-2`}>
              <p className="text-[10px] font-medium text-slate-500">{s.label}</p>
              <p className={`text-[12px] font-extrabold ${s.text}`}>{s.value}</p>
              <p className="truncate text-[10px] text-slate-500">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Recent orders */}
        <div className="shrink-0 rounded-xl bg-white p-2 shadow-sm">
          <div className="mb-1 flex items-center justify-between">
            <p className="text-[11px] font-bold">Recent orders</p>
            <span className="text-[10px] font-semibold text-blue-600">See all</span>
          </div>
          <ul className="flex flex-col">
            {orders.map((o) => (
              <li
                key={o.id}
                className="flex items-center gap-2 border-t border-slate-100 py-1.5 first:border-0 first:pt-0 last:pb-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold leading-tight">{o.id}</p>
                  <p className="truncate text-[10px] leading-tight text-slate-500">
                    {o.customer}
                  </p>
                </div>
                <span
                  className={`rounded-full px-1.5 py-px text-[10px] font-semibold ${o.pill}`}
                >
                  {o.status}
                </span>
                <span className="w-[62px] shrink-0 text-right text-[10px] font-bold">
                  {o.amount}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Top products 2x2 */}
        <div className="min-h-0 flex-1 overflow-hidden rounded-xl bg-white p-2 shadow-sm">
          <div className="mb-1 flex items-center justify-between">
            <p className="text-[11px] font-bold">Top products</p>
            <span className="text-[10px] font-semibold text-blue-600">Manage</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {products.map((p) => (
              <div key={p.name} className="rounded-lg border border-slate-100 p-1.5">
                <div
                  className={`flex h-[64px] items-end justify-end rounded-md bg-gradient-to-br p-1 ${p.grad}`}
                >
                  <span className="flex items-center gap-0.5 rounded-full bg-white/90 px-1 py-px text-[10px] font-bold text-slate-700">
                    <Star size={9} className="fill-amber-400 text-amber-400" />
                    {p.rating}
                  </span>
                </div>
                <p className="mt-1 truncate text-[11px] font-semibold">{p.name}</p>
                <p className="text-[10px] font-bold text-blue-700">{p.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <nav className="grid shrink-0 grid-cols-4 border-t border-slate-200 bg-white px-2 py-2">
        {nav.map((n) => (
          <span
            key={n.label}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
              n.active ? "text-blue-700" : "text-slate-400"
            }`}
          >
            <n.icon size={16} />
            {n.label}
          </span>
        ))}
      </nav>
    </div>
  );
}
