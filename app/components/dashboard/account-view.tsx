"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Lock,
  ShieldCheck,
  History,
  Camera,
  CheckCircle2,
  CreditCard,
  Shield,
  Zap,
  Crown,
  Phone,
  ArrowRight,
  ShieldAlert,
  Loader2,
  Check
} from "lucide-react";

type Plan = "basic" | "standard" | "premium";
type PayMethod = "card" | "momo";

const PLANS: { id: Plan; label: string; price: string; monthly: string; color: string; icon: any; features: string[] }[] = [
  { id: "basic", label: "Starter", price: "$1", monthly: "1.00", color: "#6b7280", icon: Shield, features: ["Custom URL", "Basic Theme", "Unlimited Inventory"] },
  { id: "standard", label: "Growth", price: "$10", monthly: "10.00", color: "#22C55E", icon: Zap, features: ["Domain + SSL", "Unlimited Themes", "Unlimited Inventory", "SEO Optimization"] },
  { id: "premium", label: "Scale", price: "$15", monthly: "15.00", color: "#a855f7", icon: Crown, features: ["Domain + SSL", "Unlimited Themes", "Unlimited AI Agents", "Priority Support"] },
];

export function AccountView() {
  const [activeTab, setActiveTab] = useState("Profile Information");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Payment upgrade state
  const currentPlan: Plan = "basic"; // replace with real value from context/API
  const [selectedPlan, setSelectedPlan] = useState<Plan>("standard");
  const [payMethod, setPayMethod] = useState<PayMethod>("card");
  const [momoNetwork, setMomoNetwork] = useState("MTN");
  const [momoNumber, setMomoNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handlePay = async () => {
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsProcessing(false);
    setIsDone(true);
  };

  return (
    <div className="flex-1 px-4 sm:px-8 pt-4 sm:pt-6 pb-6 animate-in fade-in duration-500 relative">
      {/* Tabs */}
      <div className="flex items-center gap-5 sm:gap-8 border-b border-gray-200 mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide pb-px -mx-4 px-4 sm:mx-0 sm:px-0 pr-4">
        {["Profile Information", "Billing and Subscriptions"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-semibold transition-all relative ${activeTab === tab ? "text-[#22C55E]" : "text-gray-400 hover:text-gray-600"
              }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#22C55E]"
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "Profile Information" ? (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6"
          >
            {/* Main Content - Moves below sidebar on mobile */}
            <div className="lg:col-span-8 space-y-6 order-2 lg:order-1">
              <section className="bg-white rounded-xl p-5 sm:p-8 shadow-[0_1px_2px_rgba(0,0,0,0.02)] border border-gray-50">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Profile Details</h3>
                  <p className="text-sm text-gray-500 font-medium">
                    Update your shop's primary contact information and branding identity.
                  </p>
                </div>

                <form className="space-y-5 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">
                        Username
                      </label>
                      <input
                        type="text"
                        placeholder="degali"
                        autoComplete="off"
                        className="w-full px-5 py-3 bg-white border border-gray-100 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#22C55E] transition-all shadow-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">
                        Brand Name
                      </label>
                      <input
                        type="text"
                        placeholder="kRiTH Test Shop"
                        autoComplete="off"
                        className="w-full px-5 py-3 bg-white border border-gray-100 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#22C55E] transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        placeholder="0543772852"
                        autoComplete="off"
                        className="w-full px-5 py-3 bg-white border border-gray-100 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#22C55E] transition-all shadow-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="cephyosms@gmail.com"
                        autoComplete="off"
                        className="w-full px-5 py-3 bg-white border border-gray-100 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#22C55E] transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="pt-8 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <button
                      type="button"
                      onClick={() => setIsPasswordModalOpen(true)}
                      className="flex items-center justify-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors px-2 w-full sm:w-auto"
                    >
                      <Lock size={16} />
                      Update Password
                    </button>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <button
                        type="button"
                        className="flex-1 sm:flex-none px-6 sm:px-8 py-3.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 sm:flex-none px-6 sm:px-8 py-3.5 bg-[#22C55E] text-white rounded-xl text-sm font-bold shadow-lg shadow-green-200 hover:bg-[#16A34A] transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </form>
              </section>
            </div>

            {/* Sidebar - Appears at the top on mobile */}
            <aside className="lg:col-span-4 space-y-6 sm:space-y-8 order-1 lg:order-2">
              {/* User Profile Card */}
              <section className="bg-white rounded-xl p-5 sm:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gray-50 flex items-center justify-center shadow-inner ring-4 ring-gray-50 text-gray-300">
                    <User size={40} className="sm:w-12 sm:h-12" />
                  </div>
                  <button className="absolute -right-2 -bottom-2 w-8 h-8 sm:w-9 sm:h-9 bg-white border border-gray-100 rounded-xl shadow-lg flex items-center justify-center text-gray-500 hover:text-[#22C55E] transition-colors">
                    <Camera size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                </div>

                <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-0.5 sm:mb-1">Alex Rivera</h4>
                <p className="text-[10px] sm:text-xs text-gray-400 font-semibold mb-4">Administrator</p>

                <span className="px-3 py-1 bg-green-50 text-[#22C55E] rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                  Active Account
                </span>
              </section>

              {/* Security Status Card */}
              <section className="bg-white rounded-xl p-5 sm:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] border border-gray-50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                    <ShieldCheck size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-gray-900">Security Status</h4>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="mt-1">
                      <CheckCircle2 size={16} className="text-[#22C55E]" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-gray-900">Two-Factor Authentication</h5>
                      <p className="text-[10px] text-gray-400 font-semibold mt-1">Enabled via Email Verification</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="mt-1">
                      <History size={16} className="text-gray-400" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-gray-900">Last Login</h5>
                      <p className="text-[10px] text-gray-400 font-semibold mt-1 leading-relaxed">
                        Today at 09:42 AM from Mac OS
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </aside>
          </motion.div>
        ) : (
          <motion.div
            key="payment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Current Plan Banner */}
            {(() => {
              const cp = PLANS.find(p => p.id === currentPlan)!;
              const CpIcon = cp.icon;
              return (
                <div className="p-5 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-4 overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: cp.color }} />
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm" style={{ backgroundColor: `${cp.color}10` }}>
                      <CpIcon size={22} style={{ color: cp.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">Your Subscription</p>
                        <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-green-50 text-green-600 border border-green-100">Active</span>
                      </div>
                      <p className="text-base font-black text-gray-900">{cp.label} Plan <span className="text-gray-300 font-medium">/</span> ${cp.monthly}<span className="text-xs text-gray-400 font-bold">.00</span></p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <p className="text-[11px] font-bold text-gray-400">
                      Next billing date: <span className="text-gray-900 font-black">June 6, 2026</span>
                    </p>
                    <button className="text-[11px] font-black text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1.5 px-3 py-1.5 hover:bg-red-50 rounded-lg">
                      Cancel Plan
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* Plan Cards */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 ml-1">Upgrade your experience</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {PLANS.map(plan => {
                  const PIcon = plan.icon;
                  const isCurrent = plan.id === currentPlan;
                  const isSelected = plan.id === selectedPlan;
                  const isRecommended = plan.id === "standard";

                  return (
                    <button
                      key={plan.id}
                      onClick={() => !isCurrent && setSelectedPlan(plan.id)}
                      disabled={isCurrent}
                      className={`relative flex flex-col p-6 rounded-xl border-2 text-left transition-all duration-300 group ${isSelected && !isCurrent
                        ? "shadow-xl scale-[1.02] z-10"
                        : isCurrent
                          ? "border-gray-100 bg-gray-50/50 cursor-default"
                          : "border-gray-100 hover:border-gray-200 bg-white hover:shadow-md"
                        }`}
                      style={isSelected && !isCurrent ? { borderColor: plan.color, backgroundColor: "white" } : {}}
                    >
                      {/* Status Badges */}
                      <div className="absolute top-4 right-4">
                        {isCurrent ? (
                          <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-gray-200 text-gray-500">Current</span>
                        ) : isRecommended ? (
                          <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#22C55E] text-white shadow-lg shadow-green-100">Recommended</span>
                        ) : null}
                      </div>

                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-500 group-hover:rotate-6 ${isSelected ? "" : "bg-gray-50"}`}
                        style={isSelected ? { backgroundColor: `${plan.color}15` } : {}}>
                        <PIcon size={24} style={{ color: plan.color }} />
                      </div>

                      <p className="text-[11px] font-black uppercase tracking-wider mb-1" style={{ color: plan.color }}>{plan.label}</p>
                      <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-3xl font-black text-gray-900 tracking-tight">{plan.price}</span>
                        <span className="text-xs font-bold text-gray-400">/mo</span>
                      </div>

                      <div className="space-y-3 mt-auto">
                        <div className="h-px bg-gray-100 w-full" />
                        <ul className="space-y-2">
                          {plan.features.map(f => (
                            <li key={f} className="flex items-center gap-2 text-[11px] font-bold text-gray-600">
                              <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${plan.color}10` }}>
                                <Check size={10} strokeWidth={4} style={{ color: plan.color }} />
                              </div>
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {isSelected && !isCurrent && (
                        <motion.div
                          layoutId="planHighlight"
                          className="absolute inset-0 rounded-[28px] border-4 pointer-events-none"
                          style={{ borderColor: `${plan.color}20` }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment Method Section */}
            <AnimatePresence mode="wait">
              {isDone ? (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 gap-6 bg-white rounded-[32px] border border-gray-100 shadow-xl">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-xl shadow-green-100">
                    <Check size={40} className="text-white" strokeWidth={4} />
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-black text-gray-900">Success!</h3>
                    <p className="text-gray-500 font-medium mt-2">Your account is now on the <span className="text-gray-900 font-black">{PLANS.find(p => p.id === selectedPlan)?.label}</span> plan.</p>
                  </div>
                  <button onClick={() => setIsDone(false)} className="px-8 py-3 bg-[#22C55E] text-white rounded-2xl text-sm font-black hover:bg-[#16A34A] transition-all shadow-lg shadow-emerald-500/20">
                    Return to Settings
                  </button>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[32px] border border-gray-100 shadow-xl overflow-hidden">
                  {/* Modern Tab Switcher */}
                  <div className="p-2 bg-gray-50/50 flex gap-1">
                    {([["card", CreditCard, "Card Payment"], ["momo", Phone, "Mobile Money"]] as const).map(([id, Icon, label]) => (
                      <button
                        key={id}
                        onClick={() => setPayMethod(id as PayMethod)}
                        className={`flex-1 relative py-3.5 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 ${payMethod === id ? "text-white" : "text-gray-400 hover:text-gray-600"
                          }`}
                      >
                        {payMethod === id && (
                          <motion.div
                            layoutId="payTab"
                            className="absolute inset-0 bg-gray-900 rounded-2xl shadow-lg"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                        <Icon size={16} className="relative z-10" />
                        <span className="relative z-10">{label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Order Summary */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Upgrading to</p>
                        <p className="text-sm font-black text-gray-900">{PLANS.find(p => p.id === selectedPlan)?.label} Plan</p>
                      </div>
                      <p className="text-xl font-black text-gray-900">{PLANS.find(p => p.id === selectedPlan)?.price}<span className="text-xs font-bold text-gray-400">/mo</span></p>
                    </div>

                    <AnimatePresence mode="wait">
                      {payMethod === "card" ? (
                        <motion.div key="stripe-card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
                          {/* Saved card from Stripe — replace these values with real data from your API */}
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Saved Card</p>
                          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border-2 border-[#635BFF]/30">
                            <div className="w-10 h-10 bg-[#635BFF]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                              <CreditCard size={18} className="text-[#635BFF]" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-black text-gray-900 tracking-widest">Visa •••• •••• •••• 4242</p>
                              <p className="text-[10px] font-bold text-gray-400 mt-0.5">Expires 12 / 27</p>
                            </div>
                            <CheckCircle2 size={18} className="text-[#635BFF] flex-shrink-0" />
                          </div>
                          <button
                            onClick={() => {/* redirect to Stripe Checkout for new card */ }}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-200 text-[11px] font-black text-gray-500 hover:border-[#635BFF]/40 hover:text-[#635BFF] transition-all"
                          >
                            <CreditCard size={13} />
                            Use a different card
                          </button>
                          <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1.5">
                            <ShieldAlert size={11} className="text-[#635BFF]" />
                            Secured by <span className="text-[#635BFF]">Stripe</span> — PCI DSS compliant
                          </p>
                        </motion.div>
                      ) : (
                        <motion.div key="momo-form" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Network</label>
                            <div className="grid grid-cols-3 gap-2">
                              {["MTN", "Telecel", "AirtelTigo"].map(net => (
                                <button key={net} onClick={() => setMomoNetwork(net)}
                                  className={`py-2.5 rounded-xl text-[10px] font-black border transition-all ${momoNetwork === net ? "bg-[#22C55E]/10 border-[#22C55E] text-[#22C55E]" : "bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100"}`}>
                                  {net}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phone Number</label>
                            <div className="relative">
                              <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input type="tel" value={momoNumber} onChange={e => setMomoNumber(e.target.value.replace(/\D/g, ""))} placeholder="024 000 0000"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl text-sm font-bold text-gray-900 outline-none border border-transparent focus:bg-white focus:border-[#22C55E]/30 transition-all placeholder:text-gray-300" />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button onClick={handlePay} disabled={isProcessing || selectedPlan === currentPlan}
                      className={`w-full py-4 rounded-2xl text-sm font-black flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 shadow-lg ${payMethod === "card" ? "bg-[#635BFF] text-white shadow-indigo-100" : "bg-[#22C55E] text-white shadow-green-100"
                        }`}>
                      {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                      {isProcessing ? "Processing..." : payMethod === "card" ? `Upgrade with Saved Card` : `Pay with ${momoNetwork} MoMo`}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Password Update Modal */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPasswordModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto scrollbar-hide"
            >
              <div className="mb-8">
                <h3 className="text-2xl font-black text-gray-900 mb-2">Update Password</h3>
                <p className="text-sm text-gray-500 font-medium">Ensure your account is using a long, random password to stay secure.</p>
              </div>

              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsPasswordModalOpen(false); }}>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full py-3 px-5 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#22C55E]/30 focus:ring-4 focus:ring-[#22C55E]/5 transition-all text-sm font-bold text-gray-900 placeholder:text-gray-300"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full py-3 px-5 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#22C55E]/30 focus:ring-4 focus:ring-[#22C55E]/5 transition-all text-sm font-bold text-gray-900 placeholder:text-gray-300"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full py-3 px-5 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#22C55E]/30 focus:ring-4 focus:ring-[#22C55E]/5 transition-all text-sm font-bold text-gray-900 placeholder:text-gray-300"
                  />
                </div>

                <div className="pt-6 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-gray-50 mt-8">
                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="w-full sm:w-auto px-6 py-3 sm:py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors order-2 sm:order-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 sm:py-2.5 bg-[#22C55E] text-white rounded-xl text-sm font-bold shadow-lg shadow-green-100 hover:bg-[#16A34A] transition-all order-1 sm:order-2"
                  >
                    Update Password
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
