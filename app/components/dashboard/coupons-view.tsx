"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Ticket, Trash2, Plus, Copy, Edit3,
  Clock, Sparkles, Filter, Check,
  Zap, Calendar, MoreHorizontal, MessageSquare,
  Tag, Hash, ChevronDown, ChevronLeft, ChevronRight, Download, ArrowUpRight,
  TrendingUp, X, AlertCircle
} from "lucide-react";

// --- Types ---
interface Coupon {
  id: string;
  code: string;
  value: number;
  type: "Coupon" | "Loyalty Card";
  currency: string;
  status: "Active" | "Used";
  usageCount: number;
  maxUsage: number | null;
  expiryDate: string;
  createdOn: string;
  comment?: string;
}

// --- Initial Data ---
const INITIAL_COUPONS: Coupon[] = [
  { id: "1", code: "KRIFTH-GOLD-2024", value: 20, type: "Coupon", currency: "GHS", status: "Active", usageCount: 45, maxUsage: 100, expiryDate: "Dec 31, 2024", createdOn: "2 days ago", comment: "Exclusive for gold members" },
  { id: "2", code: "WELCOME-GHS-50", value: 50, type: "Coupon", currency: "GHS", status: "Active", usageCount: 128, maxUsage: 500, expiryDate: "Jan 15, 2025", createdOn: "1 week ago", comment: "New shop registration bonus" },
  { id: "3", code: "LOYAL-VYN-15", value: 15, type: "Loyalty Card", currency: "GHS", status: "Used", usageCount: 500, maxUsage: 500, expiryDate: "May 01, 2024", createdOn: "3 months ago", comment: "Standard loyalty reward" },
  { id: "4", code: "VIP-ACCESS-ONLY", value: 100, type: "Coupon", currency: "GHS", status: "Used", usageCount: 50, maxUsage: 50, expiryDate: "Aug 20, 2024", createdOn: "Yesterday", comment: "Manual VIP overrides" },
  { id: "5", code: "SUMMER-VIBES-10", value: 10, type: "Coupon", currency: "GHS", status: "Active", usageCount: 12, maxUsage: null, expiryDate: "Sep 30, 2024", createdOn: "3 days ago", comment: "Seasonal promotion" },
];

