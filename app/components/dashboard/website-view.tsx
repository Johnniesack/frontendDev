"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Layout,
  Upload,
  Zap,
  Lock,
  CreditCard,
  Image as ImageIcon,
  Plus,
  Trash2,
  ExternalLink,
  ChevronRight,
  Info,
  Monitor,
  Smartphone,
  CheckCircle2,
  Sparkles
} from "lucide-react";

const InstagramIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export function WebsiteView() {
  const [activeTab, setActiveTab] = useState("Brand Info");
  const [logo, setLogo] = useState<string | null>(null);
  const [brandName, setBrandName] = useState("");
  const [brandColor, setBrandColor] = useState("#22C55E");
  const [brandFont, setBrandFont] = useState("Space Grotesk");
  const [instagram, setInstagram] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState({ show: false, message: "", type: "success" });
  const [subdomain, setSubdomain] = useState("");
  const [subdomainStatus, setSubdomainStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [isPro, setIsPro] = useState(false);
  const [hasCard, setHasCard] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [customDomain, setCustomDomain] = useState("");
  const [dnsStatus, setDnsStatus] = useState<"idle" | "verifying" | "connected" | "error">("idle");
  const [sliders, setSliders] = useState<any[]>([
    { id: 1, title: "Summer Collection 2024", priority: 1, image: null },
    { id: 2, title: "New Arrivals", priority: 2, image: null },
  ]);

  const colorPresets = ["#22C55E", "#3B82F6", "#EF4444", "#F59E0B", "#8B5CF6", "#EC4899", "#111827"];
  const fontPresets = ["Space Grotesk", "Inter", "Outfit", "Plus Jakarta Sans", "Roboto"];

  const tabs = [
    { id: "Brand Info", icon: Info },
    { id: "Slider", icon: ImageIcon },
    { id: "URL", icon: Globe },
  ];

  const triggerToast = (message: string, type: "success" | "info" = "success") => {
    setShowToast({ show: true, message, type });
    setTimeout(() => setShowToast({ show: false, message: "", type: "success" }), 3000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSaving(false);
    triggerToast("Changes Saved Successfully");
  };

  const addSlide = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const newId = sliders.length > 0 ? Math.max(...sliders.map(s => s.id)) + 1 : 1;
      setSliders([{ id: newId, title: "New Banner", priority: 0, image: e.target?.result }, ...sliders]);
      triggerToast("Slide added with image", "success");
    };
    reader.readAsDataURL(file);
  };

  const deleteSlide = (id: number) => {
    setSliders(sliders.filter(s => s.id !== id));
    triggerToast("Slide removed", "info");
  };

  const updateSlideTitle = (id: number, title: string) => {
    setSliders(sliders.map(s => s.id === id ? { ...s, title } : s));
  };

  const handleUpgrade = () => {
    if (!hasCard) {
      setShowPaymentModal(true);
    } else {
      setIsPro(true);
      triggerToast("Pro Plan activated! Connect your domain.", "success");
    }
  };

  const handlePayment = async () => {
    if (!cardNumber || !cardName || !expiry || !cvv) return;
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setHasCard(true);
    setShowPaymentModal(false);
    setIsPro(true);
    triggerToast("Pro Plan activated! Connect your domain.", "success");
  };

  const verifyDomain = async () => {
    if (!customDomain) return;
    setDnsStatus("verifying");
    await new Promise(resolve => setTimeout(resolve, 2000));
    setDnsStatus(Math.random() > 0.3 ? "connected" : "error");
  };

  const checkAvailability = async () => {
    if (!subdomain) return;
    setSubdomainStatus("checking");
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSubdomainStatus(Math.random() > 0.3 ? "available" : "taken");
  };

  // Reset status when typing
  React.useEffect(() => {
    setSubdomainStatus("idle");
  }, [subdomain]);

  return (
    <div className="flex-1 px-4 sm:px-8 pt-4 sm:pt-6 pb-8 animate-in fade-in duration-500 relative">
      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setShowPaymentModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-hide"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-gray-900">Upgrade to Pro</h3>
                  <p className="text-sm text-gray-400 font-medium mt-0.5">$29/month · Cancel anytime</p>
                </div>
                <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-[10px] font-black uppercase tracking-widest text-white">
                  Pro
                </div>
              </div>

              {/* Live Card Preview */}
              <div className="relative h-44 rounded-3xl overflow-hidden mb-8 select-none"
                style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)" }}
              >
                <div className="absolute inset-0 opacity-20"
                  style={{ backgroundImage: "radial-gradient(circle at 80% 20%, rgba(139,92,246,0.8) 0%, transparent 50%)" }}
                />
                <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      <div className="w-7 h-5 bg-white/20 rounded" />
                      <div className="w-7 h-5 bg-white/10 rounded" />
                    </div>
                    <CreditCard size={28} className="text-white/40" />
                  </div>
                  <div>
                    <p className="text-white/90 font-mono font-bold text-lg tracking-[0.2em] mb-4">
                      {cardNumber
                        ? cardNumber.padEnd(19, " ").replace(/(.{4})/g, "$1 ").trim().split("").map((c, i) =>
                          i < cardNumber.length ? c : (c === " " ? " " : "•")
                        ).join("")
                        : "•••• •••• •••• ••••"}
                    </p>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-0.5">Cardholder</p>
                        <p className="text-white font-bold text-sm truncate max-w-[180px]">
                          {cardName || "YOUR NAME"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-0.5">Expires</p>
                        <p className="text-white font-bold text-sm">{expiry || "MM/YY"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Card Number</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, "");
                      const formatted = raw.match(/.{1,4}/g)?.join(" ") ?? raw;
                      setCardNumber(formatted);
                    }}
                    className="w-full px-5 py-3.5 bg-gray-50 rounded-2xl text-sm font-bold text-gray-900 outline-none border border-transparent focus:bg-white focus:border-indigo-200 focus:shadow-sm transition-all placeholder:text-gray-300"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    className="w-full px-5 py-3.5 bg-gray-50 rounded-2xl text-sm font-bold text-gray-900 outline-none border border-transparent focus:bg-white focus:border-indigo-200 focus:shadow-sm transition-all placeholder:text-gray-300"
                    placeholder="JOHN DOE"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Expiry</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={5}
                      value={expiry}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "");
                        const formatted = raw.length > 2 ? `${raw.slice(0, 2)}/${raw.slice(2)}` : raw;
                        setExpiry(formatted);
                      }}
                      className="w-full px-5 py-3.5 bg-gray-50 rounded-2xl text-sm font-bold text-gray-900 outline-none border border-transparent focus:bg-white focus:border-indigo-200 focus:shadow-sm transition-all placeholder:text-gray-300"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">CVV</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                      className="w-full px-5 py-3.5 bg-gray-50 rounded-2xl text-sm font-bold text-gray-900 outline-none border border-transparent focus:bg-white focus:border-indigo-200 focus:shadow-sm transition-all placeholder:text-gray-300"
                      placeholder="•••"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 space-y-3">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handlePayment}
                  disabled={isProcessing || !cardNumber || !cardName || !expiry || !cvv}
                  className="w-full py-4 rounded-2xl text-sm font-black text-white flex items-center justify-center gap-2 transition-all disabled:opacity-40 bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg shadow-indigo-200"
                >
                  {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Lock size={16} />
                  )}
                  {isProcessing ? "Processing Payment..." : "Pay $29 & Activate Pro"}
                </motion.button>
                <p className="text-center text-[10px] text-gray-400 font-medium flex items-center justify-center gap-1">
                  <Lock size={10} /> Secured with 256-bit SSL encryption
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}

      <AnimatePresence>
        {showToast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-[200] bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 backdrop-blur-xl"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${showToast.type === 'success' ? 'bg-[#22C55E]/20' : 'bg-blue-500/20'}`} style={{ backgroundColor: showToast.type === 'success' ? `${brandColor}20` : undefined }}>
              {showToast.type === 'success' ? (
                <CheckCircle2 size={18} style={{ color: brandColor }} />
              ) : (
                <Sparkles size={18} className="text-blue-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-black">{showToast.message}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Shop environment updated</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex items-center gap-5 sm:gap-8 border-b border-gray-200 mb-6 sm:mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide pb-px -mx-4 px-4 sm:mx-0 sm:px-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-4 text-sm font-bold transition-all relative ${activeTab === tab.id ? "" : "text-gray-400 hover:text-gray-600"
              }`}
            style={{ color: activeTab === tab.id ? brandColor : undefined }}
          >
            <tab.icon size={16} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
            {tab.id}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabWebsite"
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: brandColor }}
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "Brand Info" && (
          <motion.div
            key="brand"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            <div className="lg:col-span-7 space-y-6">
              <section className="bg-white rounded-xl p-6 sm:p-8 shadow-[0_1px_2px_rgba(0,0,0,0.02)] border border-gray-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-16 -mt-16 opacity-40 group-hover:opacity-60 transition-opacity" style={{ backgroundColor: `${brandColor}15` }} />

                <div className="relative z-10 mb-8">
                  <h3 className="text-xl font-black text-gray-900 mb-1 flex items-center gap-2">
                    <Sparkles size={20} style={{ color: brandColor }} />
                    Brand Identity
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">
                    Configure your shop's visual presence and social connections.
                  </p>
                </div>

                <div className="space-y-8 relative z-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">
                      Shop Logo
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative group/logo">
                        {logo ? (
                          <img src={logo} alt="Logo" className="w-full h-full object-contain p-2" />
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-gray-300">
                            <ImageIcon size={32} strokeWidth={1.5} />
                          </div>
                        )}
                        <input
                          type="file"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => setLogo(ev.target?.result as string);
                              reader.readAsDataURL(file);
                              triggerToast("Logo uploaded", "info");
                            }
                          }}
                        />
                      </div>
                      <div className="flex-1 space-y-2 text-center sm:text-left">
                        <h4 className="text-sm font-bold text-gray-800">Upload your logo</h4>
                        <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-[240px]">
                          We recommend a high-resolution PNG or SVG with a transparent background.
                        </p>
                        <button
                          className="text-xs font-black transition-colors flex items-center gap-1.5 mx-auto sm:mx-0 pt-2 relative"
                          style={{ color: brandColor }}
                        >
                          <Upload size={14} />
                          Choose File
                          <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (ev) => setLogo(ev.target?.result as string);
                                reader.readAsDataURL(file);
                                triggerToast("Logo uploaded", "info");
                              }
                            }}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">
                        Brand Name
                      </label>
                      <input
                        type="text"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold text-gray-900 focus:bg-white focus:border-opacity-30 focus:ring-4 transition-all placeholder:text-gray-300 outline-none"
                        style={{ focusBorderColor: brandColor, focusRingColor: `${brandColor}10` } as any}
                        placeholder="e.g. kRiTH Test Shop"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">
                        Brand Color
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="relative group/picker">
                          <input
                            type="color"
                            value={brandColor}
                            onChange={(e) => setBrandColor(e.target.value)}
                            className="w-12 h-12 rounded-xl cursor-pointer border-none bg-transparent overflow-hidden"
                          />
                        </div>
                        <div className="flex gap-1.5">
                          {colorPresets.map(color => (
                            <button
                              key={color}
                              onClick={() => setBrandColor(color)}
                              className={`w-6 h-6 rounded-full transition-transform hover:scale-125 ${brandColor === color ? 'ring-2 ring-offset-2 ring-gray-900' : ''}`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">
                      Typography
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {fontPresets.map(font => (
                        <button
                          key={font}
                          onClick={() => setBrandFont(font)}
                          className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${brandFont === font ? 'bg-gray-900 text-white border-gray-900 shadow-lg' : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100'}`}
                          style={{ fontFamily: font }}
                        >
                          {font}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 p-5 bg-gray-50 rounded-3xl border border-gray-100">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">
                        Announcement Bar
                      </label>
                      <button
                        onClick={() => setShowAnnouncement(!showAnnouncement)}
                        className={`w-12 h-6 rounded-full p-1 transition-colors ${showAnnouncement ? '' : 'bg-gray-200'}`}
                        style={{ backgroundColor: showAnnouncement ? brandColor : undefined }}
                      >
                        <motion.div
                          animate={{ x: showAnnouncement ? 24 : 0 }}
                          className="w-4 h-4 bg-white rounded-full shadow-sm"
                        />
                      </button>
                    </div>
                    {showAnnouncement && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-2 overflow-hidden"
                      >
                        <input
                          type="text"
                          value={announcement}
                          onChange={(e) => setAnnouncement(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-900 focus:ring-4 transition-all outline-none"
                          style={{ focusRingColor: `${brandColor}10` } as any}
                          placeholder="e.g. ✨ Free shipping on all orders over $100!"
                        />
                      </motion.div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1 flex items-center gap-2">
                      <InstagramIcon size={12} className="text-gray-400" />
                      Instagram Profile
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold text-gray-900 focus:bg-white focus:ring-4 transition-all placeholder:text-gray-300 pl-14 outline-none"
                        style={{ focusRingColor: `${brandColor}10` } as any}
                        placeholder="username or URL"
                      />
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                        @
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-50 flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isSaving}
                      onClick={handleSave}
                      className="flex items-center gap-2 px-10 py-4 text-white rounded-2xl text-sm font-black shadow-lg transition-all disabled:opacity-70"
                      style={{ backgroundColor: brandColor, shadowColor: `${brandColor}30` } as any}
                    >
                      {isSaving && (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      )}
                      {isSaving ? "Saving..." : "Save Changes"}
                    </motion.button>
                  </div>
                </div>
              </section>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <section className="bg-gray-900 rounded-xl p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-32 -mt-32" style={{ backgroundColor: `${brandColor}30` }} />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <h4 className="text-sm font-black uppercase tracking-widest" style={{ color: brandColor }}>Live Preview</h4>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
                        <Monitor size={14} />
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
                        <Smartphone size={14} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl overflow-hidden shadow-2xl scale-[0.95] origin-top border border-white/10">
                    {showAnnouncement && (
                      <div className="py-1 px-4 text-center text-white text-[6px] font-black" style={{ backgroundColor: brandColor }}>
                        {announcement || "✨ Free shipping on all orders over $100!"}
                      </div>
                    )}
                    <div className="bg-gray-50 px-4 py-2 flex items-center gap-2 border-b border-gray-100">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-400" />
                        <div className="w-2 h-2 rounded-full bg-amber-400" />
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                      </div>
                      <div className="flex-1 bg-white rounded-md py-1 px-3 text-[8px] text-gray-400 font-medium truncate">
                        {subdomain || "yourshop"}.krifth.com
                      </div>
                    </div>
                    <div className="aspect-video bg-white p-6 flex flex-col items-center justify-center text-center" style={{ fontFamily: brandFont }}>
                      <div className="w-16 h-16 bg-gray-50 rounded-2xl mb-4 flex items-center justify-center text-gray-300">
                        {logo ? <img src={logo} alt="Logo" className="w-full h-full object-contain p-2" /> : <Sparkles size={24} style={{ color: brandColor }} />}
                      </div>
                      <h5 className="text-lg font-black text-gray-900 mb-2 truncate max-w-full px-4" style={{ fontFamily: brandFont }}>{brandName || "My Shop"}</h5>
                      <div className="w-24 h-2 rounded-full" style={{ backgroundColor: `${brandColor}20` }} />
                      <div className="w-12 h-4 rounded-full mt-3" style={{ backgroundColor: brandColor }} />
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0" style={{ color: brandColor }} />
                      <div>
                        <p className="text-xs font-bold text-white">Dynamic Branding</p>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">Your logo and colors automatically adapt across all shop pages.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0" style={{ color: brandColor }} />
                      <div>
                        <p className="text-xs font-bold text-white">SEO Optimized</p>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">Brand metadata is automatically injected for search engines.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setActiveTab("URL")}>
                <div className="flex items-center gap-4 text-gray-400">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                    <Globe size={20} />
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-gray-900">Custom Domain</h5>
                    <p className="text-[10px] text-gray-400 font-bold mt-0.5 leading-relaxed">
                      Upgrade to a Pro plan to use your own domain name.
                    </p>
                  </div>
                  <ChevronRight size={16} className="ml-auto" />
                </div>
              </section>
            </div>
          </motion.div>
        )}

        {activeTab === "Slider" && (
          <motion.div
            key="slider"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl p-8 shadow-[0_1px_2px_rgba(0,0,0,0.02)] border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-1">Homepage Sliders</h3>
                  <p className="text-sm text-gray-500 font-medium">Manage the hero section of your storefront website.</p>
                </div>
                <div className="relative">
                  <button
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl text-sm font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
                  >
                    <Plus size={18} />
                    Add New Slide
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) addSlide(file);
                      }}
                    />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {sliders.map((slider) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      key={slider.id}
                      className="group flex items-center gap-4 p-4 bg-gray-50 border border-transparent hover:bg-white hover:border-gray-100 hover:shadow-sm rounded-xl transition-all"
                    >
                      <div className="w-20 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200/50">
                        {slider.image ? (
                          <img src={slider.image} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <ImageIcon size={20} strokeWidth={1} />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          value={slider.title}
                          onChange={(e) => updateSlideTitle(slider.id, e.target.value)}
                          className="bg-transparent text-sm font-black text-gray-900 w-full outline-none focus:ring-2 focus:ring-gray-900/5 rounded px-1 -ml-1 transition-all"
                        />
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Priority {slider.priority}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-300" />
                          <span className="text-[10px] font-black text-[#22C55E] uppercase tracking-tighter">Active</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                          <Layout size={14} />
                        </button>
                        <button
                          onClick={() => deleteSlide(slider.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {sliders.length === 0 && (
                  <div className="py-12 flex flex-col items-center justify-center text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-100">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-300 mb-4 shadow-sm">
                      <ImageIcon size={24} />
                    </div>
                    <p className="text-sm font-bold text-gray-500">No sliders configured</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "URL" && (
          <motion.div
            key="url"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Left Panel — always visible */}
            <section className="bg-white rounded-xl p-8 shadow-[0_1px_2px_rgba(0,0,0,0.02)] border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-1">Storefront URL</h3>
                  <p className="text-sm text-gray-500 font-medium">Access and manage your public storefront link.</p>
                </div>
                {isPro && (
                  <span className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white">
                    Pro
                  </span>
                )}
              </div>

              <div className="space-y-6">
                {/* Live URL Display */}
                <div className="flex items-center gap-3 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${brandColor}15` }}>
                    <Globe size={16} style={{ color: brandColor }} />
                  </div>
                  <p className="text-sm font-bold text-gray-700 flex-1 truncate">
                    {isPro
                      ? <span className="font-black text-gray-900">{customDomain || "example.com"}</span>
                      : <>krifth.com/<span className="font-black text-gray-900">{subdomain || "yourshop"}</span></>
                    }
                  </p>
                  <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-full flex-shrink-0" style={{ backgroundColor: `${brandColor}10`, color: brandColor }}>
                    {dnsStatus === "connected" ? "Connected" : "Live"}
                  </span>
                  <a
                    href={`https://${isPro ? (customDomain || 'example.com') : `krifth.com/${subdomain || 'yourshop'}`}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 shadow-sm transition-all flex-shrink-0"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>

                <AnimatePresence mode="wait">
                  {!isPro ? (
                    /* FREE — Subdomain editor */
                    <motion.div key="free-input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1 block">
                        URL
                      </label>
                      <div className="flex items-center bg-gray-50 rounded-2xl border border-transparent focus-within:bg-white focus-within:border-gray-200 focus-within:shadow-sm transition-all overflow-hidden">
                        <span className="pl-6 text-sm font-bold text-gray-400 whitespace-nowrap">krifth.com/</span>
                        <input
                          type="text"
                          value={subdomain}
                          onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                          className="flex-1 px-3 py-4 bg-transparent text-sm font-bold text-gray-900 outline-none placeholder:text-gray-300"
                          placeholder="yourshop"
                        />
                      </div>
                      <AnimatePresence>
                        {subdomainStatus === "available" && (
                          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 px-4 py-2.5 bg-green-50 rounded-xl border border-green-100">
                            <CheckCircle2 size={14} className="text-green-500" />
                            <span className="text-xs font-bold text-green-600">Subdomain is available — looks great!</span>
                          </motion.div>
                        )}
                        {subdomainStatus === "taken" && (
                          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 px-4 py-2.5 bg-red-50 rounded-xl border border-red-100">
                            <span className="text-xs font-bold text-red-500">⚠ This subdomain is already taken. Try another one.</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={checkAvailability}
                          disabled={subdomainStatus === "checking" || !subdomain}
                          className="flex-1 py-4 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2 border-2 disabled:opacity-40"
                          style={{ borderColor: `${brandColor}30`, color: brandColor }}
                        >
                          {subdomainStatus === "checking" ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <CheckCircle2 size={16} />
                          )}
                          {subdomainStatus === "checking" ? "Checking..." : "Check Availability"}
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={isSaving || subdomainStatus === "checking"}
                          className="flex-1 py-4 text-white rounded-2xl text-sm font-black shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                          style={{ backgroundColor: brandColor }}
                        >
                          {isSaving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                          {isSaving ? "Saving..." : "Update URL"}
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    /* PRO — Custom domain manager */
                    <motion.div key="pro-input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1 block">
                        Domain
                      </label>
                      <div className="flex items-center bg-gray-50 rounded-2xl border border-transparent focus-within:bg-white focus-within:border-gray-200 focus-within:shadow-sm transition-all overflow-hidden">
                        <input
                          type="text"
                          value={customDomain}
                          onChange={(e) => { setCustomDomain(e.target.value.toLowerCase()); setDnsStatus("idle"); }}
                          className="flex-1 px-6 py-4 bg-transparent text-sm font-bold text-gray-900 outline-none placeholder:text-gray-300"
                          placeholder="example.com"
                        />
                      </div>

                      {/* DNS Status */}
                      <AnimatePresence>
                        {dnsStatus === "connected" && (
                          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-3 px-4 py-3 bg-green-50 rounded-xl border border-green-100">
                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                              <CheckCircle2 size={14} className="text-white" />
                            </div>
                            <div>
                              <p className="text-xs font-black text-green-700">Domain Connected</p>
                              <p className="text-[10px] text-green-600 font-medium">SSL certificate active • Propagation complete</p>
                            </div>
                          </motion.div>
                        )}
                        {dnsStatus === "error" && (
                          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="px-4 py-3 bg-amber-50 rounded-xl border border-amber-100">
                            <p className="text-xs font-black text-amber-700">⚠ DNS records not found</p>
                            <p className="text-[10px] text-amber-600 font-medium mt-0.5">Add the records below to your DNS provider, then verify again.</p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex gap-3">
                        <button
                          onClick={verifyDomain}
                          disabled={dnsStatus === "verifying" || !customDomain}
                          className="flex-1 py-4 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2 border-2 disabled:opacity-40"
                          style={{ borderColor: `${brandColor}30`, color: brandColor }}
                        >
                          {dnsStatus === "verifying" ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Globe size={16} />
                          )}
                          {dnsStatus === "verifying" ? "Verifying..." : "Verify Domain"}
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={isSaving || dnsStatus !== "connected"}
                          className="flex-1 py-4 text-white rounded-2xl text-sm font-black shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                          style={{ backgroundColor: brandColor }}
                        >
                          {isSaving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                          {isSaving ? "Saving..." : "Save Domain"}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            {/* Right Panel — switches between Upgrade pitch and DNS guide */}
            <AnimatePresence mode="wait">
              {!isPro ? (
                <motion.section
                  key="upgrade-card"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[32px] p-8 text-white relative overflow-hidden"
                >
                  <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mb-6">
                      <Globe size={28} className="text-indigo-200" />
                    </div>
                    <h3 className="text-2xl font-black mb-2">Custom Domains</h3>
                    <p className="text-indigo-100 font-medium text-sm leading-relaxed mb-8">
                      Stand out from the crowd with your own custom domain name (e.g. www.yourshop.com).
                    </p>
                    <ul className="space-y-4 mb-8">
                      {["Free SSL Certificate", "Professional Email Aliases", "Enhanced Brand Authority", "No KRIFTH Branding"].map((item) => (
                        <li key={item} className="flex items-center gap-3 text-sm font-bold text-indigo-50">
                          <CheckCircle2 size={18} className="text-indigo-300" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={handleUpgrade}
                      className="w-full py-4 bg-white text-indigo-600 rounded-2xl text-sm font-black shadow-xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                    >
                      Upgrade to Pro
                      <Sparkles size={16} />
                    </button>
                  </div>
                </motion.section>
              ) : (
                <motion.section
                  key="dns-guide"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-gray-900 rounded-[32px] p-8 text-white relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl -mr-24 -mt-24" style={{ backgroundColor: `${brandColor}20` }} />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-widest" style={{ color: brandColor }}>DNS Configuration</h4>
                        <p className="text-white/60 text-xs font-medium mt-1">Add these records to your DNS provider</p>
                      </div>
                      <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-[10px] font-black uppercase tracking-wider">
                        Pro
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      {[
                        { type: "CNAME", name: "www", value: "shops.krifth.com" },
                        { type: "A", name: "@", value: "76.76.19.19" },
                      ].map((record) => (
                        <div key={record.type} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded bg-white/10" style={{ color: brandColor }}>{record.type}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-[11px]">
                            <div>
                              <p className="text-white/40 font-bold uppercase tracking-wider mb-1">Name</p>
                              <p className="font-black text-white font-mono">{record.name}</p>
                            </div>
                            <div>
                              <p className="text-white/40 font-bold uppercase tracking-wider mb-1">Value</p>
                              <p className="font-black text-white font-mono truncate">{record.value}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                      <Sparkles size={16} style={{ color: brandColor }} className="flex-shrink-0 mt-0.5" />
                      <p className="text-[11px] text-white/60 font-medium leading-relaxed">
                        DNS changes can take up to <span className="text-white font-bold">48 hours</span> to propagate globally. Click <span className="text-white font-bold">Verify Domain</span> after adding your records.
                      </p>
                    </div>

                    <button
                      onClick={() => { setIsPro(false); setDnsStatus("idle"); setCustomDomain(""); }}
                      className="mt-6 text-[11px] font-bold text-white/40 hover:text-white/70 transition-colors flex items-center gap-1"
                    >
                      ← Switch back to free subdomain
                    </button>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



