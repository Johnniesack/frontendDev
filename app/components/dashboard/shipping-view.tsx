"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Globe, Truck, DollarSign, ShieldCheck,
  Trash2, ChevronLeft, ChevronRight, SlidersHorizontal,
  Info, Monitor, Check, ChevronDown, Plus, Edit3, Settings2,
} from "lucide-react";

interface ShippingZone {
  id: string; countryCode: string; country: string;
  fee: number; currency: string; status: "Exempted" | "Subjected"; comment: string;
}

const ZONES: ShippingZone[] = [
  { id: "SH-0941", countryCode: "gh", country: "Ghana", fee: 0, currency: "GHS", status: "Exempted", comment: "Free shipping for West African cluster" },
  { id: "SH-0001", countryCode: "us", country: "All", fee: 18.45, currency: "USD", status: "Subjected", comment: "Global flat rate standard shipping" },
  { id: "SH-0822", countryCode: "gb", country: "United Kingdom", fee: 12.5, currency: "GBP", status: "Subjected", comment: "Priority handling included" },
];

const COUNTRIES = [
  { code: "all", name: "All Countries" }, { code: "us", name: "United States" },
  { code: "ca", name: "Canada" }, { code: "gb", name: "United Kingdom" },
  { code: "ng", name: "Nigeria" }, { code: "gh", name: "Ghana" },
  { code: "ke", name: "Kenya" }, { code: "za", name: "South Africa" },
  { code: "de", name: "Germany" }, { code: "fr", name: "France" },
];