export function CouponsView() {
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredCoupons = coupons.filter((c) => {
    const matchesSearch = c.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "All" || c.status === activeTab;
    return matchesSearch && matchesTab;
  });

  useEffect(() => {
    const handler = () => setIsCreating(true);
    window.addEventListener("open-add-coupons", handler);
    return () => window.removeEventListener("open-add-coupons", handler);
  }, []);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = () => {
    if (deletingId) {
      setCoupons(coupons.filter(c => c.id !== deletingId));
      setDeletingId(null);
    }
  };

  const handleUpdate = (updated: Coupon) => {
    setCoupons(coupons.map(c => c.id === updated.id ? updated : c));
    setEditingCoupon(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* ─── Top Utility Bar ─── */}
      <div className="px-4 sm:px-8 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-30 gap-4">
        <div className="flex items-center justify-between sm:justify-start gap-6">
          <div className="flex items-center gap-2">
            <Ticket size={18} className="text-[#22C55E]" />
            <span className="text-sm font-black text-gray-900 tracking-tight">Promotions</span>
          </div>
          <div className="h-4 w-px bg-gray-200 hidden sm:block" />
          <div className="flex items-center gap-4">
            {["All", "Active", "Used"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === tab ? "text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative group flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors" size={14} />
            <input
              type="text"
              placeholder="Search code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-gray-200 transition-all w-full sm:w-48 lg:w-64"
            />
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all shrink-0"
          >
            <Plus size={14} strokeWidth={3} />
            <span className="hidden sm:inline">Add Coupon</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* ─── Hero Stats Bar ─── */}
      <div className="px-4 sm:px-8 py-6 sm:py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 border-b border-gray-50 bg-gray-50/30">
        {[
          { label: "Total Coupons", value: coupons.length, trend: "Overall", icon: Ticket, color: "text-gray-900" },
          { label: "Active Coupons", value: coupons.filter(c => c.status === "Active").length, trend: "Live", icon: Sparkles, color: "text-[#22C55E]" },
          { label: "Used Coupons", value: coupons.filter(c => c.status === "Used").length, trend: "Redeemed", icon: Check, color: "text-amber-600" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`p-4 sm:p-5 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center justify-between ${i === 2 ? "sm:col-span-2 lg:col-span-1" : ""}`}
          >
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-none">{stat.value}</h3>
            </div>
            <div className={`flex flex-col items-end gap-1.5 ${stat.color}`}>
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center opacity-80">
                <stat.icon size={20} strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-tighter opacity-70">{stat.trend}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ─── High-Density Content ─── */}
      <div className="flex-1 px-4 sm:px-8 py-6">
        <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)]">

          {/* Desktop Table (Hidden on Mobile) */}
          <div className="hidden lg:block overflow-x-auto scrollbar-hide">
            <table className="w-full text-left table-fixed">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="w-[35%] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-400">Coupon Code</th>
                  <th className="w-[15%] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-400">Type</th>
                  <th className="w-[15%] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-400">Value</th>
                  <th className="w-[15%] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-400">Status</th>
                  <th className="w-[15%] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-400">Created</th>
                  <th className="w-[5%] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-400 text-right pr-10">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredCoupons.map((c) => (
                  <tr key={c.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                          <Hash size={15} />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-gray-900 font-mono tracking-tight truncate">{c.code}</span>
                            <button onClick={() => handleCopy(c.code, c.id)} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-gray-900 transition-all">
                              {copiedId === c.id ? <Check size={12} strokeWidth={3} className="text-[#22C55E]" /> : <Copy size={12} />}
                            </button>
                          </div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">ID: #{c.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-2.5 py-1 bg-gray-100 text-[10px] font-black text-gray-600 rounded-lg border border-gray-100 uppercase tracking-wider">{c.type}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-baseline gap-1">
                        <span className="text-[10px] font-black text-gray-400">{c.currency}</span>
                        <span className="text-base font-black text-gray-900">{c.value}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${c.status === "Active" ? "bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-gray-300"}`} />
                        <span className={`text-xs font-black ${c.status === "Active" ? "text-gray-900" : "text-gray-400 uppercase tracking-widest"}`}>{c.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-bold text-gray-500">{c.createdOn}</span>
                    </td>
                    <td className="px-6 py-5 text-right pr-10">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditingCoupon(c)}
                          className="p-2 text-gray-400 hover:text-gray-900 hover:bg-white rounded-xl shadow-sm transition-all border border-transparent hover:border-gray-100"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => setDeletingId(c.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Card List (Visible on smaller screens) */}
          <div className="block lg:hidden divide-y divide-gray-50">
            {filteredCoupons.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="p-4 sm:p-5 space-y-4 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                      <Hash size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-black text-gray-900 font-mono tracking-tight truncate">{c.code}</span>
                        <button onClick={() => handleCopy(c.code, c.id)} className="text-gray-300 hover:text-gray-900">
                          {copiedId === c.id ? <Check size={12} className="text-[#22C55E]" /> : <Copy size={12} />}
                        </button>
                      </div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">ID: #{c.id} • {c.createdOn}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-[10px] font-black text-gray-400">{c.currency}</span>
                      <span className="text-lg font-black text-gray-900 leading-none">{c.value}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${c.status === "Active" ? "bg-green-50 text-[#22C55E] border-green-100" : "bg-gray-100 text-gray-500 border-gray-200"
                      }`}>
                      {c.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-50/50">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-md border border-gray-100">{c.type}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingCoupon(c)}
                      className="p-2.5 bg-gray-50 text-gray-600 rounded-xl border border-gray-100 hover:bg-white hover:border-gray-200 transition-all active:scale-95"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => setDeletingId(c.id)}
                      className="p-2.5 bg-red-50 text-red-500 rounded-xl border border-red-100 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all active:scale-95"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ─── Minimalist Pagination ─── */}
          <div className="px-4 sm:px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest order-2 sm:order-1">
              Showing <span className="text-gray-900">{filteredCoupons.length}</span> of {coupons.length} results
            </p>
            <div className="flex items-center gap-3 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-end">
              <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-20" disabled>
                <ChevronLeft size={16} strokeWidth={3} />
              </button>
              <div className="flex items-center gap-1.5">
                {[1, 2].map((n) => (
                  <button
                    key={n}
                    className={`w-8 h-8 rounded-xl text-[10px] font-black transition-all ${n === 1 ? "bg-gray-900 text-white shadow-lg shadow-gray-200" : "bg-white text-gray-400 border border-gray-100 hover:border-gray-300 hover:text-gray-900"
                      }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <button className="p-2 text-gray-900 hover:bg-gray-100 rounded-xl transition-all active:scale-90">
                <ChevronRight size={16} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Create Coupon Modal ─── */}
      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center px-0 sm:px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreating(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto scrollbar-hide"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-br from-gray-50 to-white px-6 sm:px-8 py-6 sm:py-8 border-b border-gray-50 relative">
                <div className="absolute top-0 right-0 p-8 opacity-5 hidden sm:block">
                  <Ticket size={120} strokeWidth={1} />
                </div>
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white shadow-xl shadow-gray-100 flex items-center justify-center text-[#22C55E]">
                      <Plus size={24} className="sm:w-7 sm:h-7" strokeWidth={3} />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-gray-900 leading-none mb-1">Create Coupon</h3>
                      <p className="text-xs sm:text-sm text-gray-500 font-medium">Generate a new promotional code.</p>
                    </div>
                  </div>
                  <button onClick={() => setIsCreating(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/50 text-gray-400 hover:text-gray-900 transition-all border border-transparent hover:border-gray-100">
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Coupon Type</label>
                    <div className="relative group">
                      <select className="w-full py-4 px-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#22C55E]/30 text-sm font-bold text-gray-900 outline-none transition-all appearance-none cursor-pointer">
                        <option>Standard Coupon</option>
                        <option>Loyalty Card</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-[#22C55E] transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Code Prefix</label>
                    <input type="text" placeholder="e.g. SAVE-" className="w-full py-4 px-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#22C55E]/30 text-sm font-bold text-gray-900 placeholder:text-gray-300 outline-none transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Currency</label>
                    <div className="relative group">
                      <select className="w-full py-4 px-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#22C55E]/30 text-sm font-bold text-gray-900 outline-none transition-all appearance-none cursor-pointer">
                        <option>GHS (Cedis)</option>
                        <option>USD (Dollar)</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-[#22C55E] transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Discount Value</label>
                    <input type="number" placeholder="0.00" className="w-full py-4 px-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#22C55E]/30 text-sm font-bold text-gray-900 placeholder:text-gray-300 outline-none transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Batch Quantity</label>
                  <input type="number" placeholder="100" className="w-full py-4 px-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#22C55E]/30 text-sm font-bold text-gray-900 placeholder:text-gray-300 outline-none transition-all" />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-gray-50">
                  <button onClick={() => setIsCreating(false)} className="w-full sm:w-auto px-8 py-4 text-gray-400 hover:text-gray-700 rounded-2xl text-sm font-bold transition-colors">Discard</button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsCreating(false)}
                    className="w-full sm:w-auto px-10 py-4 bg-gray-900 text-white rounded-2xl text-sm font-bold hover:bg-black transition-all shadow-xl shadow-gray-200"
                  >
                    Generate Coupons
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Edit Coupon Modal ─── */}
      <AnimatePresence>
        {editingCoupon && (
          <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center px-0 sm:px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingCoupon(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto scrollbar-hide"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-br from-emerald-50 to-white px-6 sm:px-8 py-6 sm:py-8 border-b border-gray-50 relative">
                <div className="absolute top-0 right-0 p-8 opacity-5 hidden sm:block">
                  <Edit3 size={120} strokeWidth={1} />
                </div>
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white shadow-xl shadow-green-100 flex items-center justify-center text-[#22C55E]">
                      <Edit3 size={24} className="sm:w-7 sm:h-7" strokeWidth={3} />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-gray-900 leading-none mb-1">Edit Coupon</h3>
                      <p className="text-xs sm:text-sm text-gray-500 font-medium">Modify existing promotion rules.</p>
                    </div>
                  </div>
                  <button onClick={() => setEditingCoupon(null)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/50 text-gray-400 hover:text-gray-900 transition-all border border-transparent hover:border-gray-100">
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Coupon Code</label>
                    <input
                      type="text"
                      defaultValue={editingCoupon.code}
                      className="w-full py-4 px-5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-black text-gray-400 outline-none cursor-not-allowed font-mono"
                      disabled
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Update Status</label>
                    <div className="relative group">
                      <select
                        defaultValue={editingCoupon.status}
                        className="w-full py-4 px-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#22C55E]/30 text-sm font-bold text-gray-900 outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="Active">Active</option>
                        <option value="Used">Used</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-[#22C55E] transition-colors" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Discount Amount</label>
                    <div className="flex gap-2">
                      <div className="w-20 py-4 flex items-center justify-center bg-gray-100 border border-gray-100 rounded-2xl text-xs font-black text-gray-500 uppercase tracking-widest">
                        {editingCoupon.currency}
                      </div>
                      <input
                        type="number"
                        defaultValue={editingCoupon.value}
                        className="flex-1 py-4 px-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#22C55E]/30 text-sm font-bold text-gray-900 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-gray-50">
                  <button onClick={() => setEditingCoupon(null)} className="w-full sm:w-auto px-8 py-4 text-gray-400 hover:text-gray-700 rounded-2xl text-sm font-bold transition-colors">Discard</button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleUpdate({ ...editingCoupon, status: "Active" })}
                    className="w-full sm:w-auto px-10 py-4 bg-gray-900 text-white rounded-2xl text-sm font-bold hover:bg-black transition-all shadow-xl shadow-gray-200"
                  >
                    Save Changes
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Delete Confirmation Modal ─── */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center px-0 sm:px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingId(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 100 }}
              className="relative w-full max-w-sm bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden border border-gray-100"
            >
              <div className="p-8 text-center space-y-5">
                <div className="w-20 h-20 bg-red-50 rounded-[24px] flex items-center justify-center mx-auto mb-2 rotate-3">
                  <AlertCircle size={40} className="text-red-500" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Are you sure?</h2>
                  <p className="text-sm text-gray-400 font-bold leading-relaxed">
                    This action is permanent. This coupon code will be wiped from existence.
                  </p>
                </div>
                <div className="pt-4 flex flex-col gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDelete}
                    className="w-full py-4 bg-red-500 text-white rounded-2xl text-sm font-black hover:bg-red-600 transition-all shadow-xl shadow-red-500/20"
                  >
                    Yes, Delete Coupon
                  </motion.button>
                  <button
                    onClick={() => setDeletingId(null)}
                    className="w-full py-3 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors"
                  >
                    No, Keep it
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
