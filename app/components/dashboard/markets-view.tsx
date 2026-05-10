"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  ChevronDown,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Globe,
  Package,
  Trash2,
  Check,
  X,
} from "lucide-react";

interface MarketPricing {
  id: number;
  place: string;
  countryCode: string;
  currency: string;
  comment: string;
}

const MOCK_DATA: MarketPricing[] = [
  { id: 12, place: "Canada", countryCode: "ca", currency: "USD", comment: "Primary market" },
  { id: 13, place: "Nigeria", countryCode: "ng", currency: "NGN", comment: "High volume" },
  { id: 14, place: "Europe", countryCode: "eu", currency: "EUR", comment: "Strategic region" },
  { id: 15, place: "United Kingdom", countryCode: "gb", currency: "GBP", comment: "New market" },
];

const COUNTRIES = [
  { code: "us", name: "United States" },
  { code: "ca", name: "Canada" },
  { code: "gb", name: "United Kingdom" },
  { code: "ng", name: "Nigeria" },
  { code: "gh", name: "Ghana" },
  { code: "ke", name: "Kenya" },
  { code: "za", name: "South Africa" },
  { code: "de", name: "Germany" },
  { code: "fr", name: "France" },
  { code: "ae", name: "United Arab Emirates" },
  { code: "eu", name: "Europe (General)" },
  { code: "cn", name: "China" },
  { code: "in", name: "India" },
  { code: "br", name: "Brazil" },
  { code: "au", name: "Australia" },
];

const CURRENCIES = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "NGN", name: "Nigerian Naira" },
  { code: "GHS", name: "Ghanaian Cedi" },
  { code: "KES", name: "Kenyan Shilling" },
  { code: "ZAR", name: "South African Rand" },
  { code: "AED", name: "UAE Dirham" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "INR", name: "Indian Rupee" },
  { code: "BRL", name: "Brazilian Real" },
  { code: "AUD", name: "Australian Dollar" },
];

