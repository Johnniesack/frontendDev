"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Settings,
  LogOut,
  Package,
  ArrowLeftRight,
  CreditCard,
  ChevronDown,
  BarChart2,
  TrendingUp,
  ArrowRight,
  Menu,
  X,
  Ticket,
  FileText,
  Users,
  Globe,
  Monitor,
  Truck,
  PlayCircle,
  ChevronRight,
  Target,
  UserCog,
  User,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import { AccountView } from "./account-view";
import { MarketsView } from "./markets-view";

// ─── Mock data ────────────────────────────────────────────────────────────────
const STATS = [
  {
    label: "Inventory",
    value: "5",
    icon: Package,
    iconBg: "#F0FDF4",
    iconColor: "#22C55E",
    border: "#22C55E",
  },
  {
    label: "Transactions",
    value: "411",
    icon: ArrowLeftRight,
    iconBg: "#EFF6FF",
    iconColor: "#3B82F6",
    border: "#3B82F6",
  },
  {
    label: "Payments",
    value: "0",
    icon: CreditCard,
    iconBg: "#FFFBEB",
    iconColor: "#F59E0B",
    border: "#F59E0B",
  },
];

const CHART_DATA = [
  { day: "Mon", value: 35 },
  { day: "Tue", value: 58 },
  { day: "Wed", value: 52 },
  { day: "Thu", value: 88 },
  { day: "Fri", value: 22 },
  { day: "Sat", value: 65 },
  { day: "Sun", value: 80 },
];

const NAV_ITEMS = [
  {
    label: "Shop",
    icon: Home,
    children: [
      { label: "Dashboard", icon: Home },
      { label: "Coupons", icon: Ticket },
      { label: "Pages", icon: FileText },
      { label: "Personnel", icon: Users },
      { label: "Markets", icon: Globe },
      { label: "Website", icon: Monitor },
      { label: "Shipping", icon: Truck },
      { label: "Tutorials", icon: PlayCircle },
    ],
  },
  {
    label: "Operations",
    icon: BarChart2,
    children: [
      { label: "Goals", icon: Target },
      { label: "Agents", icon: UserCog },
    ],
  },
  {
    label: "Settings",
    type: "section",
    children: [{ label: "Account", icon: User }],
  },
];

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      className="bg-white border border-gray-100 rounded-xl px-4 py-2.5 shadow-lg"
    >
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-0.5">
        {label}
      </p>
      <p className="text-lg font-bold text-gray-900">{payload[0].value}</p>
    </div>
  );
}

