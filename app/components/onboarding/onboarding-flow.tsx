"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  Sparkles,
  ChevronRight,
  Check,
  Shield,
  Zap,
  Crown,
  ArrowLeft,
  Store,
  Package,
  Target,
  Globe,
  Plus,
  Loader2,
  CreditCard,
  Lock,
  CalendarDays,
  User,
  Phone
} from "lucide-react";
import { saveOnboardingStep, completeOnboarding } from "@/lib/api/onboarding";

const InstagramIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
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

type Plan = "basic" | "standard" | "premium";

interface OnboardingProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<Plan>("standard");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState({
    brandName: "",
    productTypes: [] as string[],
    otherProductType: "",
    goals: [] as string[],
    instagramStatus: "",
    instagramHandle: ""
  });
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "momo">("stripe");
  const [momoDetails, setMomoDetails] = useState({
    number: "",
    network: "MTN"
  });
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});

  const planDetails = {
    basic: { label: "Starter", price: "$1", color: "#ffffff", shadow: "rgba(255,255,255,0.08)" },
    standard: { label: "Growth", price: "$10", color: "#22C55E", shadow: "rgba(34,197,94,0.15)" },
    premium: { label: "Scale", price: "$15", color: "#a855f7", shadow: "rgba(168,85,247,0.15)" },
  };


  const validatePayment = () => {
    const errs: Record<string, string> = {};
    if (paymentMethod === "momo") {
      if (!momoDetails.number.trim()) errs.number = "Required";
      if (momoDetails.number.length < 10) errs.number = "Invalid number";
    }
    setPaymentErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = async () => {
    setError(null);
    setIsLoading(true);

    try {
      if (step === 1) {
        await saveOnboardingStep({
          step: 1,
          brand_name: values.brandName
        });
      } else if (step === 2) {
        await saveOnboardingStep({
          step: 2,
          niche: values.productTypes.join(", "),
          custom_niche: values.otherProductType || "None"
        });
      } else if (step === 3) {
        await saveOnboardingStep({
          step: 3,
          mission: values.goals.join(", ")
        });
      } else if (step === 4) {
        await saveOnboardingStep({
          step: 4,
          instagram_choice: values.instagramStatus === "Yes – connect now" ? "connect_now" : values.instagramStatus === "No, but I plan to" ? "plan_to" : "no_instagram",
          instagram_handle: values.instagramHandle || "None"
        });
      }

      if (step < 6) {
        setDirection(1);
        setStep(step + 1);
      } else {
        await completeOnboarding(selectedPlan);
        onComplete();
      }
    } catch (err: any) {
      console.error("Onboarding step error:", err);
      setError(err.message || "Failed to save progress. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const submitPayment = async () => {
    if (!validatePayment()) return;
    setError(null);
    setIsLoading(true);
    try {
      // Backend handles actual payment processing.
      // Here we just complete onboarding after UI validation passes.
      await completeOnboarding(selectedPlan);
      onComplete();
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const prevStep = () => {
    setError(null);
    if (step > 1) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const toggleSelection = (field: 'productTypes' | 'goals', item: string) => {
    setValues(prev => {
      const current = prev[field];
      const next = current.includes(item)
        ? current.filter(i => i !== item)
        : [...current, item];
      return { ...prev, [field]: next };
    });
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    })
  };

  return (
    <div className="w-full min-h-[100dvh] flex flex-col items-center justify-start bg-transparent selection:bg-[#22C55E]/30 relative">
      {/* Step Indicator - Sticky on mobile with better spacing */}
      <div className="flex flex-col items-center gap-3 pt-8 pb-6 sticky top-0 z-[60] bg-black/90 backdrop-blur-xl w-full border-b border-white/5">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-700 ease-out ${i <= step ? "w-8 bg-[#22C55E]" : "w-2 bg-white/10"
                }`}
            />
          ))}
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#22C55E]">
          Step {step} of 6
        </span>
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className={`w-full max-w-5xl xl:max-w-6xl min-h-0 flex flex-col items-center ${step === 5 ? "justify-center" : "justify-start"} px-4 sm:px-6 md:px-8 ${step === 6 ? "pb-8 sm:pb-12" : step === 5 ? "pb-10 sm:pb-12" : "pb-20 sm:pb-24"
            } ${step === 5 ? "pt-4 sm:pt-6" : step === 6 ? "pt-2" : step === 3 ? "pt-12" : "pt-16"
            }`}
        >
          {step === 1 && (
            <div className="space-y-6 max-w-lg w-full text-center">
              <div className="w-16 h-16 bg-[#22C55E]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#22C55E]/20">
                <Store className="text-[#22C55E]" size={32} />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">Your Brand Identity</h2>
                <p className="text-zinc-500 text-sm font-medium">Claim your unique URL on the Krifth network.</p>
              </div>

              <div className="space-y-6 pt-2">
                <div className="space-y-2 text-left">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-600 pl-1">Business Name</label>
                  <input
                    type="text"
                    autoFocus
                    value={values.brandName}
                    onChange={(e) => setValues({ ...values, brandName: e.target.value })}
                    placeholder="e.g. Noir Streetwear"
                    className="w-full h-16 px-6 rounded-2xl bg-white/[0.02] border border-white/10 text-xl font-bold text-white focus:outline-none focus:border-[#22C55E]/50 transition-all placeholder:text-zinc-800"
                  />
                </div>

                <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 flex items-center gap-3 text-left">
                  <Globe size={18} className="text-[#22C55E]" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">Preview URL</span>
                    <span className="text-sm font-bold text-white tracking-tight">
                      krifth.com/<span className="text-[#22C55E]">{values.brandName.toLowerCase().replace(/\s+/g, '-') || "yourbrand"}</span>
                    </span>
                  </div>
                </div>

                {error && (
                  <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest text-center animate-in fade-in slide-in-from-top-1">
                    {error}
                  </p>
                )}

                <button
                  disabled={!values.brandName || isLoading}
                  onClick={nextStep}
                  className="w-full h-14 rounded-2xl bg-[#22C55E] text-black font-black text-base flex items-center justify-center gap-2 group disabled:opacity-40 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg mt-2"
                >
                  {isLoading ? <Loader2 size={20} className="animate-spin" /> : (
                    <>
                      Continue
                      <ChevronRight size={20} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 max-w-2xl w-full text-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">Niche Selection</h2>
                <p className="text-zinc-500 text-sm font-medium">Tell our AI what category your products live in.</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  "Streetwear", "Clothing", "Footwear", "Accessories", "Fashion", "Beauty"
                ].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleSelection('productTypes', tag)}
                    className={`h-14 rounded-xl border transition-all font-black text-xs ${values.productTypes.includes(tag)
                      ? "bg-[#22C55E]/10 border-[#22C55E] text-[#22C55E]"
                      : "bg-white/[0.01] border-white/5 text-zinc-500 hover:border-white/20"
                      }`}
                  >
                    {tag}
                  </button>
                ))}
                <div className="col-span-full relative">
                  <Plus className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
                  <input
                    type="text"
                    value={values.otherProductType}
                    onChange={(e) => setValues({ ...values, otherProductType: e.target.value })}
                    placeholder="Other niche..."
                    className="w-full h-14 pl-12 pr-4 rounded-xl bg-white/[0.01] border border-white/5 text-sm font-bold text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-zinc-800"
                  />
                </div>
              </div>

              {error && (
                <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest text-center animate-in fade-in slide-in-from-top-1">
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={prevStep}
                  disabled={isLoading}
                  className="h-14 px-6 rounded-2xl border border-white/10 text-zinc-400 font-bold hover:text-white transition-all flex items-center gap-2 text-xs disabled:opacity-40"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  disabled={(values.productTypes.length === 0 && !values.otherProductType) || isLoading}
                  onClick={nextStep}
                  className="flex-1 h-14 rounded-2xl bg-[#22C55E] text-black font-black text-base flex items-center justify-center gap-2 group disabled:opacity-40 transition-all"
                >
                  {isLoading ? <Loader2 size={20} className="animate-spin" /> : (
                    <>
                      Continue
                      <ChevronRight size={20} strokeWidth={3} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 max-w-xl w-full text-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">Main Mission</h2>
                <p className="text-zinc-500 text-sm font-medium">What should your AI agents prioritize first?</p>
              </div>

              <div className="space-y-2 text-left">
                {[
                  { id: "launch", label: "Launch shop quickly", icon: Rocket },
                  { id: "insta", label: "Automate social marketing", icon: InstagramIcon },
                  { id: "inventory", label: "Track sales & inventory", icon: Package },
                  { id: "reports", label: "Receive weekly AI reports", icon: Sparkles },
                  { id: "sales", label: "Sell globally to diaspora", icon: Target }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleSelection('goals', item.id)}
                    className={`w-full p-3.5 rounded-xl border transition-all flex items-center gap-3 group ${values.goals.includes(item.id)
                      ? "bg-[#22C55E]/10 border-[#22C55E]"
                      : "bg-white/[0.01] border-white/5 hover:border-white/10"
                      }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${values.goals.includes(item.id) ? "bg-[#22C55E] text-black" : "bg-white/5 text-zinc-600"}`}>
                      <item.icon size={16} strokeWidth={2.5} />
                    </div>
                    <span className={`text-sm font-black ${values.goals.includes(item.id) ? "text-white" : "text-zinc-400"}`}>{item.label}</span>
                    {values.goals.includes(item.id) && <Check size={16} className="ml-auto text-[#22C55E]" strokeWidth={4} />}
                  </button>
                ))}
              </div>

              {error && (
                <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest text-center animate-in fade-in slide-in-from-top-1">
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  onClick={prevStep}
                  disabled={isLoading}
                  className="h-13 px-6 rounded-2xl border border-white/10 text-zinc-400 font-bold text-xs disabled:opacity-40"
                >
                  Back
                </button>
                <button
                  disabled={values.goals.length === 0 || isLoading}
                  onClick={nextStep}
                  className="flex-1 h-13 rounded-2xl bg-[#22C55E] text-black font-black text-base flex items-center justify-center gap-2 group disabled:opacity-40"
                >
                  {isLoading ? <Loader2 size={20} className="animate-spin" /> : (
                    <>
                      Continue
                      <ChevronRight size={20} strokeWidth={3} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 max-w-lg w-full text-center">
              <div className="w-16 h-16 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <InstagramIcon className="text-white" size={32} />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">Social Connect</h2>
                <p className="text-zinc-500 text-sm font-medium">Instagram automation starts here.</p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 gap-2">
                  {[
                    "Yes – connect now", "No, but I plan to", "I don't use Instagram"
                  ].map((option) => (
                    <button
                      key={option}
                      onClick={() => setValues({ ...values, instagramStatus: option })}
                      className={`p-4 rounded-xl border text-left font-black text-xs transition-all ${values.instagramStatus === option
                        ? "bg-white/10 border-white/30 text-white"
                        : "bg-white/[0.01] border-white/5 text-zinc-500 hover:border-white/10"
                        }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {values.instagramStatus === "Yes – connect now" && (
                  <div className="space-y-2 text-left animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-600 pl-1">Insta Handle</label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700 font-bold text-lg">@</span>
                      <input
                        type="text"
                        autoFocus
                        value={values.instagramHandle}
                        onChange={(e) => setValues({ ...values, instagramHandle: e.target.value })}
                        placeholder="yourhandle"
                        className="w-full h-14 pl-10 pr-6 rounded-xl bg-[#080808] border border-white/10 text-base font-bold text-white focus:outline-none focus:border-[#ee2a7b]/50 transition-all"
                      />
                    </div>
                  </div>
                )}

                {error && (
                  <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest text-center animate-in fade-in slide-in-from-top-1">
                    {error}
                  </p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={prevStep}
                    disabled={isLoading}
                    className="h-14 px-6 rounded-2xl border border-white/10 text-zinc-400 font-bold text-xs disabled:opacity-40"
                  >
                    Back
                  </button>
                  <button
                    disabled={!values.instagramStatus || isLoading}
                    onClick={nextStep}
                    className="flex-1 h-14 rounded-2xl bg-[#22C55E] text-black font-black text-base flex items-center justify-center gap-2 group disabled:opacity-40"
                  >
                    {isLoading ? <Loader2 size={20} className="animate-spin" /> : (
                      <>
                        Finish Setup
                        <ChevronRight size={20} strokeWidth={3} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-start py-1 lg:py-0 px-2">
              <div className="text-center mb-4 sm:mb-5 lg:mb-4">
                <h2 className="text-[28px] sm:text-5xl font-black text-white mb-1.5 sm:mb-2 tracking-tighter">Choose Your Plan</h2>
                <p className="text-zinc-600 text-[11px] sm:text-sm font-medium">Professional power, scaled for growth.</p>
              </div>

              <div className="flex flex-col xl:grid xl:grid-cols-3 gap-4 xl:gap-3 w-full items-stretch xl:min-h-[360px] 2xl:min-h-[420px]">
                {/* Basic Plan */}
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPlan("basic")}
                  className={`flex flex-col p-5 xl:p-6 rounded-[32px] border transition-all cursor-pointer relative overflow-hidden ${selectedPlan === "basic"
                    ? "bg-[#0A0A0A] border-white/40 ring-2 ring-white/10 shadow-[0_0_40px_rgba(255,255,255,0.05)]"
                    : "bg-white/[0.01] border-white/5 opacity-30 hover:opacity-60"
                    }`}
                >
                  {selectedPlan === "basic" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute top-4 right-4 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full flex items-center justify-center z-20"
                    >
                      <Check size={12} className="text-black" strokeWidth={5} />
                    </motion.div>
                  )}
                  <div className="mb-3 sm:mb-4">
                    <Shield size={18} className="text-zinc-500 mb-1.5 sm:mb-2" />
                    <h3 className="text-zinc-500 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] mb-0.5 sm:mb-1">Starter</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-black text-white">$1</span>
                    </div>
                  </div>

                  <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 flex-1">
                    {["Custom URL", "Basic Theme", "Unlimited Inventory"].map((f) => (
                      <li key={f} className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold text-zinc-500">
                        <Check size={12} className="text-[#22C55E]" strokeWidth={3} /> {f}
                      </li>
                    ))}
                  </ul>

                  <div className={`mt-auto h-11 sm:h-12 rounded-xl flex items-center justify-center text-[10px] sm:text-xs font-black border transition-all ${selectedPlan === "basic" ? "bg-white text-black border-white" : "bg-transparent border-white/10 text-white"
                    }`}>
                    {selectedPlan === "basic" ? "PLAN SELECTED" : "SELECT BASIC"}
                  </div>
                </motion.div>

                {/* Standard Plan */}
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPlan("standard")}
                  className={`flex flex-col p-5 sm:p-6 xl:p-8 rounded-[28px] sm:rounded-[36px] border-2 transition-all cursor-pointer relative z-10 ${selectedPlan === "standard"
                    ? "bg-[#111] border-[#22C55E] xl:scale-100 2xl:scale-105 shadow-[0_20px_60px_rgba(34,197,94,0.15)] ring-4 ring-[#22C55E]/5"
                    : "bg-white/[0.01] border-[#22C55E]/10 opacity-40 hover:opacity-80 xl:translate-y-0 2xl:translate-y-2 xl:scale-100 2xl:scale-95"
                    }`}
                >
                  <div className="absolute top-5 right-5 sm:top-6 sm:right-6 flex items-center gap-2">
                    {selectedPlan === "standard" ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-7 h-7 sm:w-8 sm:h-8 bg-[#22C55E] rounded-full flex items-center justify-center shadow-lg">
                        <Check size={16} className="text-black" strokeWidth={5} />
                      </motion.div>
                    ) : (
                      <div className="px-2 py-0.5 sm:py-1 bg-[#22C55E] text-black text-[7px] sm:text-[8px] font-black uppercase tracking-widest rounded-lg">
                        Most Popular
                      </div>
                    )}
                  </div>

                  <div className="mb-4 sm:mb-6">
                    <Zap size={22} className={`mb-2 sm:mb-3 transition-colors ${selectedPlan === "standard" ? "text-[#22C55E]" : "text-zinc-600"}`} />
                    <h3 className="text-[#22C55E] font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] mb-0.5 sm:mb-1">Growth</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-black text-white">$10</span>
                      <span className="text-zinc-600 text-xs font-bold">/mo</span>
                    </div>
                  </div>

                  <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-1">
                    {["Domain Name", "SSL Certificate", "Unlimited Themes", "Unlimited Inventory", "SEO Optimization"].map((f) => (
                      <li key={f} className="flex items-center gap-3 text-[11px] sm:text-xs font-bold text-zinc-300">
                        <Check size={14} className="text-[#22C55E]" strokeWidth={4} /> {f}
                      </li>
                    ))}
                  </ul>

                  <div className={`mt-auto h-12 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-[12px] sm:text-sm font-black transition-all ${selectedPlan === "standard" ? "bg-[#22C55E] text-black shadow-xl" : "bg-transparent border-2 border-[#22C55E]/20 text-[#22C55E]"
                    }`}>
                    {selectedPlan === "standard" ? "PLAN SELECTED" : "SELECT STANDARD"}
                  </div>
                </motion.div>

                {/* Premium Plan */}
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPlan("premium")}
                  className={`flex flex-col p-5 sm:p-5 xl:p-6 rounded-[24px] sm:rounded-[32px] border transition-all cursor-pointer relative overflow-hidden ${selectedPlan === "premium"
                    ? "bg-[#0A0A0A] border-purple-500 ring-2 ring-purple-500/10 shadow-[0_0_40px_rgba(168,85,247,0.1)]"
                    : "bg-white/[0.01] border-white/5 opacity-30 hover:opacity-60"
                    }`}
                >
                  {selectedPlan === "premium" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute top-4 right-4 w-5 h-5 sm:w-6 sm:h-6 bg-purple-500 rounded-full flex items-center justify-center z-20"
                    >
                      <Check size={12} className="text-white" strokeWidth={5} />
                    </motion.div>
                  )}
                  <div className="mb-3 sm:mb-4">
                    <Crown size={18} className="text-purple-500 mb-1.5 sm:mb-2" />
                    <h3 className="text-purple-500 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] mb-0.5 sm:mb-1">Scale</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-black text-white">$15</span>
                    </div>
                  </div>

                  <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 flex-1 overflow-y-auto scrollbar-hide">
                    {[
                      "Domain Name + SSL",
                      "Unlimited Themes",
                      "Unlimited Inventory",
                      "Unlimited AI Agents",
                      "SEO Optimization",
                      "Priority Support"
                    ].map((f) => (
                      <li key={f} className="flex items-center gap-2 text-[9px] sm:text-[10px] font-bold text-zinc-500 leading-tight">
                        <Check size={10} className="text-purple-500 shrink-0" strokeWidth={3} /> {f}
                      </li>
                    ))}
                  </ul>

                  <div className={`mt-auto h-11 sm:h-12 rounded-xl flex items-center justify-center text-[10px] sm:text-xs font-black border transition-all ${selectedPlan === "premium" ? "bg-purple-600 text-white border-purple-600 shadow-lg" : "bg-transparent border-white/10 text-white"
                    }`}>
                    {selectedPlan === "premium" ? "PLAN SELECTED" : "SELECT PREMIUM"}
                  </div>
                </motion.div>
              </div>

              {error && (
                <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest text-center mb-4 animate-in fade-in slide-in-from-top-1">
                  {error}
                </p>
              )}

              <div className="mt-6 w-full max-w-[460px] flex items-center gap-3">
                <button
                  onClick={prevStep}
                  disabled={isLoading}
                  className="h-14 w-14 shrink-0 rounded-2xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center disabled:opacity-20"
                  aria-label="Go back"
                >
                  <ArrowLeft size={20} />
                </button>
                <button
                  onClick={nextStep}
                  disabled={isLoading}
                  className={`flex-1 h-14 xl:h-16 rounded-[24px] font-black text-base xl:text-lg transition-all flex items-center justify-center gap-3 hover:scale-[1.03] duration-300 shadow-2xl disabled:opacity-40 ${selectedPlan === "basic"
                    ? "bg-white text-black shadow-white/10"
                    : selectedPlan === "standard"
                      ? "bg-[#22C55E] text-black shadow-[#22C55E]/20"
                      : "bg-purple-600 text-white shadow-purple-600/20"
                    }`}
                >
                  {isLoading ? <Loader2 size={24} className="animate-spin" /> : (
                    <>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={selectedPlan}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                        >
                          Continue to Payment
                        </motion.span>
                      </AnimatePresence>
                      <ChevronRight size={22} strokeWidth={3} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 6 && (() => {
            const plan = planDetails[selectedPlan];
            const planPrice = plan.price.includes(".") ? plan.price : `${plan.price}.00`;
            const accentColor = plan.color;

            return (
              <div className="w-full max-w-lg mx-auto flex flex-col gap-4 sm:gap-6 py-4 sm:py-6 px-4 mt-2 sm:mt-3">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 border shadow-2xl bg-white/5 border-white/10">
                    <CreditCard size={26} className="text-white" strokeWidth={2.5} />
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black text-white mb-1 tracking-tight">Activate {plan.label}</h2>
                  <p className="text-zinc-400 text-xs sm:text-sm font-medium">{plan.label} Plan ({planPrice}) — Choose payment method</p>
                </div>

                {/* Payment Method Selector */}
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <button
                    onClick={() => setPaymentMethod("stripe")}
                    className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === "stripe"
                      ? "bg-white/10 border-white/40 ring-2 ring-white/10"
                      : "bg-white/[0.02] border-white/5 text-zinc-500 hover:border-white/10"}`}
                  >
                    <CreditCard size={20} className={paymentMethod === "stripe" ? "text-white" : "text-zinc-600"} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Pay with Card</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("momo")}
                    className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === "momo"
                      ? "bg-[#22C55E]/10 border-[#22C55E]/40 ring-2 ring-[#22C55E]/10"
                      : "bg-white/[0.02] border-white/5 text-zinc-500 hover:border-white/10"}`}
                  >
                    <Phone size={20} className={paymentMethod === "momo" ? "text-[#22C55E]" : "text-zinc-600"} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Mobile Money</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl border flex items-center justify-between shadow-xl bg-white/[0.02] border-white/10">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] font-black text-zinc-500 mb-0.5">Total Due</p>
                    <p className="text-white font-black text-lg">{planPrice}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] uppercase tracking-[0.2em] font-black text-zinc-500 mb-0.5">Frequency</p>
                    <p className="text-zinc-300 font-bold text-sm">Monthly</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {paymentMethod === "stripe" ? (
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center space-y-3">
                      <div className="w-10 h-10 bg-[#635BFF]/10 rounded-full flex items-center justify-center mx-auto">
                        <Globe size={18} className="text-[#635BFF]" />
                      </div>
                      <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                        Secure redirect to <span className="text-white font-bold">Stripe Checkout</span>. You can pay with any major credit or debit card.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-[0.2em] font-black text-zinc-500 pl-1">Select Network</label>
                        <div className="grid grid-cols-3 gap-2">
                          {["MTN", "Telecel", "AirtelTigo"].map((net) => (
                            <button
                              key={net}
                              onClick={() => setMomoDetails({ ...momoDetails, network: net })}
                              className={`py-2 rounded-lg border text-[9px] font-black transition-all ${momoDetails.network === net
                                ? "bg-[#22C55E]/20 border-[#22C55E] text-white"
                                : "bg-white/[0.02] border-white/5 text-zinc-600 hover:border-white/10"}`}
                            >
                              {net}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-[0.2em] font-black text-zinc-500 pl-1">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                          <input
                            type="tel"
                            value={momoDetails.number}
                            onChange={e => setMomoDetails({ ...momoDetails, number: e.target.value.replace(/\D/g, "") })}
                            placeholder="024 000 0000"
                            className="w-full h-13 pl-10 pr-4 rounded-xl bg-white/[0.06] border border-white/10 text-sm font-bold text-white focus:outline-none focus:border-[#22C55E]/50 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={prevStep} className="h-14 px-6 rounded-2xl border border-white/10 text-zinc-400 font-bold text-sm hover:text-white transition-all">
                    <ArrowLeft size={18} />
                  </button>
                  <button
                    onClick={submitPayment}
                    disabled={isLoading}
                    className={`flex-1 h-14 rounded-2xl font-black text-base transition-all flex items-center justify-center gap-2 ${paymentMethod === "momo" ? "bg-[#22C55E] text-black" : "bg-[#635BFF] text-white shadow-[#635BFF]/20"
                      } shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40`}
                  >
                    {isLoading ? <Loader2 size={24} className="animate-spin" /> : (
                      <>
                        {paymentMethod === "stripe" ? "Continue to Checkout" : "Pay with MoMo"}
                        <ChevronRight size={18} strokeWidth={3} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
