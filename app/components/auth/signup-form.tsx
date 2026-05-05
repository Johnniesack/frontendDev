"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Check, Loader2 } from "lucide-react";
import { signup } from "@/lib/api/auth";

export function SignUpForm({ onSignIn, onSignUpSuccess }: { onSignIn: () => void, onSignUpSuccess: (email: string, tempToken?: string) => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [values, setValues] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = (name: string, value: string) => {
    let error = "";
    if (!value) {
      error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    } else if (name === "email" && !/\S+@\S+\.\S+/.test(value)) {
      error = "Please enter a valid email address";
    } else if (name === "password" && value.length < 8) {
      error = "Password must be at least 8 characters";
    } else if (name === "confirmPassword" && value !== values.password) {
      error = "Passwords do not match";
    }

    // special check: if we change the password, we should re-check matching
    if (name === "password" && values.confirmPassword && value !== values.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
    } else if (name === "password" && values.confirmPassword && value === values.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "" }));
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (touched[name] || isSubmitted) validate(name, value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFocusedField(null);
    setTouched((prev) => ({ ...prev, [name]: true }));
    validate(name, value);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    const nameError = validate("name", values.name);
    const emailError = validate("email", values.email);
    const passwordError = validate("password", values.password);
    const confirmPasswordError = validate("confirmPassword", values.confirmPassword);

    if (!nameError && !emailError && !passwordError && !confirmPasswordError && agreed) {
      setIsLoading(true);
      setApiError(null);

      signup(values.email, values.name, values.password, values.confirmPassword)
        .then((response) => {
          // Try to find temp_token in multiple possible locations
          const token = response.temp_token || response.Temp_token || response.TEMP_TOKEN || 
                        response.data?.temp_token || response.data?.Temp_token || response.data?.TEMP_TOKEN;
          onSignUpSuccess(values.email, token);
        })
        .catch((err) => {
          console.error("Sign up error:", err);
          const msg = err.message || "Failed to create account. Please try again.";
          
          // Try to link API error to specific fields
          if (msg.toLowerCase().includes("email")) {
            setErrors(prev => ({ ...prev, email: msg }));
            setTouched(prev => ({ ...prev, email: true }));
          } else if (msg.toLowerCase().includes("password")) {
            setErrors(prev => ({ ...prev, password: msg }));
            setTouched(prev => ({ ...prev, password: true }));
          } else if (msg.toLowerCase().includes("name")) {
            setErrors(prev => ({ ...prev, name: msg }));
            setTouched(prev => ({ ...prev, name: true }));
          } else {
            setApiError(msg);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <motion.div
        className="w-full p-0 lg:p-8 xl:p-10 min-[1920px]:p-12 rounded-none lg:rounded-[32px] bg-transparent lg:bg-[#161B22] border-0 lg:border lg:border-white/10 shadow-none lg:shadow-premium relative overflow-hidden group/card"
      >
        <div className="text-center mb-5 lg:mb-6 min-[1920px]:mb-10 relative z-10">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2 tracking-tight">
            Create your account
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-medium">
            Join thousands of creators building with AI
          </p>
        </div>

        <form className="space-y-4 lg:space-y-4 min-[1920px]:space-y-6 relative z-10" onSubmit={onSubmit}>
          {/* Full Name */}
          <div className="space-y-1 sm:space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">
                Full Name
              </label>
            </div>
            <div className="relative group">
              <User
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.name && (touched.name || isSubmitted)
                  ? "text-[#FF5F5F]/40"
                  : focusedField === "name"
                    ? "text-[#22C55E]"
                    : "text-zinc-500"
                  }`}
                size={18}
              />
              <input
                name="name"
                type="text"
                value={values.name}
                onChange={handleChange}
                onFocus={() => setFocusedField("name")}
                onBlur={handleBlur}
                placeholder="Peter Parker"
                className={`w-full h-11 sm:h-12 lg:h-11 min-[1920px]:h-14 pl-12 pr-4 rounded-xl bg-[#1A2026] border text-base sm:text-base transition-all font-medium focus:outline-none placeholder:text-zinc-600 ${errors.name && (touched.name || isSubmitted)
                  ? "border-[#FF5F5F]/20 focus:border-[#FF5F5F]/40 bg-[#FF5F5F]/5 shadow-[0_0_12px_rgba(255,95,95,0.08)]"
                  : "border-white/5 focus:border-[#22C55E]/50 focus:shadow-[0_0_12px_rgba(34,197,94,0.15)]"
                  }`}
              />
            </div>
            {errors.name && (touched.name || isSubmitted) && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[10px] text-[#FF5F5F] font-bold uppercase tracking-widest pl-1"
              >
                {errors.name}
              </motion.p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-1 sm:space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">
                Email Address
              </label>
            </div>
            <div className="relative group">
              <Mail
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.email && (touched.email || isSubmitted)
                  ? "text-[#FF5F5F]/40"
                  : focusedField === "email"
                    ? "text-[#22C55E]"
                    : "text-zinc-500"
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
                placeholder="peter@company.com"
                className={`w-full h-11 sm:h-12 lg:h-11 min-[1920px]:h-14 pl-12 pr-4 rounded-xl bg-[#1A2026] border text-base sm:text-base transition-all font-medium focus:outline-none placeholder:text-zinc-600 ${errors.email && (touched.email || isSubmitted)
                  ? "border-[#FF5F5F]/20 focus:border-[#FF5F5F]/40 bg-[#FF5F5F]/5 shadow-[0_0_12px_rgba(255,95,95,0.08)]"
                  : "border-white/5 focus:border-[#22C55E]/50 focus:shadow-[0_0_12px_rgba(34,197,94,0.15)]"
                  }`}
              />
            </div>
            {errors.email && (touched.email || isSubmitted) && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[10px] text-[#FF5F5F] font-bold uppercase tracking-widest pl-1"
              >
                {errors.email}
              </motion.p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-4">
            {/* Password */}
            <div className="space-y-1 sm:space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 block">
                Password
              </label>
              <div className="relative group">
                <Lock
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.password && (touched.password || isSubmitted)
                    ? "text-[#FF5F5F]/40"
                    : focusedField === "password"
                      ? "text-[#22C55E]"
                      : "text-zinc-500"
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
                  className={`w-full h-11 sm:h-12 lg:h-11 min-[1920px]:h-14 pl-12 pr-10 rounded-xl bg-[#1A2026] border text-base sm:text-base transition-all font-medium focus:outline-none placeholder:text-zinc-600 ${errors.password && (touched.password || isSubmitted)
                    ? "border-[#FF5F5F]/20 focus:border-[#FF5F5F]/40 bg-[#FF5F5F]/5 shadow-[0_0_12px_rgba(255,95,95,0.08)]"
                    : "border-white/5 focus:border-[#22C55E]/50 focus:shadow-[0_0_12px_rgba(34,197,94,0.15)]"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (touched.password || isSubmitted) && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[10px] text-[#FF5F5F] font-bold uppercase tracking-widest pl-1"
                >
                  {errors.password}
                </motion.p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1 sm:space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 block">
                Confirm
              </label>
              <div className="relative group">
                <Lock
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.confirmPassword && (touched.confirmPassword || isSubmitted)
                    ? "text-[#FF5F5F]/40"
                    : focusedField === "confirmPassword"
                      ? "text-[#22C55E]"
                      : "text-zinc-500"
                    }`}
                  size={18}
                />
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("confirmPassword")}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  className={`w-full h-11 sm:h-12 lg:h-11 min-[1920px]:h-14 pl-12 pr-10 rounded-xl bg-[#1A2026] border text-base sm:text-base transition-all font-medium focus:outline-none placeholder:text-zinc-600 ${errors.confirmPassword && (touched.confirmPassword || isSubmitted)
                    ? "border-[#FF5F5F]/20 focus:border-[#FF5F5F]/40 bg-[#FF5F5F]/5 shadow-[0_0_12px_rgba(255,95,95,0.08)]"
                    : "border-white/5 focus:border-[#22C55E]/50 focus:shadow-[0_0_12px_rgba(34,197,94,0.15)]"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (touched.confirmPassword || isSubmitted) && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[10px] text-[#FF5F5F] font-bold uppercase tracking-widest pl-1"
                >
                  {errors.confirmPassword}
                </motion.p>
              )}
            </div>
          </div>

          {/* General API Error Message (if it doesn't match a specific field) */}
          {apiError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] text-[#FF5F5F] font-bold uppercase tracking-widest text-center pt-2"
            >
              {apiError}
            </motion.p>
          )}

          {/* Terms */}
          <div className="flex items-center gap-3 py-1 sm:py-1.5 lg:py-2 justify-center sm:justify-start">
            <button
              type="button"
              onClick={() => setAgreed(!agreed)}
              className={`w-5 h-5 rounded border transition-all flex items-center justify-center flex-shrink-0 ${agreed ? "bg-[#22C55E] border-[#22C55E]" : "bg-[#1A2026] border-white/10"
                } ${isSubmitted && !agreed ? "border-[#FF5F5F]/40 bg-[#FF5F5F]/5" : ""}`}
            >
              {agreed && <Check size={14} className="text-black" strokeWidth={4} />}
            </button>
            <span className="text-[11px] sm:text-[12px] text-zinc-400 font-medium leading-tight">
              I agree to <a href="#" className="text-[#22C55E] hover:underline">Terms</a> & <a href="#" className="text-[#22C55E] hover:underline">Privacy Policy</a>
            </span>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={isLoading ? {} : { scale: 1.01, backgroundColor: "#4ADE80" }}
            whileTap={isLoading ? {} : { scale: 0.98 }}
            className={`w-full h-11 sm:h-12 lg:h-11 min-[1920px]:h-14 rounded-xl bg-[#22C55E] text-black font-bold text-sm sm:text-base transition-colors flex items-center justify-center gap-2 group shadow-[0_4px_20px_rgba(34,197,94,0.2)] ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-5 pt-4 lg:mt-6 lg:pt-5 min-[1920px]:mt-8 min-[1920px]:pt-6 lg:border-t lg:border-white/5 flex items-center justify-center relative z-10 w-full">
          <p className="text-[11px] sm:text-xs text-zinc-400 font-medium tracking-tight">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSignIn}
              className="text-[#22C55E] font-bold hover:underline ml-1"
            >
              Sign in
            </button>
          </p>
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