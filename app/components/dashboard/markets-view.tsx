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
        className={`w-full py-4 px-6 rounded-2xl bg-gray-50 border transition-all text-sm font-bold flex items-center justify-between group ${isOpen ? "bg-white border-[#22C55E]/30 ring-8 ring-[#22C55E]/5 shadow-sm" : "border-transparent text-gray-900"
          }`}
      >
        <span className={!selectedOption ? "text-gray-300" : "text-gray-900"}>
          {selectedOption ? (selectedOption.name.includes("Dollar") ? `${selectedOption.code} - ${selectedOption.name}` : selectedOption.name) : placeholder}
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
                <span>{option.name.includes("Dollar") || label.includes("Currency") ? `${option.code} - ${option.name}` : option.name}</span>
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
    <div className="flex-1 px-3 sm:px-8 pb-8 min-w-0 overflow-x-hidden">
      {/* Header Area */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-5 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-[#22C55E] flex-shrink-0">
            <Globe size={24} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs text-gray-400 font-black uppercase tracking-[0.2em] leading-none mb-1">
              Market Management
            </p>
            <p className="text-xs sm:text-sm text-gray-500 font-medium leading-tight">
              Configure regional pricing and specific settings.
            </p>
          </div>
        </div>
        <motion.button
          onClick={() => setIsAddModalOpen(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-[#22C55E] text-white rounded-2xl text-sm font-bold shadow-lg shadow-green-100 hover:bg-[#16A34A] transition-all w-full sm:w-auto"
        >
          <Plus size={18} strokeWidth={3} />
          Add Pricing
        </motion.button>
      </motion.div>

      {/* Main Table Card */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-[24px] sm:rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
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
        <div className="hidden sm:block overflow-x-auto">
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
            <tbody className="divide-y divide-gray-50">
              {MOCK_DATA.map((item, idx) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-5 text-sm font-bold text-gray-500">{item.id}</td>
                  <td className="px-6 py-5 relative">
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
                  <td className="px-6 py-5">
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
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-black tracking-wider">
                      {item.currency}
                    </span>
                  </td>
                  <td className="px-6 py-5">
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
            <div key={item.id} className="p-4 space-y-3.5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-5 rounded-md overflow-hidden shadow-sm border border-gray-50 flex-shrink-0">
                    <img
                      src={`https://flagcdn.com/${item.countryCode}.svg`}
                      alt={`${item.place} flag`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{item.place}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">ID: {item.id}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-[10px] font-black tracking-wider">
                  {item.currency}
                </span>
              </div>

              <p className="text-xs font-semibold text-gray-500 leading-relaxed bg-gray-50/50 p-3 rounded-xl">
                {item.comment}
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => console.log("Inventory", item.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#22C55E]/10 text-[#22C55E] rounded-xl text-xs font-bold transition-all active:scale-[0.98]"
                >
                  <Package size={14} />
                  Inventory
                </button>
                <button
                  onClick={() => console.log("Delete", item.id)}
                  className="flex items-center justify-center w-10 h-10 bg-red-50 text-red-500 rounded-xl transition-all active:scale-[0.98]"
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

      {/* Add Pricing Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center px-0 sm:px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-xl bg-white rounded-t-[40px] sm:rounded-[40px] p-6 sm:p-10 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto overflow-x-hidden scrollbar-hide"
            >
              {/* Decorative background element - now contained properly */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 opacity-50 blur-3xl hidden sm:block pointer-events-none" />

              <div className="relative mb-6 sm:mb-8 text-center sm:text-left">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-green-50 flex items-center justify-center text-[#22C55E] mb-4 sm:mb-6 mx-auto sm:mx-0">
                  <Globe size={28} strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">Add Market</h3>
                <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed px-4 sm:px-0">
                  Configure regional pricing and specific currency rules for your global customers.
                </p>
              </div>

              <form className="relative space-y-5 sm:space-y-6" onSubmit={(e) => { e.preventDefault(); setIsAddModalOpen(false); }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                  <CustomSelect
                    label="Region / Country"
                    options={COUNTRIES}
                    placeholder="Select a country"
                    value={selectedCountry}
                    onChange={setSelectedCountry}
                  />
                  <CustomSelect
                    label="Default Currency"
                    options={CURRENCIES}
                    placeholder="Select currency"
                    value={selectedCurrency}
                    onChange={setSelectedCurrency}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">
                    Internal Comment
                  </label>
                  <textarea
                    placeholder="Describe the strategic importance..."
                    rows={2}
                    className="w-full py-4 px-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#22C55E]/30 focus:ring-8 focus:ring-[#22C55E]/5 transition-all text-sm font-bold text-gray-900 placeholder:text-gray-300 outline-none resize-none"
                  />
                </div>

                <div className="pt-6 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-gray-50 mt-4 sm:mt-8">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-10 py-4 bg-[#22C55E] text-white rounded-2xl text-sm font-bold shadow-xl shadow-green-100 hover:bg-[#16A34A] transition-all order-1 sm:order-2"
                  >
                    Create Market
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="w-full sm:w-auto px-8 py-4 text-gray-400 hover:text-gray-600 rounded-2xl text-sm font-bold transition-colors order-2 sm:order-1"
                  >
                    Dismiss
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
