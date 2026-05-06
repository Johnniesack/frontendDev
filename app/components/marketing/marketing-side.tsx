"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Rocket, Fingerprint, Share2, Shield } from "lucide-react";
import { Logo } from "../ui/logo";

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
    <div className="h-[1.15em] overflow-hidden inline-block relative align-top min-w-[260px] xs:min-w-[280px] sm:min-w-[340px] lg:min-w-[380px] xl:min-w-[480px] min-[1441px]:min-w-[520px]">
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

export function MarketingSide({ mode = "signin" }: { mode?: "signin" | "signup" | "verify" | "forgot-password" }) {
  return (
    <div
      className="relative flex flex-col justify-center flex-1 px-6 sm:px-10 lg:px-12 lg:py-12 xl:px-14 pt-20 pb-14 lg:pt-16 lg:pb-10 min-[1441px]:px-12 min-[1441px]:py-16 min-h-0"
    >
      {/* Ultra-wide: soft focal glow so the left panel feels full, not empty */}
      <div
        className="pointer-events-none absolute inset-0 hidden min-[1441px]:block opacity-90"
        aria-hidden
      >
        <div className="absolute left-1/2 top-[42%] h-[min(78vh,820px)] w-[min(92%,42rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(34,197,94,0.11),transparent_72%)] blur-2xl" />
        <div className="absolute bottom-[8%] left-1/2 h-[40%] w-[70%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(168,85,247,0.06),transparent_70%)] blur-3xl" />
      </div>
      <div className="relative z-10 flex w-full max-w-lg min-[1441px]:max-w-2xl xl:pl-4 min-[1441px]:pl-10 flex-col gap-4 lg:gap-6 min-h-[500px] lg:min-h-0 justify-center">
        {/* Top-aligned Logo - Desktop only (signin only) */}
        {mode === "signin" && (
          <div className="absolute top-0 left-0 xl:left-4 min-[1441px]:left-10 lg:block hidden -translate-y-32">
            <Logo />
          </div>
        )}

        <div className="flex w-full flex-col gap-4 lg:gap-6">
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

          <div className="flex flex-col gap-5 sm:gap-7 min-[1441px]:gap-6 shrink-0">
            {mode === "signin" ? (
              <h1 className="text-5xl sm:text-6xl lg:text-[3.25rem] lg:leading-[1.1] xl:text-[4.25rem] min-[1441px]:text-[4.75rem] font-bold text-white leading-[1.1] tracking-tight">
                The Future of <br />
                <RotatingWords words={["Creative", "Automated", "Intelligent"]} /> <br />
                Commerce
              </h1>
            ) : mode === "signup" ? (
              <div className="flex flex-col gap-4">
                <p className="text-[12px] font-bold text-[#22C55E] uppercase tracking-[0.3em]">
                  Krifth Intelligence
                </p>
                <h1 className="text-[38px] xs:text-[44px] sm:text-[52px] lg:text-[3rem] xl:text-[3.75rem] min-[1441px]:text-[4.5rem] font-bold text-white leading-[1.1] tracking-tight">
                  Build <RotatingWords words={["Faster.", "Better.", "Smarter.", "Stronger."]} /> <br />
                  Grow <RotatingWords words={["Smarter.", "Bolder.", "Wider.", "Beyond."]} />
                </h1>
                <h2 className="text-xl sm:text-2xl lg:text-2xl min-[1441px]:text-3xl font-bold text-zinc-300 tracking-tight">
                  Connecting Your Hustle With AI
                </h2>
              </div>
            ) : mode === "forgot-password" ? (
              <h1 className="text-5xl sm:text-6xl lg:text-[3.25rem] lg:leading-[1.1] xl:text-[4.25rem] min-[1441px]:text-[4.75rem] font-bold text-white leading-[1.1] tracking-tight">
                Reset & <br />
                Recover <br />
                <span className="text-[#22C55E]">Access</span>
              </h1>
            ) : (
              <h1 className="text-5xl sm:text-6xl lg:text-6xl xl:text-7xl min-[1441px]:text-[5.5rem] font-bold text-white leading-[1.1] tracking-[-0.02em]">
                Secure Your <br />
                <span className="bg-gradient-to-r from-[#22C55E] via-[#A855F7] to-[#3B82F6] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(168,85,247,0.2)]">Core</span>
              </h1>
            )}

            <p className="text-base sm:text-lg lg:text-lg xl:text-xl text-zinc-500 font-medium tracking-tight leading-relaxed max-w-sm sm:max-w-md min-[1441px]:max-w-2xl min-[1441px]:text-[1.35rem]">
              {mode === "signin"
                ? "Build and automate your online store with AI"
                : mode === "signup"
                  ? "Create your account and let AI agents help you launch and run your online shop effortlessly."
                  : mode === "forgot-password"
                    ? "Retrieve your Krifth account access and get back to managing your commerce securely."
                    : "Advanced biometric and neural-link verification protocols protecting your synthetic intelligence assets."}
            </p>
          </div>

          {mode === "signin" ? (
            <ul className="flex flex-col gap-4 sm:gap-6 min-[1441px]:gap-6 w-full max-w-md min-[1441px]:max-w-2xl shrink-0">
              {features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center gap-4 sm:gap-5 text-zinc-500"
                >
                  <div className="flex-shrink-0 text-[#22C55E]/60 min-[1441px]:scale-125">
                    <feature.icon size={22} strokeWidth={3} />
                  </div>
                  <span className="text-base sm:text-lg lg:text-[1.05rem] min-[1441px]:text-xl font-medium text-left">
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>
          ) : mode === "signup" ? null : mode === "forgot-password" ? (
            <div className="flex flex-col gap-4 mt-2 max-w-md">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#22C55E]/10 flex items-center justify-center shrink-0">
                  <Shield size={18} className="text-[#22C55E]" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Encrypted Recovery</h3>
                  <p className="text-sm text-zinc-500 font-medium">Your reset links are fully encrypted. We never expose your credentials to unauthorized sessions.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 mt-2 min-[1441px]:max-w-xl w-full">
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