function NavItem({
  item,
  activeNav,
  setActiveNav,
  onNavClick,
}: {
  item: any;
  activeNav: string;
  setActiveNav: (v: string) => void;
  onNavClick?: () => void;
}) {
  const Icon = item.icon;
  const isSection = item.type === "section";
  const hasChildren = item.children && item.children.length > 0;
  const isActive =
    activeNav === item.label ||
    (hasChildren && item.children?.some((child: any) => activeNav === child.label));
  const [isExpanded, setIsExpanded] = React.useState(true);

  if (isSection) {
    return (
      <div className="pt-4 pb-2">
        <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
          {item.label}
        </p>
        <div className="space-y-1">
          {item.children?.map((child: any) => {
            const ChildIcon = child.icon;
            const isChildActive = activeNav === child.label;
            return (
              <button
                key={child.label}
                onClick={() => {
                  setActiveNav(child.label);
                  onNavClick?.();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isChildActive
                    ? "bg-[#22C55E] text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                  }`}
              >
                <ChildIcon size={17} strokeWidth={isChildActive ? 2.5 : 2} />
                {child.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <button
        onClick={() => {
          if (hasChildren) {
            setIsExpanded(!isExpanded);
          } else {
            setActiveNav(item.label);
            onNavClick?.();
          }
        }}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive && !hasChildren
            ? "bg-[#22C55E] text-white shadow-sm"
            : isActive && hasChildren
              ? "text-[#22C55E] bg-green-50/50"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
          }`}
      >
        <div className="flex items-center gap-3">
          <Icon size={17} strokeWidth={isActive ? 2.5 : 2} />
          {item.label}
        </div>
        {hasChildren && (
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight size={14} strokeWidth={2.5} />
          </motion.div>
        )}
      </button>

      {hasChildren && (
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pl-11 pr-2 space-y-1 py-1">
                {item.children?.map((child: any) => {
                  const ChildIcon = child.icon;
                  const isChildActive = activeNav === child.label;
                  return (
                    <button
                      key={child.label}
                      onClick={() => {
                        setActiveNav(child.label);
                        onNavClick?.();
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${isChildActive
                          ? "bg-[#22C55E] text-white shadow-sm"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                        }`}
                    >
                      <ChildIcon size={14} strokeWidth={isChildActive ? 2.5 : 2} />
                      {child.label}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

// ─── Sidebar content (shared between drawer and desktop) ──────────────────────
function SidebarContent({
  activeNav,
  setActiveNav,
  onNavClick,
}: {
  activeNav: string;
  setActiveNav: (v: string) => void;
  onNavClick?: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-6 pt-7 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 leading-none">
          KRIFTH
        </h1>
        <p className="text-xs text-gray-400 font-medium mt-1">Test Shop</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.label}
            item={item}
            activeNav={activeNav}
            setActiveNav={setActiveNav}
            onNavClick={onNavClick}
          />
        ))}
      </nav>

      {/* User */}
      <div className="px-4 py-5 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
            AR
          </div>
          <span className="text-sm font-semibold text-gray-700 truncate">
            Alex Rivera
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard Layout ─────────────────────────────────────────────────────────
export function DashboardLayout() {
  const [activeNav, setActiveNav] = useState("Shop");
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div
      className="flex h-[100dvh] bg-[#F5F7FA] overflow-hidden"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex w-[210px] flex-shrink-0 bg-white border-r border-gray-100 flex-col h-full shadow-sm">
        <SidebarContent activeNav={activeNav} setActiveNav={setActiveNav} />
      </aside>

      {/* ── Mobile Drawer Overlay ── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            {/* Drawer */}
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-[230px] bg-white z-50 shadow-2xl lg:hidden flex flex-col"
            >
              {/* Close button */}
              <button
                onClick={() => setDrawerOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
              <SidebarContent
                activeNav={activeNav}
                setActiveNav={setActiveNav}
                onNavClick={() => setDrawerOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 sm:px-8 pt-5 sm:pt-6 pb-4 sm:pb-5 flex-shrink-0 bg-[#F5F7FA]">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-100 shadow-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Menu size={18} />
            </button>
            <h2 className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900 tracking-tight leading-tight">
              {activeNav === "Website"
                ? "Shop Settings"
                : activeNav === "Account"
                ? "Account Settings"
                : activeNav === "Markets"
                ? "Market Pricing"
                : "Shop Management Dashboard"}
            </h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-[#22C55E] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm hover:bg-[#16A34A] transition-colors"
          >
            <LogOut size={14} strokeWidth={2.5} />
            <span>Logout</span>
          </motion.button>
        </header>

        <div className="flex-1 overflow-y-auto">
          {activeNav === "Website" || activeNav === "Account" ? (
            <AccountView />
          ) : activeNav === "Markets" ? (
            <MarketsView />
          ) : (
            <div className="px-4 sm:px-8 pt-4 sm:pt-0 pb-8 space-y-5 sm:space-y-6">
              {/* ── Stat Cards ── */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                {STATS.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.4 }}
                      className="bg-white rounded-3xl p-5 sm:p-6 flex items-center gap-5 sm:gap-6 border-l-4 shadow-sm hover:shadow-md transition-shadow cursor-default"
                      style={{ borderLeftColor: stat.border }}
                    >
                      <div
                        className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: stat.iconBg }}
                      >
                        <Icon
                          size={20}
                          color={stat.iconColor}
                          strokeWidth={2}
                        />
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-[11px] text-gray-400 font-semibold uppercase tracking-widest mb-0.5">
                          {stat.label}
                        </p>
                        <p className="text-2xl sm:text-3xl font-black text-gray-900 leading-none">
                          {stat.value}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* ── Performance Chart ── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="bg-white rounded-2xl p-3 sm:p-6 shadow-sm"
              >
                {/* Chart header */}
                <div className="flex items-start justify-between mb-4 sm:mb-6 gap-2">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight flex items-center gap-2">
                      <TrendingUp size={16} className="text-[#22C55E]" />
                      Performance Overview
                    </h3>
                    <p className="text-[11px] sm:text-xs text-gray-400 font-medium mt-0.5">
                      Tracking your shop&apos;s growth and engagement
                    </p>
                  </div>
                  <button className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-gray-200 text-[11px] sm:text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap flex-shrink-0">
                    Past 7 Days
                    <ChevronDown size={12} />
                  </button>
                </div>

                {/* Recharts AreaChart */}
                <div className="h-[220px] sm:h-[260px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={CHART_DATA}
                      margin={{ top: 10, right: 4, left: -24, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="performanceGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22C55E" stopOpacity={0.18} />
                          <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#F3F4F6"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 11,
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontWeight: 500,
                          fill: "#9CA3AF",
                        }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 11,
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontWeight: 500,
                          fill: "#9CA3AF",
                        }}
                      />
                      <Tooltip
                        content={<ChartTooltip />}
                        cursor={{
                          stroke: "#22C55E",
                          strokeWidth: 1,
                          strokeDasharray: "4 4",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#22C55E"
                        strokeWidth={2.5}
                        fill="url(#performanceGrad)"
                        dot={{
                          r: 4,
                          fill: "white",
                          stroke: "#22C55E",
                          strokeWidth: 2,
                        }}
                        activeDot={{
                          r: 6,
                          fill: "#22C55E",
                          stroke: "white",
                          strokeWidth: 2,
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Detailed Analysis CTA */}
                <div className="flex justify-center mt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors shadow-sm w-full sm:w-auto justify-center"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Detailed Analysis
                    <ArrowRight size={15} strokeWidth={2.5} />
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
