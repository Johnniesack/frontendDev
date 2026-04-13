"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export function SignInForm({ onNext, onSignUp, onForgotPassword }: { onNext: (email: string) => void, onSignUp: () => void, onForgotPassword?: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [values, setValues] = useState({ email: "", password: "" });

  const validate = (name: string, value: string) => {
    let error = "";
    if (!value) {
      error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    } else if (name === "email" && !/\S+@\S+\.\S+/.test(value)) {
      error = "Please enter a valid email address";
    } else if (name === "password" && value.length < 8) {
      error = "Password must be at least 8 characters";
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    if (touched[name] || isSubmitted) validate(name, value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFocusedField(null);
    setTouched(prev => ({ ...prev, [name]: true }));
    validate(name, value);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    const emailError = validate("email", values.email);
    const passwordError = validate("password", values.password);

    if (!emailError && !passwordError) {
      onNext(values.email);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <motion.div
        whileHover={{ y: -5, transition: { duration: 0.3 } }}
        className="w-full p-0 lg:p-6 xl:p-8 min-[1920px]:p-12 rounded-none lg:rounded-[32px] bg-transparent lg:bg-[#161B22] border-0 lg:border lg:border-white/10 shadow-none lg:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6),0_0_20px_rgba(34,197,94,0.05)] relative overflow-hidden group/card"
      >
        {/* Light Green Inside Effects - hidden on mobile */}
        <div className="hidden lg:block absolute top-0 right-0 w-[300px] h-[300px] bg-[#22C55E]/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none transition-opacity group-hover/card:opacity-100 opacity-50" />
        <div className="hidden lg:block absolute bottom-0 left-0 w-[200px] h-[200px] bg-teal-500/5 rounded-full blur-[60px] -ml-20 -mb-20 pointer-events-none transition-opacity group-hover/card:opacity-100 opacity-30" />

        {/* Animated Border Gradient on Hover - hidden on mobile */}
        <div className="hidden lg:block absolute inset-0 border border-[#22C55E]/0 group-hover/card:border-[#22C55E]/20 rounded-[32px] transition-colors duration-500 pointer-events-none" />
        <div className="text-center mb-6 min-[1920px]:mb-10 relative z-10">
          <h2 className="text-2xl sm:text-[32px] font-bold text-white mb-2 tracking-tight">
            Welcome back
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-medium">
            Sign in to manage your online shop and AI agents
          </p>
        </div>

        <form className="space-y-4 min-[1920px]:space-y-6 relative z-10" onSubmit={onSubmit}>
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">
                Email Address
              </label>
              {errors.email && (touched.email || isSubmitted) && (
                <motion.span
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-[10px] font-bold text-red-400/80 uppercase tracking-tight pt-0.5 pr-1"
                >
                  {errors.email}
                </motion.span>
              )}
            </div>
            <div className="relative group">
              <Mail
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.email && (touched.email || isSubmitted) ? "text-red-400/40" : focusedField === "email" ? "text-[#22C55E]" : "text-zinc-500"
                  }`}
                size={18}
              />
              <input
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onFocus={() => setFocusedField("email")}
                onBlur={handleBlur}
                placeholder="name@krifth.com"
                className={`w-full h-11 sm:h-12 min-[1920px]:h-14 pl-12 pr-4 rounded-xl bg-[#1A2026] border transition-all font-medium text-sm sm:text-base focus:outline-none placeholder:text-zinc-600 ${errors.email && (touched.email || isSubmitted)
                  ? "border-red-500/20 focus:border-red-500/40 bg-red-500/5 focus:shadow-[0_0_12px_rgba(239,68,68,0.08)]"
                  : "border-white/5 focus:border-[#22C55E]/50 hover:bg-[#1E252D] focus:shadow-[0_0_12px_rgba(34,197,94,0.15)]"
                  }`}
              />
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">
                  Password
                </label>
                {errors.password && (touched.password || isSubmitted) && (
                  <motion.span
                    initial={{ opacity: 0, x: 5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[10px] font-bold text-red-400/80 uppercase tracking-tight pt-0.5"
                  >
                    {errors.password}
                  </motion.span>
                )}
              </div>
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-[10px] uppercase tracking-widest font-bold text-[#22C55E] hover:text-[#4ADE80] transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative group">
              <Lock
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.password && (touched.password || isSubmitted) ? "text-red-400/40" : focusedField === "password" ? "text-[#22C55E]" : "text-zinc-500"
                  }`}
                size={18}
              />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleChange}
                onFocus={() => setFocusedField("password")}
                onBlur={handleBlur}
                placeholder="••••••••"
                className={`w-full h-11 sm:h-12 min-[1920px]:h-14 pl-12 pr-12 rounded-xl bg-[#1A2026] border transition-all font-medium text-sm sm:text-base focus:outline-none placeholder:text-zinc-600 ${errors.password && (touched.password || isSubmitted)
                  ? "border-red-500/20 focus:border-red-500/40 bg-red-500/5 focus:shadow-[0_0_12px_rgba(239,68,68,0.08)]"
                  : "border-white/5 focus:border-[#22C55E]/50 hover:bg-[#1E252D] focus:shadow-[0_0_12px_rgba(34,197,94,0.15)]"
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="flex justify-between items-center h-4">
              {focusedField === "password" && !errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[10px] text-zinc-500 font-medium"
                >
                  Min. 8 characters with at least one number
                </motion.p>
              )}
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.01, backgroundColor: "#4ADE80" }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-11 sm:h-12 min-[1920px]:h-14 rounded-xl bg-[#22C55E] text-black font-bold text-sm sm:text-base transition-colors flex items-center justify-center gap-2 group"
          >
            <span>Continue to Krifth</span>
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </motion.button>

          <div className="relative py-1 flex items-center gap-4 min-[1920px]:py-2">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 whitespace-nowrap">
              Or continue with
            </span>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <button
            type="button"
            className="w-full h-11 min-[1920px]:h-12 rounded-xl sm:bg-white/[0.03] sm:border sm:border-white/20 text-white font-medium text-sm flex items-center justify-center gap-3 hover:text-white/80 sm:hover:bg-white/[0.08] sm:hover:border-white/30 transition-all active:scale-[0.98]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
          <div className="mt-4 min-[1920px]:mt-8 flex items-center justify-center gap-2 text-[10px] text-zinc-500 font-medium uppercase tracking-widest hidden sm:flex">
            <svg className="w-3.5 h-3.5 text-[#22C55E]/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Secure login powered by encryption</span>
          </div>
        </form>

        {/* Integrated Navigation Link for both mobile and desktop */}
        <div className="mt-5 pt-4 lg:mt-6 lg:pt-5 min-[1920px]:mt-8 min-[1920px]:pt-6 lg:border-t lg:border-white/5 flex flex-col items-center justify-center w-full relative z-10">
          <span className="text-[11px] sm:text-xs text-zinc-400 font-medium mb-1.5">
            New to Krifth?
          </span>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); onSignUp(); }}
            className="text-[#22C55E] text-[11px] sm:text-xs font-bold uppercase tracking-[0.1em] flex items-center gap-2 group/btn"
          >
            <span className="group-hover/btn:underline decoration-2 underline-offset-4">Sign up now</span>
            <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
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
