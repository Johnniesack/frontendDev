"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "@/lib/api/auth";
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
  Plus,
  Bell,
  ShoppingCart,
  AlertCircle,
  CheckCircle2,
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
import ShippingView from "./shipping-view";
import { WebsiteView } from "./website-view";
import { PagesView } from "./pages-view";
import { CouponsView } from "./coupons-view";
import { PersonnelView } from "./personnel-view";
import { TutorialsView } from "./tutorials-view";
import InventoryView from "./inventory-view";

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
      { label: "Inventory", icon: Package },
      { label: "Website", icon: Monitor },
      { label: "Shipping", icon: Truck },
      { label: "Tutorials", icon: PlayCircle },
      { label: "Payments", icon: CreditCard },
      { label: "Transactions", icon: ArrowLeftRight },
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

// Bottom-nav primary tabs (mobile)
const BOTTOM_TABS = [
  { label: "Dashboard", icon: Home },
  { label: "Website", icon: Monitor },
  { label: "Shipping", icon: Truck },
  { label: "Account", icon: User },
];

// All items for the "More" bottom sheet
const MORE_ITEMS = [
  { label: "Coupons", icon: Ticket },
  { label: "Pages", icon: FileText },
  { label: "Personnel", icon: Users },
  { label: "Markets", icon: Globe },
  { label: "Inventory", icon: Package },
  { label: "Tutorials", icon: PlayCircle },
  { label: "Goals", icon: Target },
  { label: "Agents", icon: UserCog },
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

// ─── Mobile Bottom Nav ────────────────────────────────────────────────────────
function MobileBottomNav({
  activeNav,
  setActiveNav,
  onLogout,
}: {
  activeNav: string;
  setActiveNav: (v: string) => void;
  onLogout: () => void;
}) {
  const [showMore, setShowMore] = useState(false);

  const handleMoreItem = (label: string) => {
    setActiveNav(label);
    setShowMore(false);
  };

  return (
    <>
      {/* Bottom bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-100 flex items-stretch shadow-2xl shadow-black/10 pb-safe px-safe">
        {BOTTOM_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeNav === tab.label;
          return (
            <button
              key={tab.label}
              onClick={() => setActiveNav(tab.label)}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-3 min-h-[60px] relative transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-tab-indicator"
                  className="absolute top-0 inset-x-3 h-0.5 rounded-full"
                  style={{ backgroundColor: "#22C55E" }}
                />
              )}
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} color={isActive ? "#22C55E" : "#9CA3AF"} />
              <span className={`text-[10px] font-bold tracking-wide ${isActive ? "text-[#22C55E]" : "text-gray-400"}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
        {/* More tab */}
        <button
          onClick={() => setShowMore(true)}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3 min-h-[60px] relative"
        >
          <Menu size={22} strokeWidth={1.8} color="#9CA3AF" />
          <span className="text-[10px] font-bold tracking-wide text-gray-400">More</span>
        </button>
      </nav>

      {/* More bottom sheet */}
      <AnimatePresence>
        {showMore && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMore(false)}
              className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="md:hidden fixed bottom-0 inset-x-0 z-[70] bg-white rounded-t-[32px] shadow-2xl pb-safe"
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-gray-200 rounded-full" />
              </div>
              <div className="px-6 pb-2">
                <h3 className="text-sm font-black text-gray-900 mb-1">More</h3>
                <p className="text-xs text-gray-400 font-medium">All dashboard sections</p>
              </div>
              <div className="grid grid-cols-4 gap-2 px-4 pb-8">
                {MORE_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeNav === item.label;
                  return (
                    <motion.button
                      key={item.label}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleMoreItem(item.label)}
                      className="flex flex-col items-center justify-center gap-2 py-4 rounded-2xl transition-all"
                      style={{ backgroundColor: isActive ? "#F0FDF4" : "#F9FAFB" }}
                    >
                      <Icon size={22} strokeWidth={1.8} color={isActive ? "#22C55E" : "#6B7280"} />
                      <span className={`text-[10px] font-bold text-center leading-tight ${isActive ? "text-[#22C55E]" : "text-gray-500"}`}>
                        {item.label}
                      </span>
                    </motion.button>
                  );
                })}
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => {
                    setShowMore(false);
                    onLogout();
                  }}
                  className="flex flex-col items-center justify-center gap-2 py-4 rounded-2xl transition-all bg-red-50"
                >
                  <LogOut size={22} strokeWidth={1.8} className="text-red-500" />
                  <span className="text-[10px] font-bold text-center leading-tight text-red-600">
                    Log out
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Tablet Icon Sidebar ───────────────────────────────────────────────────────
const ALL_FLAT_ITEMS = [
  { label: "Dashboard", icon: Home },
  { label: "Website", icon: Monitor },
  { label: "Shipping", icon: Truck },
  { label: "Pages", icon: FileText },
  { label: "Markets", icon: Globe },
  { label: "Inventory", icon: Package },
  { label: "Coupons", icon: Ticket },
  { label: "Personnel", icon: Users },
  { label: "Goals", icon: Target },
  { label: "Agents", icon: UserCog },
  { label: "Account", icon: User },
];

