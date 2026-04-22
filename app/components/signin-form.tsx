"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { login } from "@/lib/api/auth";

export function SignInForm({ onNext, onSignUp, onForgotPassword }: { onNext: (email: string) => void, onSignUp: () => void, onForgotPassword?: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setServerError(null);

    const emailError = validate("email", values.email);
    const passwordError = validate("password", values.password);

    if (!emailError && !passwordError) {
      setIsLoading(true);
      try {
        // Here we call the login function from our auth.ts file
        const response = await login(values.email, values.password);

        // We save the keys from the server into the browser memory
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);

        // Move to the next screen
        onNext(values.email);
      } catch (err: any) {
        // If login fails, we show the error message
        setServerError(err.message || "Login failed. Please check your credentials.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <motion.div
        whileHover={{ y: -5, transition: { duration: 0.3 } }}
        className="w-full p-0 lg:p-6 xl:p-8 min-[1920px]:p-12 rounded-none lg:rounded-[32px] bg-transparent lg:bg-[#161B22] border-0 lg:border lg:border-white/10 shadow-none lg:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6),0_0_20px_rgba(34,197,94,0.05)] relative overflow-hidden group/card"
      >
        {/* Background Effects */}
        <div className="hidden lg:block absolute top-0 right-0 w-[300px] h-[300px] bg-[#22C55E]/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none transition-opacity group-hover/card:opacity-100 opacity-50" />
        <div className="hidden lg:block absolute bottom-0 left-0 w-[200px] h-[200px] bg-teal-500/5 rounded-full blur-[60px] -ml-20 -mb-20 pointer-events-none transition-opacity group-hover/card:opacity-100 opacity-30" />

        <div className="text-center mb-6 min-[1920px]:mb-10 relative z-10">
          <h2 className="text-2xl sm:text-[32px] font-bold text-white mb-2 tracking-tight">
            Welcome back
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-medium">
            Sign in to manage your online shop and AI agents
          </p>
        </div>

        {/* This block shows the server error if login fails */}
        {serverError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest text-center"
          >
            {serverError}
          </motion.div>
        )}

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
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.email && (touched.email || isSubmitted) ? "text-red-400/40" : focusedField === "email" ? "text-[#22C55E]" : "text-zinc-500"}`}
                size={18}
              />
              <input
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onFocus={() => setFocusedField("email")}
                onBlur={handleBlur}
                disabled={isLoading}
                placeholder="name@krifth.com"
                className={`w-full h-11 sm:h-12 min-[1920px]:h-14 pl-12 pr-4 rounded-xl bg-[#1A2026] border transition-all font-medium text-base sm:text-base focus:outline-none placeholder:text-zinc-600 ${errors.email && (touched.email || isSubmitted) ? "border-red-500/20 focus:border-red-500/40 bg-red-500/5 shadow-[0_0_12px_rgba(239,68,68,0.08)]" : "border-white/5 focus:border-[#22C55E]/50 hover:bg-[#1E252D] focus:shadow-[0_0_12px_rgba(34,197,94,0.15)]"}`}
              />
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">
                Password
              </label>
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-[10px] uppercase tracking-widest font-bold text-[#22C55E] hover:text-[#4ADE80] transition-colors"
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>
            <div className="relative group">
              <Lock
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.password && (touched.password || isSubmitted) ? "text-red-400/40" : focusedField === "password" ? "text-[#22C55E]" : "text-zinc-500"}`}
                size={18}
              />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleChange}
                onFocus={() => setFocusedField("password")}
                onBlur={handleBlur}
                disabled={isLoading}
                placeholder="••••••••"
                className={`w-full h-11 sm:h-12 min-[1920px]:h-14 pl-12 pr-12 rounded-xl bg-[#1A2026] border transition-all font-medium text-base sm:text-base focus:outline-none placeholder:text-zinc-600 ${errors.password && (touched.password || isSubmitted) ? "border-red-500/20 focus:border-red-500/40 bg-red-500/5 shadow-[0_0_12px_rgba(239,68,68,0.08)]" : "border-white/5 focus:border-[#22C55E]/50 hover:bg-[#1E252D] focus:shadow-[0_0_12px_rgba(34,197,94,0.15)]"}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={!isLoading ? { scale: 1.01, backgroundColor: "#4ADE80" } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
            className={`w-full h-11 sm:h-12 min-[1920px]:h-14 rounded-xl bg-[#22C55E] text-black font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 group ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            <span>{isLoading ? "Signing in..." : "Continue to Krifth"}</span>
            {!isLoading && <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />}
          </motion.button>
        </form>

        <div className="mt-5 pt-4 border-t border-white/5 flex flex-col items-center justify-center w-full relative z-10">
          <span className="text-[11px] sm:text-xs text-zinc-400 font-medium mb-1.5">
            New to Krifth?
          </span>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); onSignUp(); }}
            className="text-[#22C55E] text-[11px] sm:text-xs font-bold uppercase tracking-[0.1em] flex items-center gap-2 group/btn"
            disabled={isLoading}
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
        className="mt-6 text-[10px] uppercase tracking-[0.2em] font-medium text-zinc-500 text-center w-full"
      >
        © 2024 KRIFTH AI. ALL RIGHTS RESERVED.
      </motion.div>
    </div>
  );
}