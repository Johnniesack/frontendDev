"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Rocket, Fingerprint, Share2, Shield } from "lucide-react";

const features = [
  {
    icon: Zap,
    text: "AI agents that handle operations while you create",
  },
  {
    icon: Rocket,
    text: "Launch your online shop in minutes",
  },
];

const verifyFeatures = [
  {
    icon: Fingerprint,
    label: "IDENTITY",
    value: "Verified Layer",
    color: "#22C55E",
  },
  {
    icon: Share2,
    label: "NETWORK",
    value: "Neural Encrypted",
    color: "#A855F7",
  },
];

const RotatingWords = ({ words, colorClass = "text-[#22C55E]" }: { words: string[], colorClass?: string }) => {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 5000); // Slower, more natural interval
    return () => clearInterval(timer);
  }, [words.length]);

  return (
    <div className="h-[1.15em] overflow-hidden inline-block relative align-top min-w-[260px] xs:min-w-[280px] sm:min-w-[340px] lg:min-w-[280px] xl:min-w-[320px]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={index}
          initial={{ y: "20%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-20%", opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className={`absolute inset-x-0 top-0 ${colorClass} drop-shadow-[0_0_20px_rgba(34,197,94,0.35)] whitespace-nowrap`}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export function MarketingSide({ mode = "signin" }: { mode?: "signin" | "signup" | "verify" }) {
  return (
    <div className="relative flex flex-col justify-center flex-1 px-6 sm:px-12 lg:px-20 pt-20 pb-16 lg:py-20 lg:pb-64 overflow-hidden min-h-full">
      <div className="relative z-10 flex flex-col gap-8 lg:gap-12 max-w-lg min-h-[500px] justify-center">
        <div className="flex flex-col gap-8 lg:gap-12">
            {mode === "verify" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 mb-2"
              >
                <div className="w-8 h-8 rounded-lg bg-[#22C55E] flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                  <Shield className="text-black" size={18} fill="currentColor" />
                </div>
                <span className="font-syne text-xl font-bold tracking-tight text-white uppercase">Krifth</span>
              </motion.div>
            )}

            <div className="flex flex-col gap-6 sm:gap-8">
              {mode === "signin" ? (
                <h1 className="text-5xl sm:text-6xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.2] tracking-tight">
                  The Future of <br />
                  <RotatingWords words={["Creative", "Automated", "Intelligent"]} /> <br />
                  Commerce
                </h1>
              ) : mode === "signup" ? (
                <div className="flex flex-col gap-4">
                  <p className="text-[10px] font-bold text-[#22C55E] uppercase tracking-[0.3em]">
                    Krifth Intelligence
                  </p>
                  <h1 className="text-[38px] xs:text-[44px] sm:text-[68px] font-bold text-white leading-[1.2] tracking-tight">
                    Build <RotatingWords words={["Faster.", "Better.", "Smarter.", "Stronger."]} /> <br />
                    Grow <RotatingWords words={["Smarter.", "Bolder.", "Wider.", "Beyond."]} />
                  </h1>
                  <h2 className="text-xl sm:text-2xl font-bold text-zinc-300 tracking-tight">
                    Connecting Your Hustle With AI
                  </h2>
                </div>
              ) : (
                <h1 className="text-5xl sm:text-6xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.1] tracking-[ -0.02em]">
                  Secure Your <br />
                  <span className="bg-gradient-to-r from-[#22C55E] via-[#A855F7] to-[#3B82F6] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(168,85,247,0.2)]">Core</span>
                </h1>
              )}

              <p className="text-base sm:text-lg lg:text-base text-zinc-500 font-medium tracking-tight leading-relaxed max-w-sm sm:max-w-md">
                {mode === "signin"
                  ? "Build and automate your online store with AI"
                  : mode === "signup"
                    ? "Create your account and let AI agents help you launch and run your online shop effortlessly."
                    : "Advanced biometric and neural-link verification protocols protecting your synthetic intelligence assets."}
              </p>
            </div>

            {mode === "signin" ? (
              <ul className="flex flex-col gap-5 sm:gap-7">
                {features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-5 text-zinc-500"
                  >
                    <div className="flex-shrink-0 text-[#22C55E]/60">
                      <feature.icon size={20} strokeWidth={3} />
                    </div>
                    <span className="text-lg sm:text-xl lg:text-base font-medium">{feature.text}</span>
                  </li>
                ))}
              </ul>
            ) : mode === "signup" ? (
              <div className="flex gap-4 mt-4">
                <div className="flex-1 p-5 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap size={14} className="text-[#22C55E]" />
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Lightning Fast AI</span>
                  </div>
                  <p className="text-xl font-bold text-white">0.4ms Response</p>
                </div>
                <div className="flex-1 p-5 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
                  <div className="flex items-center gap-2 mb-3">
                    <Share2 size={14} className="text-[#22C55E]" />
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Seamless Sync</span>
                  </div>
                  <p className="text-xl font-bold text-white">Real-time Connection</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                {verifyFeatures.map((item, i) => (
                  <div
                    key={i}
                    className="flex-1 p-[18px] rounded-xl bg-white/[0.03] border border-white/5 backdrop-blur-md relative overflow-hidden group"
                  >
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    <div
                      className="w-7 h-7 rounded-md flex items-center justify-center mb-5"
                      style={{ backgroundColor: `${item.color}15`, border: `1px solid ${item.color}30` }}
                    >
                      <item.icon size={14} style={{ color: item.color }} />
                    </div>
                    <div className="space-y-0.5 relative z-10">
                      <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{item.label}</p>
                      <p className="text-[15px] font-bold text-white tracking-tight">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>

    </div>
  );
}
