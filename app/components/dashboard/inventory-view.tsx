"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  ArrowUpDown,
  Package,
  AlertTriangle,
  CheckCircle2,
  Globe,
  Edit3,
  Trash2,
  ChevronDown,
  ExternalLink,
  History,
  Layers,
  Zap,
  Boxes,
  ShieldAlert,
  LayoutGrid,
  CreditCard,
  Target,
  Activity,
  UploadCloud,
  Image as ImageIcon,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Grid,
  List as ListIcon,
} from "lucide-react";

interface ProductInventory {
  id: string;
  name: string;
  sku: string;
  category: string;
  basePrice: number;
  marketPrices: Record<string, number>; // Market ID -> Price
  stock: Record<string, number>; // Market ID -> Stock
  status: "in_stock" | "low_stock" | "out_of_stock";
  image: string;
  views: number;
  trend: number[];
}

const Sparkline = ({ data, color = "#0f172a" }: { data: number[], color?: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 60;
  const height = 24;
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="opacity-40 group-hover:opacity-100 transition-opacity">
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    </div>
  );
};

const MOCK_PRODUCTS: ProductInventory[] = [
  {
    id: "p1",
    name: "Aether Premium Tee",
    sku: "KRI-TH-001",
    category: "Clothing",
    basePrice: 45.0,
    marketPrices: { "12": 45.0, "13": 75000, "14": 42.0, "15": 38.0 },
    stock: { "12": 150, "13": 45, "14": 200, "15": 12 },
    status: "in_stock",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=200&h=200&auto=format&fit=crop",
    views: 1240,
    trend: [30, 45, 32, 60, 48, 72, 85],
  },
  {
    id: "p2",
    name: "Neural Link Hoodie",
    sku: "KRI-TH-002",
    category: "Clothing",
    basePrice: 85.0,
    marketPrices: { "12": 85.0, "13": 140000, "14": 80.0, "15": 72.0 },
    stock: { "12": 8, "13": 12, "14": 0, "15": 5 },
    status: "low_stock",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=200&h=200&auto=format&fit=crop",
    views: 3850,
    trend: [80, 70, 65, 40, 30, 20, 8],
  },
  {
    id: "p3",
    name: "Vector Cargo Pants",
    sku: "KRI-TH-003",
    category: "Clothing",
    basePrice: 120.0,
    marketPrices: { "12": 120.0, "13": 200000, "14": 115.0, "15": 105.0 },
    stock: { "12": 0, "13": 5, "14": 10, "15": 0 },
    status: "out_of_stock",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=200&h=200&auto=format&fit=crop",
    views: 920,
    trend: [10, 15, 8, 5, 2, 0, 0],
  },
  {
    id: "p4",
    name: "Krifth Classic Tote",
    sku: "KRI-TH-004",
    category: "Accessories",
    basePrice: 25.0,
    marketPrices: { "12": 25.0, "13": 40000, "14": 24.0, "15": 22.0 },
    stock: { "12": 340, "13": 120, "14": 500, "15": 88 },
    status: "in_stock",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=200&h=200&auto=format&fit=crop",
    views: 560,
    trend: [20, 22, 25, 28, 30, 35, 42],
  },
];

const MARKETS = [
  { id: "12", name: "Canada", code: "ca", currency: "CAD" },
  { id: "13", name: "Nigeria", code: "ng", currency: "NGN" },
  { id: "14", name: "Europe", code: "eu", currency: "EUR" },
  { id: "15", name: "United Kingdom", code: "gb", currency: "GBP" },
];

