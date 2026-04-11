"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, RotateCcw, HelpCircle } from "lucide-react";

export function VerifyForm({
  email = "a***n@krifth.com",
  onBack
}: {
  email?: string;
  onBack: () => void;
}) {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [activeInput, setActiveInput] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
      setActiveInput(index + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setActiveInput(index - 1);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full text-left mb-6 min-[1920px]:mb-8 relative z-10"
      >
        <h2 className="text-[32px] sm:text-[40px] font-bold text-white mb-2 min-[1920px]:mb-3 tracking-tight">
          Check your email
        </h2>
        <p className="text-[13px] sm:text-[14px] text-zinc-400 font-medium leading-relaxed max-w-sm">
          We've sent a 6-digit verification code to <span className="text-[#22C55E]">{email}</span>.
          Please enter it below to access your core identity.
        </p>
      </motion.div>

      <div className="w-full space-y-6 min-[1920px]:space-y-8 relative z-10">
        <div className="flex justify-between gap-3 sm:gap-4">
          {otp.map((digit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * index }}
              className="relative flex-1"
            >
              <input
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={() => setActiveInput(index)}
                className={`w-full aspect-[4/5] sm:h-20 rounded-lg bg-white/[0.04] border text-2xl font-bold text-white text-center transition-all focus:outline-none ${activeInput === index
                  ? "border-[#22C55E] ring-1 ring-[#22C55E]/20"
                  : "border-white/10"
                  }`}
              />
              {!digit && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="space-y-5 min-[1920px]:space-y-6">
          <motion.button
            whileHover={{ scale: 1.01, backgroundColor: "#4ADE80" }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-12 min-[1920px]:h-14 rounded-lg bg-[#22C55E] text-[#0A0A0B] font-bold text-base transition-colors flex items-center justify-center gap-2 group shadow-[0_4px_24px_rgba(34,197,94,0.2)]"
          >
            <span>Verify</span>
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </motion.button>

          <div className="text-center space-y-3 min-[1920px]:space-y-4">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.15em]">
              Haven't received the Code?
            </p>
            <button className="flex items-center gap-1.5 mx-auto text-[#22C55E] hover:text-[#4ADE80] font-bold text-sm transition-colors group">
              <span>Resend code</span>
              <RotateCcw size={14} className="group-hover:rotate-180 transition-transform duration-700" />
            </button>
          </div>
        </div>

        <div className="pt-6 min-[1920px]:pt-8 pb-8 min-[1920px]:pb-12 flex flex-col items-center gap-5 min-[1920px]:gap-6">
          <button
            onClick={onBack}
            className="text-[10px] font-bold text-[#22C55E] uppercase tracking-[0.15em] hover:text-[#4ADE80] transition-colors"
          >
            ← Back to Sign In
          </button>

          <button className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest hover:text-zinc-400 transition-colors">
            <HelpCircle size={14} className="text-zinc-700" />
            <span>Contact krifth Support</span>
          </button>
        </div>
      </div>
    </div>
  );
}