function TabletSidebar({
  activeNav,
  setActiveNav,
}: {
  activeNav: string;
  setActiveNav: (v: string) => void;
}) {
  return (
    <aside className="hidden md:flex lg:hidden w-[68px] flex-shrink-0 bg-white border-r border-gray-100 flex-col items-center pt-[calc(max(2.5rem,env(safe-area-inset-top,0px)))] md:pt-4 pb-4 gap-1 shadow-sm">
      {/* Logo mark */}
      <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-900 text-[11px] font-black mb-3">
        K
      </div>
      <div className="w-8 h-px bg-gray-100 mb-2" />
      <div className="flex-1 flex flex-col gap-1 w-full px-2 overflow-y-auto scrollbar-hide">
        {ALL_FLAT_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.label;
          return (
            <button
              key={item.label}
              onClick={() => setActiveNav(item.label)}
              title={item.label}
              className={`w-full flex items-center justify-center p-3 rounded-xl transition-all ${isActive ? "bg-[#22C55E] text-white shadow-sm" : "text-gray-400 hover:bg-gray-50 hover:text-gray-700"
                }`}
            >
              <Icon size={19} strokeWidth={isActive ? 2.5 : 1.8} />
            </button>
          );
        })}
      </div>
      {/* Logout */}
      <div className="w-8 h-px bg-gray-100 mt-2 mb-2" />
      <button title="Logout" className="p-3 rounded-xl text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all">
        <LogOut size={19} strokeWidth={1.8} />
      </button>
    </aside>
  );
}

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
      <div className="px-6 pt-[calc(max(2.5rem,env(safe-area-inset-top,0px)))] md:pt-4 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 leading-none">
          KRIFTH
        </h1>
        <p className="text-xs text-gray-400 font-medium mt-1">Test Shop</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-hide">
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
          <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 text-[10px] font-bold flex-shrink-0">
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