// --- Custom Select Component ---
function CustomSelect({
  label,
  options,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  options: { code: string; name: string }[];
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const selectedOption = options.find((o) => o.code === value);

  return (
    <div className="space-y-2 relative" ref={containerRef}>
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">
        {label}
      </label>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`w-full py-4 px-6 rounded-xl bg-gray-50 border transition-all text-sm font-bold flex items-center justify-between group ${isOpen ? "bg-white border-gray-900 ring-8 ring-gray-900/5 shadow-sm" : "border-transparent text-gray-900"
          }`}
      >
        <span className={!selectedOption ? "text-gray-300" : "text-gray-900"}>
          {selectedOption ? (label.includes("Currency") ? `${selectedOption.code} - ${selectedOption.name}` : selectedOption.name) : placeholder}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown className="text-gray-400 group-hover:text-[#22C55E] transition-colors" size={18} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-0 right-0 top-full z-[110] bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 max-h-60 overflow-y-auto scrollbar-hide"
          >
            {options.map((option) => (
              <button
                key={option.code}
                type="button"
                onClick={() => {
                  onChange(option.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${value === option.code
                  ? "bg-[#22C55E]/10 text-[#22C55E]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                <span>{label.includes("Currency") ? `${option.code} - ${option.name}` : option.name}</span>
                {value === option.code && <Check size={16} strokeWidth={3} />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MarketsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = () => setOpenDropdownId(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="flex-1 px-3 sm:px-8 pt-4 sm:pt-6 pb-8 min-w-0 overflow-x-hidden">
      {/* ─── Integrated Header ─── */}
      <div className="px-4 sm:px-8 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-30 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-900">
            <Globe size={15} strokeWidth={2.5} />
          </div>
          <span className="text-sm font-black text-gray-900 tracking-tight">Market Pricing</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all sm:w-auto shadow-lg shadow-gray-200 shrink-0"
          >
            <div className="w-5 h-5 rounded-lg bg-white/10 flex items-center justify-center">
              <Plus size={14} strokeWidth={3} />
            </div>
            <span className="hidden sm:inline">Add Pricing</span>
            <span className="sm:hidden">Add</span>
          </motion.button>
        </div>
      </div>

      {/* Main Table Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 sm:p-6 border-b border-gray-50 flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
          <div className="relative w-full lg:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#22C55E] transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search markets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl text-sm font-semibold text-gray-700 focus:bg-white focus:border-[#22C55E]/30 focus:ring-4 focus:ring-[#22C55E]/5 transition-all outline-none placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Display</span>
            <div className="relative shrink-0">
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-transparent rounded-xl text-xs sm:text-sm font-bold text-gray-700 focus:bg-white focus:border-[#22C55E]/30 transition-all outline-none cursor-pointer"
              >
                <option value="10">10 entries</option>
                <option value="25">25 entries</option>
                <option value="50">50 entries</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            </div>
          </div>
        </div>

        {/* Desktop Table View (Hidden on Mobile) */}
        <div className="hidden sm:block overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-50">ID</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-50">Action</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-50">Place</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-50">Currency</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-50">Comment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {MOCK_DATA.map((item, idx) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`group transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"} hover:bg-[#22C55E]/5`}
                >
                  <td className="px-6 py-6 text-sm font-bold text-gray-400 border-l-2 border-transparent group-hover:border-[#22C55E] transition-all">{item.id}</td>
                  <td className="px-6 py-6 relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdownId(openDropdownId === item.id ? null : item.id);
                      }}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${openDropdownId === item.id
                        ? "bg-gray-900 text-white shadow-gray-200"
                        : "bg-[#22C55E] text-white hover:bg-[#16A34A] shadow-green-50"
                        }`}
                    >
                      Action
                      <motion.div
                        animate={{ rotate: openDropdownId === item.id ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={14} strokeWidth={3} />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {openDropdownId === item.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute left-6 top-full z-50 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 overflow-hidden"
                        >
                          <button
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-[#22C55E] transition-all"
                            onClick={() => setOpenDropdownId(null)}
                          >
                            <Package size={16} strokeWidth={2.5} />
                            Inventory
                          </button>
                          <button
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-all"
                            onClick={() => setOpenDropdownId(null)}
                          >
                            <Trash2 size={16} strokeWidth={2.5} />
                            Delete
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-5 rounded-md overflow-hidden shadow-sm border border-gray-100 flex-shrink-0">
                        <img
                          src={`https://flagcdn.com/${item.countryCode}.svg`}
                          alt={`${item.place} flag`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-900">{item.place}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-black tracking-wider">
                      {item.currency}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-sm font-semibold text-gray-600 max-w-xs truncate">
                      {item.comment}
                    </p>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List View (Visible on Mobile Only) */}
        <div className="block sm:hidden divide-y divide-gray-50">
          {MOCK_DATA.map((item, idx) => (
            <div key={item.id} className="p-4 sm:p-5 space-y-4 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 overflow-hidden shrink-0">
                    <img
                      src={`https://flagcdn.com/${item.countryCode}.svg`}
                      alt={`${item.place} flag`}
                      className="w-full h-full object-cover p-2.5"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-black text-gray-900 truncate">{item.place}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">ID: #{item.id}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-[10px] font-black tracking-wider border border-gray-200/50">
                    {item.currency}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50/50 p-3 rounded-xl border border-transparent group-hover:border-gray-100 transition-colors">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Market Notes</p>
                <p className="text-xs font-semibold text-gray-600 leading-relaxed">
                  {item.comment}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => console.log("Inventory", item.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl text-xs font-black transition-all active:scale-[0.98] shadow-lg shadow-gray-200"
                >
                  <Package size={14} />
                  Manage Inventory
                </button>
                <button
                  onClick={() => console.log("Delete", item.id)}
                  className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-500 rounded-xl border border-red-100 transition-all active:scale-[0.98]"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer / Pagination */}
        <div className="p-4 sm:p-6 bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-5">
          <p className="text-[10px] sm:text-xs font-bold text-gray-400 order-2 sm:order-1">
            Showing <span className="text-gray-900">1-4</span> of <span className="text-gray-900">50</span> entries
          </p>

          <div className="flex items-center gap-1.5 order-1 sm:order-2">
            <button className="p-2 text-gray-300 pointer-events-none">
              <ChevronLeft size={18} />
            </button>
            <button className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-[#22C55E] text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm">1</button>
            <button className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-white text-gray-600 rounded-xl text-xs sm:text-sm font-bold border border-gray-100">2</button>
            <span className="px-1 text-gray-300 font-bold">...</span>
            <button className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-white text-gray-600 rounded-xl text-xs sm:text-sm font-bold border border-gray-100">10</button>
            <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
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
                  <Globe size={160} strokeWidth={1} className="text-white" />
                </div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                    <Plus size={22} strokeWidth={3} />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">Add Market</h3>
                    <p className="text-[10px] text-white/60 font-medium tracking-wide">Configuration</p>
                  </div>
                  <button onClick={() => setIsAddModalOpen(false)} className="ml-auto w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                    <Plus size={18} className="rotate-45" />
                  </button>
                </div>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto scrollbar-hide px-6 sm:px-8 py-6 sm:py-8">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <CustomSelect
                      label="Region / Country"
                      options={COUNTRIES}
                      placeholder="Select country"
                      value={selectedCountry}
                      onChange={setSelectedCountry}
                    />
                    <CustomSelect
                      label="Operating Currency"
                      options={CURRENCIES}
                      placeholder="Select currency"
                      value={selectedCurrency}
                      onChange={setSelectedCurrency}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Internal Log</label>
                    <textarea
                      placeholder="Add any strategic notes about this regional rule..."
                      rows={3}
                      className="w-full py-4 px-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#22C55E]/30 focus:ring-8 focus:ring-[#22C55E]/5 text-sm font-bold text-gray-900 placeholder:text-gray-300 outline-none resize-none transition-all"
                    />
                  </div>
                  <div className="pt-4 flex flex-col gap-2 pb-8">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsAddModalOpen(false)}
                      className="w-full py-4 bg-gray-900 text-white rounded-2xl text-sm font-bold hover:bg-black transition-all shadow-xl shadow-gray-200"
                    >
                      Save Configuration
                    </motion.button>
                    <button onClick={() => setIsAddModalOpen(false)} className="w-full py-3 text-gray-400 hover:text-gray-700 text-sm font-bold transition-colors">Discard Configuration</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