const CURRENCIES = [
  { code: "USD", name: "US Dollar" }, { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" }, { code: "NGN", name: "Nigerian Naira" },
  { code: "GHS", name: "Ghanaian Cedi" }, { code: "CAD", name: "Canadian Dollar" },
];

function Sel({ label, options, placeholder, value, onChange }: {
  label: string; options: { code: string; name: string }[];
  placeholder: string; value: string; onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    window.addEventListener("click", h);
    return () => window.removeEventListener("click", h);
  }, []);
  const sel = options.find(o => o.code === value);
  return (
    <div className="relative" ref={ref}>
      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-gray-400 mb-1 pl-0.5">{label}</p>
      <button type="button" onClick={e => { e.stopPropagation(); setOpen(!open); }}
        className={`w-full py-2 sm:py-2.5 px-4 rounded-xl bg-gray-50 border text-sm font-semibold flex items-center justify-between transition-all ${open ? "bg-white border-[#22C55E]/30 ring-4 ring-[#22C55E]/5" : "border-transparent"}`}>
        <span className={sel ? "text-gray-900" : "text-gray-300"}>{sel ? sel.name : placeholder}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }}><ChevronDown size={14} className="text-gray-400" /></motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 2 }} exit={{ opacity: 0, y: 6 }}
            className="absolute left-0 right-0 top-full z-[110] bg-white rounded-xl shadow-xl border border-gray-100 p-1.5 max-h-44 overflow-y-auto scrollbar-hide">
            {options.map(o => (
              <button key={o.code} type="button" onClick={() => { onChange(o.code); setOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all ${value === o.code ? "bg-[#22C55E]/10 text-[#22C55E]" : "text-gray-600 hover:bg-gray-50"}`}>
                {o.name}{value === o.code && <Check size={12} strokeWidth={3} />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ShippingView() {
  const [q, setQ] = useState("");
  const [modal, setModal] = useState(false);
  const [country, setCountry] = useState("");
  const [currency, setCurrency] = useState("");
  const [fee, setFee] = useState("");
  const [comment, setComment] = useState("");

  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);
  const [zones, setZones] = useState<ShippingZone[]>(ZONES);

  const openEdit = (z: ShippingZone) => {
    setEditingZone(z);
    setCountry(z.countryCode);
    setCurrency(z.currency);
    setFee(z.fee.toString());
    setComment(z.comment);
    setStatus(z.status);
    setModal(true);
  };

  const handleDelete = () => {
    if (isDeletingId) {
      setZones(zones.filter(z => z.id !== isDeletingId));
      setIsDeletingId(null);
    }
  };


  const [status, setStatus] = useState<"Exempted" | "Subjected">("Subjected");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterCurrency, setFilterCurrency] = useState<string>("All");
  const filterRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const h = (e: MouseEvent) => { if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false); };
    window.addEventListener("click", h);
    return () => window.removeEventListener("click", h);
  }, []);

  const filtered = zones.filter(z => {
    const matchesQuery = z.country.toLowerCase().includes(q.toLowerCase()) ||
      z.id.toLowerCase().includes(q.toLowerCase()) ||
      z.currency.toLowerCase().includes(q.toLowerCase());
    const matchesStatus = filterStatus === "All" || z.status === filterStatus;
    const matchesCurrency = filterCurrency === "All" || z.currency === filterCurrency;
    return matchesQuery && matchesStatus && matchesCurrency;
  });

  const STATS = [
    { label: "Total Zones", value: `${zones.length} Regions`, icon: Globe, bg: "#F0FDF4", color: "#22C55E" },
    { label: "Average Fee", value: "$18.45", icon: DollarSign, bg: "#F0FDF4", color: "#22C55E" },
    { label: "Exempted", value: `${zones.filter(z => z.status === "Exempted").length} Locations`, icon: ShieldCheck, bg: "#F0FDF4", color: "#22C55E" },
  ];

  return (
    <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-10 sm:pb-12 flex flex-col gap-4 sm:gap-6 min-w-0">

      {/* ─── Integrated Header ─── */}
      <div className="px-4 sm:px-8 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-30 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-900">
            <Truck size={15} strokeWidth={2.5} />
          </div>
          <span className="text-sm font-black text-gray-900 tracking-tight">Shipping Rules</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setModal(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all sm:w-auto shadow-lg shadow-gray-200 shrink-0"
          >
            <div className="w-5 h-5 rounded-lg bg-white/10 flex items-center justify-center">
              <Plus size={14} strokeWidth={3} />
            </div>
            <span className="hidden sm:inline">New Shipping</span>
            <span className="sm:hidden">Add</span>
          </motion.button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 flex-shrink-0">
        {STATS.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`bg-white rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 flex items-center gap-3 sm:gap-4 shadow-sm border border-gray-100 ${i === 2 ? "col-span-2 sm:col-span-1" : ""}`}>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
                <Icon size={18} color={s.color} strokeWidth={2} />
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">{s.label}</p>
                <p className="text-base sm:text-lg font-black text-gray-900 leading-none">{s.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Table Card */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
        className="bg-white rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden flex-shrink-0">

        {/* Table toolbar */}
        <div className="px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-50 gap-4">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <p className="text-sm font-black text-gray-900">Zone Management</p>
            <div className="flex md:hidden items-center gap-2">
              <button onClick={() => setFilterOpen(!filterOpen)} className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${filterOpen ? "bg-[#22C55E] text-white border-[#22C55E]" : "bg-gray-50 text-gray-400 border-transparent"}`}>
                <SlidersHorizontal size={14} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative group flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#22C55E] transition-colors" size={14} />
              <input type="text" placeholder="Search zone..." value={q} onChange={e => setQ(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-xs font-bold text-gray-700 focus:bg-white focus:border-[#22C55E]/30 focus:ring-4 focus:ring-[#22C55E]/5 outline-none placeholder:text-gray-400 w-full sm:w-60 transition-all shadow-inner-sm" />
            </div>
            <div className="relative hidden md:block" ref={filterRef}>
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${filterOpen ? "bg-[#22C55E] text-white border-[#22C55E] shadow-lg shadow-green-100" : "border-gray-100 bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}>
                <SlidersHorizontal size={16} />
              </button>

              <AnimatePresence>
                {filterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 4, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full z-[120] w-[min(16rem,calc(100vw-2rem))] bg-white rounded-2xl shadow-2xl border border-gray-100 p-4"
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Filter Zones</p>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500">BY STATUS</label>
                        <div className="grid grid-cols-2 gap-2">
                          {["All", "Exempted", "Subjected"].map((s) => (
                            <button
                              key={s}
                              onClick={() => setFilterStatus(s)}
                              className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${filterStatus === s ? "bg-[#22C55E] text-white border-[#22C55E]" : "bg-gray-50 text-gray-600 border-transparent hover:bg-gray-100"
                                }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500">BY CURRENCY</label>
                        <div className="flex flex-wrap gap-2">
                          {["All", "USD", "EUR", "GBP", "GHS"].map((c) => (
                            <button
                              key={c}
                              onClick={() => setFilterCurrency(c)}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${filterCurrency === c ? "bg-[#22C55E] text-white border-[#22C55E]" : "bg-gray-50 text-gray-600 border-transparent hover:bg-gray-100"
                                }`}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center">
                      <button
                        onClick={() => { setFilterStatus("All"); setFilterCurrency("All"); }}
                        className="text-[10px] font-bold text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        Reset All
                      </button>
                      <button
                        onClick={() => setFilterOpen(false)}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg text-[10px] font-bold hover:bg-gray-800 transition-all"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile Card List (Hidden on Desktop) */}
        <div className="block md:hidden divide-y divide-gray-50/50">
          {filtered.map((z, i) => (
            <motion.div
              key={z.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 sm:p-5 space-y-4 hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 overflow-hidden shrink-0">
                    <img
                      src={`https://flagcdn.com/${z.countryCode}.svg`}
                      alt={z.country}
                      className="w-full h-full object-cover p-2.5"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-black text-gray-900 truncate">{z.country}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Shipping ID: #{z.id}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className={`w-2 h-2 rounded-full ${z.status === "Exempted" ? "bg-[#22C55E]" : "bg-gray-300"}`} />
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-[10px] font-black tracking-wider border border-gray-200/50">
                    ${z.fee.toFixed(2)} {z.currency}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50/50 p-3 rounded-xl border border-transparent group-hover:border-gray-100 transition-colors">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Shipping Log</p>
                <p className="text-xs font-semibold text-gray-600 leading-relaxed truncate">
                  {z.comment || "Standard delivery profile"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEdit(z)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl text-xs font-black transition-all active:scale-[0.98] shadow-lg shadow-gray-200"
                >
                  <Settings2 size={14} />
                  Configure
                </button>
                <button
                  onClick={() => setIsDeletingId(z.id)}
                  className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-500 rounded-xl border border-red-100 transition-all active:scale-[0.98]"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="p-10 text-center">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3 text-gray-300">
                <Truck size={20} />
              </div>
              <p className="text-xs font-bold text-gray-400">No zones found matching your search.</p>
            </div>
          )}
        </div>

        {/* Desktop Table (Hidden on Mobile) */}
        <div className="hidden md:block overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/40">
                {["ID", "Action", "Country", "Fee", "Currency", "Status", "Comment"].map(h => (
                  <th key={h} className="px-5 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-gray-400 border-b border-gray-50">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((z, i) => (
                <motion.tr key={z.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className={`group transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"} hover:bg-[#22C55E]/5`}>
                  <td className="px-5 py-6 text-xs font-bold text-gray-400 border-l-2 border-transparent group-hover:border-[#22C55E] transition-all whitespace-nowrap">{z.id}</td>
                  <td className="px-5 py-6">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(z)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all"
                      >
                        <Edit3 size={14} strokeWidth={2} />
                      </button>
                      <button
                        onClick={() => setIsDeletingId(z.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        <Trash2 size={14} strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-6">
                    <div className="flex items-center gap-2">
                      <div className="rounded overflow-hidden border border-gray-100 flex-shrink-0" style={{ width: 24, height: 16 }}>
                        <img src={`https://flagcdn.com/${z.countryCode}.svg`} alt={z.country} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs font-bold text-gray-900 whitespace-nowrap">{z.country}</span>
                    </div>
                  </td>
                  <td className="px-5 py-6 text-xs font-bold text-gray-900 whitespace-nowrap">${z.fee.toFixed(2)}</td>
                  <td className="px-5 py-6 text-xs font-semibold text-gray-500">{z.currency}</td>
                  <td className="px-5 py-6">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black ${z.status === "Exempted" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                      {z.status}
                    </span>
                  </td>
                  <td className="px-5 py-6 text-xs text-gray-400 max-w-[200px]">
                    <span className="truncate block">{z.comment}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-3.5 sm:px-5 py-3 bg-gray-50/30 flex items-center justify-between gap-2">
          <p className="text-[10px] font-semibold text-gray-400">
            Showing <span className="text-gray-700 font-bold">{filtered.length}</span> of <span className="text-gray-700 font-bold">14</span> zones
          </p>
          <div className="flex items-center gap-1">
            <button className="p-1.5 text-gray-300 pointer-events-none"><ChevronLeft size={14} /></button>
            <button className="w-7 h-7 flex items-center justify-center bg-[#22C55E] text-white rounded-lg text-xs font-bold">1</button>
            <button className="w-7 h-7 flex items-center justify-center bg-white text-gray-600 rounded-lg text-xs font-bold border border-gray-100">2</button>
            <button className="p-1.5 text-gray-400 hover:text-gray-800"><ChevronRight size={14} /></button>
          </div>
        </div>
      </motion.div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 flex-shrink-0">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
          className="relative bg-[#22C55E] rounded-2xl p-5 overflow-hidden">
          <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none">
            <Monitor size={90} strokeWidth={1} className="text-white translate-x-4 translate-y-4" />
          </div>
          <p className="text-white font-black text-base mb-1.5 leading-tight">Shipping Logic Pro</p>
          <p className="text-white/75 text-xs font-medium leading-snug mb-4">
            Easily configure tax exemptions and regional fees from this dashboard.
          </p>
          <button className="px-5 py-2.5 bg-white text-[#22C55E] rounded-xl text-xs font-black hover:bg-green-50 transition-colors shadow-sm">
            Documentation
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.33 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4">
          <div className="w-9 h-9 rounded-full border-2 border-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Info size={14} className="text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-black text-gray-900 mb-1.5">Taxation Notice</p>
            <p className="text-xs font-medium text-gray-500 leading-relaxed">
              Changing status to &apos;Exempted&apos; will automatically recalculate the final checkout price for all customers in that region.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setModal(false); setEditingZone(null); }} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 32, stiffness: 350 }}
              className="relative w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl border border-gray-100 flex flex-col max-h-[92vh] overflow-hidden"
            >
              {/* Mobile Handle */}
              <div className="sm:hidden flex justify-center py-3 shrink-0">
                <div className="w-10 h-1.5 bg-gray-200 rounded-full" />
              </div>

              {/* Premium Header with Gradient - Fixed */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 px-5 sm:px-8 py-6 sm:py-8 relative overflow-hidden shrink-0 rounded-t-[32px] sm:rounded-t-none">
                <div className="absolute -right-8 -bottom-8 opacity-10 rotate-12">
                  <Truck size={160} strokeWidth={1} className="text-white" />
                </div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                    {editingZone ? <Settings2 size={22} strokeWidth={2.5} /> : <Plus size={22} strokeWidth={3} />}
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">{editingZone ? "Edit Shipping" : "New Shipping"}</h3>
                    <p className="text-[10px] text-white/60 font-medium tracking-wide">#{editingZone ? editingZone.id : "Configuration"}</p>
                  </div>
                  <button onClick={() => { setModal(false); setEditingZone(null); }} className="ml-auto w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                    <Plus size={18} className="rotate-45" />
                  </button>
                </div>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto scrollbar-hide px-5 sm:px-8 py-6 sm:py-8">
                <form id="shipping-form" className="space-y-6" onSubmit={e => { e.preventDefault(); setModal(false); setEditingZone(null); }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Sel label="Region / Country" options={COUNTRIES} placeholder="Select country" value={country} onChange={setCountry} />
                    <Sel label="Operating Currency" options={CURRENCIES} placeholder="Select currency" value={currency} onChange={setCurrency} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Flat Fee Amount</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#22C55E] font-bold text-sm transition-colors">$</div>
                      <input type="number" min="0" step="0.01" placeholder="0.00" value={fee} onChange={e => setFee(e.target.value)}
                        className="w-full py-4 pl-8 pr-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#22C55E]/30 focus:ring-8 focus:ring-[#22C55E]/5 text-sm font-bold text-gray-900 placeholder:text-gray-300 outline-none transition-all" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Exemption Status</label>
                    <div className="flex gap-3">
                      {(["Subjected", "Exempted"] as const).map(s => (
                        <button key={s} type="button" onClick={() => setStatus(s)}
                          className={`flex-1 py-4 rounded-2xl text-xs font-black border transition-all ${status === s ? (s === "Exempted" ? "bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm" : "bg-amber-50 text-amber-600 border-amber-200 shadow-sm") : "bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100"}`}>
                          <div className="flex items-center justify-center gap-2">
                            {status === s && <Check size={14} strokeWidth={3} />}
                            {s}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Internal Log</label>
                    <textarea rows={2} placeholder="Add a note about this regional rule..." value={comment} onChange={e => setComment(e.target.value)}
                      className="w-full py-4 px-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#22C55E]/30 focus:ring-8 focus:ring-[#22C55E]/5 text-sm font-bold text-gray-900 placeholder:text-gray-300 outline-none resize-none transition-all" />
                  </div>
                  <div className="pt-4 flex flex-col gap-2 pb-8">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      form="shipping-form"
                      type="submit"
                      className="w-full py-4 bg-gray-900 text-white rounded-2xl text-sm font-bold hover:bg-black transition-all shadow-xl shadow-gray-200"
                    >
                      {editingZone ? "Update Configuration" : "Save Configuration"}
                    </motion.button>
                    <button
                      type="button"
                      onClick={() => { setModal(false); setEditingZone(null); }}
                      className="w-full py-3 text-gray-400 hover:text-gray-700 text-sm font-bold transition-colors"
                    >
                      Discard Changes
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeletingId && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsDeletingId(null)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 p-8 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Delete Shipping?</h3>
              <p className="text-sm text-gray-500 font-medium mb-8 leading-relaxed">
                This will permanently remove the shipping rule for this region. This action cannot be undone.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setIsDeletingId(null)} className="py-3.5 bg-gray-50 text-gray-500 rounded-2xl text-sm font-bold hover:bg-gray-100 transition-all">Cancel</button>
                <button onClick={handleDelete} className="py-3.5 bg-red-500 text-white rounded-2xl text-sm font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-100">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