// ─── Notification Bell ────────────────────────────────────────────────────────
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: "order",
    icon: ShoppingCart,
    iconBg: "#F0FDF4",
    iconColor: "#22C55E",
    title: "New order received",
    desc: "Order #4821 placed for $142.00",
    time: "2 min ago",
    read: false,
  },
  {
    id: 2,
    type: "alert",
    icon: AlertCircle,
    iconBg: "#FFF7ED",
    iconColor: "#F97316",
    title: "Low inventory warning",
    desc: "Product \"Krifth Tee\" is below 5 units",
    time: "18 min ago",
    read: false,
  },
  {
    id: 3,
    type: "success",
    icon: CheckCircle2,
    iconBg: "#F0FDF4",
    iconColor: "#22C55E",
    title: "Shipping zone updated",
    desc: "Ghana region changed to Exempted",
    time: "1 hr ago",
    read: true,
  },
  {
    id: 4,
    type: "order",
    icon: ShoppingCart,
    iconBg: "#F0FDF4",
    iconColor: "#22C55E",
    title: "New order received",
    desc: "Order #4820 placed for $88.50",
    time: "3 hr ago",
    read: true,
  },
];

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const ref = React.useRef<HTMLDivElement>(null);
  const unread = notifications.filter((n) => !n.read).length;

  React.useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", h);
    return () => window.removeEventListener("mousedown", h);
  }, []);

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <div className="relative" ref={ref}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((v) => !v)}
        className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-100 shadow-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <Bell size={17} strokeWidth={2} />
        {unread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-[#22C55E] rounded-full flex items-center justify-center text-[9px] font-black text-white leading-none"
          >
            {unread}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 6, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="fixed inset-x-4 top-[calc(72px+env(safe-area-inset-top,0px))] sm:absolute sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:top-full z-[200] w-auto sm:w-[340px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            {/* Panel header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-50">
              <div>
                <p className="text-sm font-black text-gray-900 whitespace-nowrap">Notifications</p>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                  {unread > 0 ? `${unread} unread` : "All caught up!"}
                </p>
              </div>
              {unread > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[10px] font-bold text-[#22C55E] hover:text-[#16A34A] transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification list */}
            <div className="divide-y divide-gray-50 max-h-[360px] overflow-y-auto scrollbar-hide">
              {notifications.map((n, i) => {
                const Icon = n.icon;
                return (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() =>
                      setNotifications((prev) =>
                        prev.map((item) =>
                          item.id === n.id ? { ...item, read: true } : item
                        )
                      )
                    }
                    className={`flex items-start gap-3 px-5 py-4 cursor-pointer transition-colors ${n.read ? "hover:bg-gray-50/60" : "bg-green-50/30 hover:bg-green-50/60"
                      }`}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: n.iconBg }}
                    >
                      <Icon size={16} strokeWidth={2} style={{ color: n.iconColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-xs font-bold leading-tight ${n.read ? "text-gray-700" : "text-gray-900"}`}>
                          {n.title}
                        </p>
                        {!n.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 font-medium mt-0.5 truncate">{n.desc}</p>
                      <p className="text-[10px] text-gray-300 font-semibold mt-1">{n.time}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/40">
              <button className="w-full text-center text-[11px] font-bold text-gray-400 hover:text-gray-700 transition-colors">
                View all notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Dashboard Layout ─────────────────────────────────────────────────────────
export function DashboardLayout() {

  const [activeNav, setActiveNav] = useState("Shop");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken) {
      try {
        await logout(refreshToken);
      } catch (err) {
        console.error("Logout API failed, continuing local logout...", err);
      }
    }
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("is_onboarded");
    window.location.href = "/";
  };

  React.useEffect(() => {
    // Add class to html to enable light-mode dashboard background
    // This overrides the dark auth background via CSS class specificity
    document.documentElement.classList.add('dashboard-active');
    // Also set meta theme-color for status bar on mobile browsers
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#F5F7FA');
    return () => {
      document.documentElement.classList.remove('dashboard-active');
      if (meta) meta.setAttribute('content', '#0A0A0B');
    };
  }, []);

  return (
    <div
      className="flex w-full h-[100dvh] min-h-[100dvh] bg-[#F5F7FA] overflow-hidden relative"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {/* Full-bleed background that covers ALL safe area zones (notch, home indicator) */}
      <div className="fixed inset-0 bg-[#F5F7FA] -z-1" />
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex w-[210px] flex-shrink-0 bg-white border-r border-gray-100 flex-col h-full shadow-sm">
        <SidebarContent activeNav={activeNav} setActiveNav={setActiveNav} />
      </aside>

      {/* ── Tablet Icon Sidebar ── */}
      <TabletSidebar activeNav={activeNav} setActiveNav={setActiveNav} />

      {/* ── Mobile Bottom Nav ── */}
      <MobileBottomNav activeNav={activeNav} setActiveNav={setActiveNav} onLogout={() => setShowLogoutConfirm(true)} />

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between gap-3 px-4 md:px-6 lg:px-8 pt-header-safe md:pt-4 pb-3 bg-[#F5F7FA] flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile: brand mark instead of hamburger */}
            <div className="md:hidden w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-900 text-[11px] font-black flex-shrink-0">
              K
            </div>
            <h2 className="text-base sm:text-xl lg:text-2xl font-black text-gray-900 tracking-tight leading-tight truncate">
              {activeNav === "Website" ? "Shop Settings"
                : activeNav === "Account" ? "Account Settings"
                  : activeNav === "Markets" ? "Market Pricing"
                    : activeNav === "Shipping" ? "Shipping"
                      : activeNav === "Pages" ? "Pages"
                        : activeNav === "Dashboard" ? "Dashboard"
                          : activeNav}
            </h2>
          </div>

          {/* Right: Bell + context action */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <NotificationBell />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center gap-2 px-3 sm:px-5 py-2.5 bg-[#22C55E] text-white rounded-xl text-xs sm:text-sm font-black shadow-sm hover:bg-[#16A34A] transition-colors"
            >
              <LogOut size={14} strokeWidth={2.5} />
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden text-[10px]">Logout</span>
            </motion.button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-hide pb-24 md:pb-4" style={{ WebkitOverflowScrolling: 'touch' }}>
          {activeNav === "Website" ? (
            <WebsiteView />
          ) : activeNav === "Account" ? (
            <AccountView />
          ) : activeNav === "Markets" ? (
            <MarketsView setActiveNav={setActiveNav} />
          ) : activeNav === "Shipping" ? (
            <ShippingView />
          ) : activeNav === "Pages" ? (
            <PagesView />
          ) : activeNav === "Coupons" ? (
            <CouponsView />
          ) : activeNav === "Personnel" ? (
            <PersonnelView />
          ) : activeNav === "Tutorials" ? (
            <TutorialsView />
          ) : activeNav === "Inventory" ? (
            <InventoryView />
          ) : activeNav === "Payments" ? (
            <div className="flex-1 flex items-center justify-center text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Payments Module Coming Soon</div>
          ) : activeNav === "Transactions" ? (
            <div className="flex-1 flex items-center justify-center text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Transactions History Coming Soon</div>
          ) : (
            <div className="px-4 sm:px-8 pt-4 sm:pt-6 pb-8 space-y-4 sm:space-y-6">
              {/* ── Stat Cards ── */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
                {STATS.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.08, duration: 0.4 }}
                      className="bg-white rounded-xl p-5 sm:p-6 flex items-center gap-5 sm:gap-6 border-l-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all cursor-default"
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="bg-white rounded-xl p-4 sm:p-8 border border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
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
                <div className="w-full relative" style={{ height: '260px', minHeight: '260px' }}>
                  <ResponsiveContainer width="100%" height={260} minWidth={0} debounce={50}>
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

      {/* ── Logout Confirmation Modal ── */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[32px] p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50" />

              <div className="relative z-10 text-center">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <LogOut size={28} className="text-red-500" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Logout</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8">
                  Are you sure you want to log out? You&apos;ll need to sign in again to access your dashboard.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="h-12 rounded-xl border border-gray-100 text-gray-500 font-bold text-sm hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="h-12 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors shadow-lg shadow-red-200"
                  >
                    Logout
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
