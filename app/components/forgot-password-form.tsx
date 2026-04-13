"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Send } from "lucide-react";

export function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!email) {
      setError("Email is required");
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Simulate API request to send reset link
    setTimeout(() => {
      setIsSuccess(true);
    }, 800);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <motion.div
        whileHover={{ y: -5, transition: { duration: 0.3 } }}
        className="w-full p-0 lg:p-6 xl:p-8 min-[1920px]:p-12 rounded-none lg:rounded-[32px] bg-transparent lg:bg-[#161B22] border-0 lg:border lg:border-white/10 shadow-none lg:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6),0_0_20px_rgba(34,197,94,0.05)] relative overflow-hidden group/card"
      >
        {/* Light Green Inside Effects */}
        <div className="hidden lg:block absolute top-0 right-0 w-[300px] h-[300px] bg-[#22C55E]/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none transition-opacity group-hover/card:opacity-100 opacity-50" />
        <div className="hidden lg:block absolute bottom-0 left-0 w-[200px] h-[200px] bg-teal-500/5 rounded-full blur-[60px] -ml-20 -mb-20 pointer-events-none transition-opacity group-hover/card:opacity-100 opacity-30" />
        <div className="hidden lg:block absolute inset-0 border border-[#22C55E]/0 group-hover/card:border-[#22C55E]/20 rounded-[32px] transition-colors duration-500 pointer-events-none" />

        <div className="text-center mb-6 min-[1920px]:mb-10 relative z-10">
          <div className="w-12 h-12 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 mx-auto mb-5 flex items-center justify-center">
            <Mail className="text-[#22C55E]" size={20} />
          </div>
          <h2 className="text-2xl sm:text-[32px] font-bold text-white mb-2 tracking-tight">
            Forgot Password?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-medium px-4">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center space-y-6 relative z-10 py-4"
          >
            <div className="text-center space-y-2">
              <p className="text-sm text-zinc-300 font-medium">Reset link sent to:</p>
              <p className="text-base font-bold text-white tracking-tight">{email}</p>
            </div>

            <p className="text-[11px] text-zinc-500 max-w-xs text-center leading-relaxed">
              Didn't receive the email? Check your spam filter, or try another email address.
            </p>

            <button
              onClick={() => setIsSuccess(false)}
              className="text-[#22C55E] text-xs font-bold uppercase tracking-widest hover:underline mt-2"
            >
              Try another email
            </button>
          </motion.div>
        ) : (
          <form className="space-y-4 min-[1920px]:space-y-6 relative z-10" onSubmit={onSubmit}>
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">
                  Email Address
                </label>
                {error && (
                  <motion.span
                    initial={{ opacity: 0, x: 5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[10px] font-bold text-red-400/80 uppercase tracking-tight pt-0.5 pr-1"
                  >
                    {error}
                  </motion.span>
                )}
              </div>
              <div className="relative group">
                <Mail
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${error ? "text-red-400/40" : focusedField === "email" ? "text-[#22C55E]" : "text-zinc-500"
                    }`}
                  size={18}
                />
                <input
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="name@krifth.com"
                  className={`w-full h-11 sm:h-12 min-[1920px]:h-14 pl-12 pr-4 rounded-xl bg-[#1A2026] border transition-all font-medium text-sm sm:text-base focus:outline-none placeholder:text-zinc-600 ${error
                      ? "border-red-500/20 focus:border-red-500/40 bg-red-500/5 focus:shadow-[0_0_12px_rgba(239,68,68,0.08)]"
                      : "border-white/5 focus:border-[#22C55E]/50 hover:bg-[#1E252D] focus:shadow-[0_0_12px_rgba(34,197,94,0.15)]"
                    }`}
                />
              </div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.01, backgroundColor: "#4ADE80" }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-11 sm:h-12 min-[1920px]:h-14 mt-2 rounded-xl bg-[#22C55E] text-black font-bold text-sm sm:text-base transition-colors flex items-center justify-center gap-2 group shadow-[0_4px_20px_rgba(34,197,94,0.2)]"
            >
              <span>Reset Password</span>
              <Send size={16} className="transition-transform group-hover:translate-x-1" />
            </motion.button>
          </form>
        )}

        {/* Back to sign in */}
        <div className="mt-5 pt-4 lg:mt-6 lg:pt-5 min-[1920px]:mt-8 min-[1920px]:pt-6 lg:border-t lg:border-white/5 flex flex-col items-center justify-center w-full relative z-10">
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); onBack(); }}
            className="text-zinc-400 hover:text-white text-xs sm:text-[13px] font-bold uppercase tracking-[0.1em] flex items-center gap-2 transition-colors"
          >
            <ArrowLeft size={16} className="transition-transform -ml-2" />
            <span>Back to sign in</span>
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="mt-6 min-[1920px]:mt-12 text-[10px] uppercase tracking-[0.2em] font-medium text-zinc-500 text-center w-full"
      >
        © 2024 KRIFTH AI. ALL RIGHTS RESERVED.
      </motion.div>
    </div>
  );
}