export default function InventoryView() {
  const [selectedMarketId, setSelectedMarketId] = useState<string>("12");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedProductDetail, setSelectedProductDetail] = useState<ProductInventory | null>(null);
  const [isGlobalEditing, setIsGlobalEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const currentMarket = MARKETS.find((m) => m.id === selectedMarketId) || MARKETS[0];

  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const stock = product.stock[selectedMarketId] || 0;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStatus = true;
    if (filterStatus === "in_stock") matchesStatus = stock >= 20;
    else if (filterStatus === "low_stock") matchesStatus = stock > 0 && stock < 20;
    else if (filterStatus === "out_of_stock") matchesStatus = stock === 0;

    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status: string, stock: number) => {
    if (stock === 0) return { label: "Out of Stock", color: "text-rose-500", bg: "bg-rose-50", icon: ShieldAlert };
    if (stock < 20) return { label: "Low Stock", color: "text-orange-500", bg: "bg-orange-50", icon: Activity };
    return { label: "In Stock", color: "text-emerald-500", bg: "bg-emerald-50", icon: CheckCircle2 };
  };

  const getCurrencySymbol = (code: string) => {
    switch (code) {
      case "NGN": return "₦";
      case "EUR": return "€";
      case "GBP": return "£";
      default: return "$";
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
      {/* --- Premium Header Section --- */}
      <div className="px-6 py-8 bg-white border-b border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-[1600px] mx-auto">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-900">
                <Package size={15} strokeWidth={2.5} />
              </div>
              <h1 className="text-sm font-black text-slate-900 tracking-tight uppercase">Market Inventory</h1>
            </div>
            <p className="text-sm font-medium text-slate-400">Manage stock and regional pricing across your global markets.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
            <div className="flex flex-col items-start sm:items-end w-full sm:w-auto order-2 sm:order-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5">Market Presence</span>
              <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-xl border border-slate-100 hover:border-slate-200 transition-all cursor-pointer group">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm overflow-hidden">
                  <img 
                    src={`https://flagcdn.com/${currentMarket.code}.svg`} 
                    className="w-full h-full object-cover scale-125" 
                    alt={currentMarket.name} 
                  />
                </div>
                <div className="px-2">
                  <select 
                    value={selectedMarketId}
                    onChange={(e) => setSelectedMarketId(e.target.value)}
                    className="appearance-none bg-transparent text-xs font-black text-slate-900 outline-none cursor-pointer pr-4 uppercase tracking-tighter"
                  >
                    {MARKETS.map(m => (
                      <option key={m.id} value={m.id}>{m.name} • {m.currency}</option>
                    ))}
                  </select>
                </div>
                <ChevronDown size={14} className="text-slate-400 -ml-3 group-hover:text-slate-900 transition-colors mr-1" />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAddModalOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-2xl text-sm font-black shadow-xl shadow-slate-200 order-1 sm:order-2 w-full sm:w-auto"
            >
              <Plus size={18} strokeWidth={3} />
              Add Product
            </motion.button>
          </div>
        </div>

        {/* --- Stats Cards (Vercel Style) --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8 max-w-[1600px] mx-auto px-4 sm:px-0">
          {[
            { label: "Total Skus", value: "24", icon: Boxes, color: "blue" },
            { label: "Market Stock", value: "1,240", icon: Target, color: "emerald" },
            { label: "In Stock", value: "21", icon: CheckCircle2, color: "emerald" },
            { label: "Low Stock", value: "3", icon: Activity, color: "orange" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-3 sm:p-5 bg-white border border-slate-100 rounded-xl sm:rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-lg transition-all group"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-${stat.color}-50 text-${stat.color}-500 group-hover:scale-110 transition-transform`}>
                  <stat.icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                </div>
                <div className="hidden sm:flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
                  +12% <ArrowUpDown size={10} className="rotate-0" />
                </div>
              </div>
              <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-lg sm:text-2xl font-black text-slate-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="flex-1 px-6 py-6 max-w-[1600px] mx-auto w-full space-y-6">
        
        {/* --- Filter Bar (Amazon/Netflix Premium) --- */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-3 sm:p-4 rounded-[24px] border border-slate-100 shadow-sm">
          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 sm:py-2.5 bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-900 focus:ring-4 focus:ring-slate-100 transition-all outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl overflow-x-auto scrollbar-hide flex-1 sm:flex-none">
              {["all", "in_stock", "low_stock", "out_of_stock"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`relative px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black whitespace-nowrap transition-all z-10 ${
                    filterStatus === status 
                    ? "text-white" 
                    : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {filterStatus === status && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute inset-0 bg-slate-900 rounded-lg sm:rounded-xl -z-10 shadow-lg shadow-slate-200"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  {status === "out_of_stock" ? "OUT OF STOCK" : status.replace("_", " ").toUpperCase()}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
              <button 
                onClick={() => setViewMode("list")}
                className={`p-1.5 sm:p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow-sm text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
              >
                <ArrowUpDown size={16} />
              </button>
              <button 
                onClick={() => setViewMode("grid")}
                className={`p-1.5 sm:p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
              >
                <LayoutGrid size={16} />
              </button>
            </div>
            <div className="w-px h-6 bg-slate-200 mx-2 hidden lg:block" />
            <button 
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`p-2 rounded-xl transition-all ${showAdvancedFilters ? 'bg-slate-200 text-slate-900' : 'bg-transparent text-slate-400 hover:text-slate-900'}`}
            >
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* --- Inventory Display (Grid or List) --- */}
        <div className="grid grid-cols-1 xl:grid-cols-1 gap-4">
          {viewMode === "list" ? (
            <div className="overflow-hidden">
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-left border-separate border-spacing-y-3 px-2">
                <thead>
                  <tr className="bg-transparent">
                    <th className="px-4 sm:px-6 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Product</th>
                    <th className="px-6 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hidden lg:table-cell">Performance</th>
                    <th className="px-6 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hidden sm:table-cell">Market Price</th>
                    <th className="px-6 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hidden md:table-cell">Stock Level</th>
                    <th className="px-6 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hidden sm:table-cell">Status</th>
                    <th className="px-4 sm:px-6 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right pr-6 sm:pr-10">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-transparent">
                  <AnimatePresence>
                    {filteredProducts.map((product, idx) => {
                      const stock = product.stock[selectedMarketId] || 0;
                      const price = product.marketPrices[selectedMarketId] || product.basePrice;
                      const status = getStatusConfig(product.status, stock);
                      const Icon = status.icon;

                      return (
                        <motion.tr
                          key={product.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ delay: idx * 0.05 }}
                          className="group/row bg-white rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] border border-slate-100/50 hover:border-slate-900/10 hover:bg-slate-50/30 hover:shadow-xl hover:shadow-slate-200/40 transition-all cursor-pointer"
                        >
                          <td 
                            onClick={() => setSelectedProductDetail(product)}
                            className="px-4 sm:px-6 py-4 sm:py-5 rounded-l-2xl border-y border-l border-transparent group-hover:border-slate-100 cursor-pointer"
                          >
                            <div className="flex items-center gap-3 sm:gap-4">
                              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex-shrink-0">
                                <img src={product.image} className="w-full h-full object-cover" alt="" />
                              </div>
                              <div className="min-w-0">
                                <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-slate-700 transition-colors truncate">{product.name}</h3>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase">{product.sku}</span>
                                  <span className="text-[9px] font-black text-slate-900 sm:hidden">
                                    {getCurrencySymbol(currentMarket.currency)}{price.toLocaleString()}
                                  </span>
                                  <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 ml-1">
                                    <Eye size={10} /> {product.views.toLocaleString()}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 border-y border-transparent group-hover:border-slate-100 hidden lg:table-cell">
                            <div className="flex flex-col gap-1">
                              <Sparkline data={product.trend} color={product.status === 'low_stock' ? '#f59e0b' : product.status === 'out_of_stock' ? '#ef4444' : '#0f172a'} />
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">7D Trend</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 border-y border-transparent group-hover:border-slate-100 hidden sm:table-cell">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1.5">
                                <span className="text-base font-black text-slate-900">
                                  {getCurrencySymbol(currentMarket.currency)}
                                  {price.toLocaleString()}
                                </span>
                                <Edit3 size={12} className="text-slate-300 opacity-0 group-hover:opacity-100 cursor-pointer transition-all" />
                              </div>
                              <span className="text-[10px] font-medium text-slate-400">Base: ${product.basePrice}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 border-y border-transparent group-hover:border-slate-100 hidden md:table-cell">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center justify-between max-w-[120px]">
                                <span className={`text-sm font-black ${stock < 20 ? 'text-amber-600' : 'text-slate-900'}`}>{stock} units</span>
                                <span className="text-[10px] font-bold text-slate-400">/ 500</span>
                              </div>
                              <div className="w-[120px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min((stock / 500) * 100, 100)}%` }}
                                  className={`h-full ${stock < 20 ? 'bg-amber-500' : 'bg-slate-900'}`}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 border-y border-transparent group-hover:border-slate-100 hidden sm:table-cell">
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${status.bg} ${status.color}`}>
                              <Icon size={14} strokeWidth={3} />
                              <span className="text-[11px] font-black uppercase tracking-wider">{status.label}</span>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 sm:py-5 rounded-r-2xl border-y border-r border-transparent group-hover:border-slate-100 text-right pr-4 sm:pr-8">
                            <div className="flex items-center justify-end gap-2">
                              {/* History Tooltip */}
                              <div className="relative group/tooltip">
                                <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                                  <History size={18} />
                                </button>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] font-black rounded-md opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all whitespace-nowrap pointer-events-none shadow-xl">
                                  VIEW HISTORY
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                                </div>
                              </div>

                              {/* Preview Tooltip */}
                              <div className="relative group/tooltip">
                                <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                                  <ExternalLink size={18} />
                                </button>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] font-black rounded-md opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all whitespace-nowrap pointer-events-none shadow-xl">
                                  LIVE PREVIEW
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                                </div>
                              </div>

                              <div className="w-px h-4 bg-slate-200 mx-1" />

                              {/* Delete Tooltip */}
                              <div className="relative group/tooltip">
                                <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                  <Trash2 size={18} />
                                </button>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-red-600 text-white text-[10px] font-black rounded-md opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all whitespace-nowrap pointer-events-none shadow-xl">
                                  REMOVE ITEM
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-red-600" />
                                </div>
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            
            {/* --- Pagination (Netflix Style) --- */}
            <div className="px-8 py-6 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between">
              <p className="text-xs font-bold text-slate-400">
                Displaying <span className="text-slate-900">1-4</span> of <span className="text-slate-900">24</span> results
              </p>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 text-xs font-black text-slate-400 hover:text-slate-900 transition-colors">Previous</button>
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map(p => (
                    <button key={p} className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${p === 1 ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-400 hover:bg-slate-100'}`}>
                      {p}
                    </button>
                  ))}
                </div>
                <button className="px-4 py-2 text-xs font-black text-slate-900">Next</button>
              </div>
            </div>
          </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2">
              <AnimatePresence>
                {filteredProducts.map((product, idx) => {
                  const stock = product.stock[selectedMarketId] || 0;
                  const price = product.marketPrices[selectedMarketId] || product.basePrice;
                  const status = getStatusConfig(product.status, stock);
                  const Icon = status.icon;

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => setSelectedProductDetail(product)}
                      className="group bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:shadow-slate-200 transition-all flex flex-col cursor-pointer"
                    >
                      <div className="relative aspect-square overflow-hidden">
                        <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                          <div className="bg-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 scale-90 group-hover:scale-100 transition-transform">
                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">View Global Details</span>
                            <ChevronRight size={14} className="text-slate-900" />
                          </div>
                        </div>
                        <div className="absolute top-4 left-4">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md bg-white/80 border border-white/20 shadow-sm ${status.color}`}>
                            <Icon size={12} strokeWidth={3} />
                            <span className="text-[9px] font-black uppercase tracking-wider">{status.label}</span>
                          </div>
                        </div>
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex flex-col gap-2">
                            <button className="p-2.5 bg-white rounded-xl shadow-lg text-slate-900 hover:scale-110 transition-transform">
                              <ExternalLink size={16} />
                            </button>
                            <button className="p-2.5 bg-white rounded-xl shadow-lg text-red-500 hover:scale-110 transition-transform">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                          <div className="flex items-center justify-between text-white">
                            <div className="flex flex-col">
                              <span className="text-lg font-black">{getCurrencySymbol(currentMarket.currency)}{price.toLocaleString()}</span>
                              <div className="flex items-center gap-1 text-[9px] font-bold opacity-80 mt-0.5">
                                <Sparkline data={product.trend} color="#ffffff" />
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-bold opacity-80">
                              <Eye size={12} /> {product.views.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-6 space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{product.sku}</span>
                            <span className="text-[10px] font-bold text-slate-400">{product.category}</span>
                          </div>
                          <h3 className="text-base font-black text-slate-900 leading-tight">{product.name}</h3>
                        </div>
                        <div className="pt-4 border-t border-slate-50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Market Stock</span>
                            <span className={`text-[10px] font-black ${stock < 20 ? 'text-amber-600' : 'text-slate-900'}`}>{stock} / 500</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min((stock / 500) * 100, 100)}%` }}
                              className={`h-full ${stock < 20 ? 'bg-amber-500' : 'bg-slate-900'}`}
                            />
                          </div>
                        </div>
                        <button className="w-full py-3 bg-slate-50 text-slate-900 rounded-xl text-xs font-black hover:bg-slate-900 hover:text-white transition-all">
                          Quick Edit Details
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* --- Advanced Filters Panel --- */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 overflow-hidden max-w-[1600px] mx-auto w-full"
          >
            <div className="bg-slate-900 text-white p-6 rounded-[24px] grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Category</label>
                <select className="w-full bg-slate-800 border-none rounded-xl text-sm font-bold text-white outline-none p-3">
                  <option>All Categories</option>
                  <option>Clothing</option>
                  <option>Accessories</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Price Range</label>
                <div className="flex items-center gap-2">
                  <input type="text" placeholder="Min" className="w-full bg-slate-800 border-none rounded-xl text-sm font-bold text-white outline-none p-3" />
                  <input type="text" placeholder="Max" className="w-full bg-slate-800 border-none rounded-xl text-sm font-bold text-white outline-none p-3" />
                </div>
              </div>
              <div className="flex items-end">
                <button className="w-full py-3 bg-white text-slate-900 rounded-xl text-sm font-black hover:bg-slate-100 transition-all">
                  Apply Advanced Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Add Product Modal (Slide-over) --- */}
      <AnimatePresence>
        {isAddModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full sm:max-w-md bg-white shadow-2xl z-[101] flex flex-col"
            >
              <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">Add New Product</h2>
                  <p className="text-[10px] sm:text-xs font-medium text-slate-400">Expand your market inventory with a new SKU.</p>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-all">
                  <X className="text-slate-400" size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
                {/* --- Image Upload Section --- */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Product Image</label>
                  <div className="group relative w-full h-48 rounded-[32px] border-2 border-dashed border-slate-100 bg-slate-50 flex flex-col items-center justify-center gap-3 hover:bg-slate-100 hover:border-slate-200 transition-all cursor-pointer overflow-hidden">
                    <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                      <UploadCloud size={24} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
                    </div>
                    <div className="text-center px-6">
                      <p className="text-xs font-black text-slate-900">Click to upload or drag & drop</p>
                      <p className="text-[10px] font-medium text-slate-400 mt-1">High-resolution PNG, JPG (max. 5MB)</p>
                    </div>
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Product Name</label>
                  <input type="text" placeholder="e.g. Premium Tech Hoodie" className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-slate-900 focus:ring-2 focus:ring-slate-900/5 transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">SKU ID</label>
                    <input type="text" placeholder="KRI-TH-XXX" className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-slate-900" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Category</label>
                    <select className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-slate-900 appearance-none">
                      <option>Clothing</option>
                      <option>Accessories</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Base Price (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">$</span>
                    <input type="number" placeholder="0.00" className="w-full p-4 pl-8 bg-slate-50 rounded-2xl border-none outline-none font-bold text-slate-900" />
                  </div>
                </div>
                <div className="p-6 bg-slate-900 rounded-[32px] text-white">
                  <div className="flex items-center gap-2 mb-4">
                    <Globe size={16} />
                    <h3 className="text-xs font-black uppercase tracking-widest">Market Pricing</h3>
                  </div>
                  <p className="text-[10px] text-slate-400 mb-6">Set initial stock and pricing for your active market.</p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{currentMarket.name} ({currentMarket.currency})</span>
                      <input type="number" placeholder="Price" className="w-24 bg-slate-800 border-none rounded-xl p-2 text-xs font-bold outline-none" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-slate-100">
                <button className="w-full py-4 bg-slate-900 text-white rounded-[24px] font-black shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Create Product & Update Stock
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- Cross-Market Detail Modal --- */}
      <AnimatePresence>
        {selectedProductDetail && (
          <div className="fixed inset-0 z-[100] flex items-center justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProductDetail(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full md:max-w-4xl h-full bg-white shadow-2xl flex flex-col overflow-hidden pt-[env(safe-area-inset-top)]"
            >
              {/* Detail Header */}
              <div className="px-6 sm:px-8 py-4 sm:py-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20">
                <button 
                  onClick={() => {
                    setSelectedProductDetail(null);
                    setIsGlobalEditing(false);
                  }}
                  className="p-2 -ml-2 sm:ml-0 hover:bg-slate-50 rounded-xl transition-all group"
                >
                  <ChevronLeft size={28} className="text-slate-900 sm:hidden" />
                  <X size={20} className="text-slate-400 group-hover:text-slate-900 hidden sm:block transition-colors" />
                </button>
                
                <div className="flex items-center gap-3 sm:gap-4 flex-1 justify-center sm:justify-start">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-50 flex items-center justify-center text-slate-900">
                    <Package size={18} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm sm:text-lg font-black text-slate-900 truncate max-w-[150px] sm:max-w-none">{selectedProductDetail.name}</h2>
                    <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{selectedProductDetail.sku}</p>
                  </div>
                </div>

                <div className="w-10 sm:hidden" /> {/* Spacer to center title on mobile */}
              </div>
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                  <div className="aspect-square rounded-[32px] sm:rounded-[40px] overflow-hidden border border-slate-100 shadow-inner bg-slate-50">
                    <img src={selectedProductDetail.image} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex flex-col justify-between py-2 sm:py-4">
                    <div className="space-y-4 sm:space-y-6">
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-100">
                          <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1 sm:mb-2">Total Views</span>
                          <div className="flex items-center gap-2">
                            <Eye size={16} className="text-slate-900" />
                            <span className="text-lg sm:text-2xl font-black text-slate-900">{selectedProductDetail.views.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-100">
                          <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1 sm:mb-2">Base Price (USD)</span>
                          <div className="flex items-center gap-2">
                            <CreditCard size={16} className="text-slate-900" />
                            {isGlobalEditing ? (
                              <input 
                                type="number" 
                                defaultValue={selectedProductDetail.basePrice}
                                className="text-lg sm:text-2xl font-black text-slate-900 bg-white border border-slate-200 rounded-lg px-1.5 w-full outline-none focus:border-slate-900 transition-all"
                              />
                            ) : (
                              <span className="text-lg sm:text-2xl font-black text-slate-900">${selectedProductDetail.basePrice}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="p-5 sm:p-6 bg-slate-900 rounded-[24px] sm:rounded-[32px] text-white">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Global Trend (7 Days)</span>
                          <Zap size={14} className="text-amber-400" />
                        </div>
                        <div className="h-16 sm:h-20 flex items-end gap-1">
                          {selectedProductDetail.trend.map((v, i) => (
                            <motion.div
                              key={i}
                              initial={{ height: 0 }}
                              animate={{ height: `${(v / Math.max(...selectedProductDetail.trend)) * 100}%` }}
                              className="flex-1 bg-white/20 rounded-t-sm hover:bg-white/40 transition-colors cursor-pointer"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Market Breakdown */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-[10px] sm:text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Market Breakdown</h3>
                  <div className="grid grid-cols-1 gap-2 sm:gap-3">
                    {MARKETS.map((market) => {
                      const mPrice = selectedProductDetail.marketPrices[market.id] || selectedProductDetail.basePrice;
                      const mStock = selectedProductDetail.stock[market.id] || 0;
                      
                      return (
                        <div key={market.id} className="p-4 sm:p-6 bg-white border border-slate-100 rounded-2xl sm:rounded-[28px] hover:border-slate-900/10 transition-all group">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-8">
                            {/* Region Info */}
                            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl overflow-hidden border border-slate-100 shadow-sm flex-shrink-0">
                                <img src={`https://flagcdn.com/${market.code}.svg`} className="w-full h-full object-cover scale-150" alt="" />
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-sm sm:text-base font-black text-slate-900 truncate">{market.name}</h4>
                                <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">{market.currency} Market</span>
                              </div>
                            </div>

                            {/* Stats Info */}
                            <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-12 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                              <div className="flex flex-col sm:items-end">
                                <span className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Regional Price</span>
                                {isGlobalEditing ? (
                                  <div className="relative">
                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-400">{getCurrencySymbol(market.currency)}</span>
                                    <input 
                                      type="number" 
                                      defaultValue={mPrice}
                                      className="w-24 sm:w-28 p-1.5 sm:p-2 pl-5 sm:pl-6 bg-white border-2 border-slate-200 rounded-lg sm:rounded-xl text-xs sm:text-sm font-black text-slate-900 outline-none focus:border-emerald-500 transition-all shadow-sm"
                                    />
                                  </div>
                                ) : (
                                  <span className="text-sm sm:text-lg font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                                    {getCurrencySymbol(market.currency)}{mPrice.toLocaleString()}
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-col items-end min-w-[70px] sm:min-w-[100px]">
                                <span className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Local Stock</span>
                                {isGlobalEditing ? (
                                  <input 
                                    type="number" 
                                    defaultValue={mStock}
                                    className="w-16 sm:w-20 p-1.5 sm:p-2 bg-white border-2 border-slate-200 rounded-lg sm:rounded-xl text-xs sm:text-sm font-black text-slate-900 text-right outline-none focus:border-emerald-500 transition-all shadow-sm"
                                  />
                                ) : (
                                  <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                                    <span className={`text-sm sm:text-lg font-black ${mStock < 20 ? 'text-rose-600' : 'text-slate-900'}`}>{mStock}</span>
                                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${mStock < 20 ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Sticky Action Bar */}
              <div className="px-6 sm:px-8 py-4 sm:py-6 border-t border-slate-100 bg-white/80 backdrop-blur-lg sticky bottom-0 z-20">
                {isGlobalEditing ? (
                  <div className="flex gap-2 sm:gap-3">
                    <button 
                      onClick={() => {
                        setIsSaving(true);
                        setTimeout(() => {
                          setIsSaving(false);
                          setIsGlobalEditing(false);
                        }, 1500);
                      }}
                      className="flex-[2] py-4 sm:py-5 bg-slate-900 text-white rounded-xl sm:rounded-[24px] text-xs sm:text-sm font-black shadow-xl shadow-slate-200 hover:bg-black transition-all flex items-center justify-center gap-2"
                    >
                      {isSaving ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                          <History size={16} />
                        </motion.div>
                      ) : <CheckCircle2 size={16} />}
                      {isSaving ? "SYNCING..." : "SAVE CHANGES"}
                    </button>
                    <button 
                      onClick={() => setIsGlobalEditing(false)}
                      className="flex-1 py-4 sm:py-5 bg-slate-100 text-slate-900 rounded-xl sm:rounded-[24px] text-xs sm:text-sm font-black hover:bg-slate-200 transition-all"
                    >
                      CANCEL
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsGlobalEditing(true)}
                    className="w-full py-4 sm:py-5 bg-emerald-500 text-white rounded-xl sm:rounded-[24px] text-xs sm:text-sm font-black shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Edit3 size={16} />
                    UPDATE GLOBAL DATA
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
