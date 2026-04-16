"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Check } from "lucide-react";

export function SignUpForm({ onSignIn, onSignUpSuccess }: { onSignIn: () => void, onSignUpSuccess: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [values, setValues] = useState({ name: "", email: "", password: "", confirmPassword: "" });

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
      // Handle Sign Up logic here later
      console.log("Sign up success", values);
      onSignUpSuccess();
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <motion.div
        className="w-full p-0 lg:p-8 xl:p-10 min-[1920px]:p-12 rounded-none lg:rounded-[32px] bg-transparent lg:bg-[#161B22] border-0 lg:border lg:border-white/10 shadow-none lg:shadow-premium relative overflow-hidden group/card"
      >
        <div className="text-center mb-6 min-[1920px]:mb-10 relative z-10">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2 tracking-tight">
            Create your account
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-medium">
            Join thousands of creators building with AI
          </p>
        </div>

        <form className="space-y-4 min-[1920px]:space-y-6 relative z-10" onSubmit={onSubmit}>
          {/* Full Name */}
          <div className="space-y-1 sm:space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">
                Full Name
              </label>
              {errors.name && (touched.name || isSubmitted) && (
                <motion.span
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-[10px] font-bold text-red-400/80 uppercase tracking-tight pt-0.5"
                >
                  {errors.name && "Required"}
                </motion.span>
              )}
            </div>
            <div className="relative group">
              <User
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.name && (touched.name || isSubmitted)
                  ? "text-red-400/40"
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
                placeholder="John Doe"
                className={`w-full h-11 sm:h-12 min-[1920px]:h-14 pl-12 pr-4 rounded-xl bg-[#1A2026] border text-base sm:text-base transition-all font-medium focus:outline-none placeholder:text-zinc-600 ${errors.name && (touched.name || isSubmitted)
                  ? "border-red-500/20 focus:border-red-500/40 bg-red-500/5 shadow-[0_0_12px_rgba(239,68,68,0.08)]"
                  : "border-white/5 focus:border-[#22C55E]/50 focus:shadow-[0_0_12px_rgba(34,197,94,0.15)]"
                  }`}
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1 sm:space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">
                Email Address
              </label>
              {errors.email && (touched.email || isSubmitted) && (
                <motion.span
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-[10px] font-bold text-red-400/80 uppercase tracking-tight pt-0.5"
                >
                  {errors.email && "Invalid"}
                </motion.span>
              )}
            </div>
            <div className="relative group">
              <Mail
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.email && (touched.email || isSubmitted)
                  ? "text-red-400/40"
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
                placeholder="john@company.com"
                className={`w-full h-11 sm:h-12 min-[1920px]:h-14 pl-12 pr-4 rounded-xl bg-[#1A2026] border text-base sm:text-base transition-all font-medium focus:outline-none placeholder:text-zinc-600 ${errors.email && (touched.email || isSubmitted)
                  ? "border-red-500/20 focus:border-red-500/40 bg-red-500/5 shadow-[0_0_12px_rgba(239,68,68,0.08)]"
                  : "border-white/5 focus:border-[#22C55E]/50 focus:shadow-[0_0_12px_rgba(34,197,94,0.15)]"
                  }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Password */}
            <div className="space-y-1 sm:space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 block">
                Password
              </label>
              <div className="relative group">
                <Lock
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.password && (touched.password || isSubmitted)
                    ? "text-red-400/40"
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
                  className={`w-full h-11 sm:h-12 min-[1920px]:h-14 pl-12 pr-10 rounded-xl bg-[#1A2026] border text-base sm:text-base transition-all font-medium focus:outline-none placeholder:text-zinc-600 ${errors.password && (touched.password || isSubmitted)
                    ? "border-red-500/20 focus:border-red-500/40 bg-red-500/5 shadow-[0_0_12px_rgba(239,68,68,0.08)]"
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
            </div>

            {/* Confirm Password */}
            <div className="space-y-1 sm:space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 block">
                Confirm
              </label>
              <div className="relative group">
                <Lock
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.confirmPassword && (touched.confirmPassword || isSubmitted)
                    ? "text-red-400/40"
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
                  className={`w-full h-11 sm:h-12 min-[1920px]:h-14 pl-12 pr-10 rounded-xl bg-[#1A2026] border text-base sm:text-base transition-all font-medium focus:outline-none placeholder:text-zinc-600 ${errors.confirmPassword && (touched.confirmPassword || isSubmitted)
                    ? "border-red-500/20 focus:border-red-500/40 bg-red-500/5 shadow-[0_0_12px_rgba(239,68,68,0.08)]"
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
            </div>
          </div>
          
          {/* Main Error Message for User feedback */}
          {(errors.name || errors.email || errors.password || errors.confirmPassword) && (isSubmitted || touched.password) && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-[10px] text-red-500 font-bold uppercase tracking-widest text-center pt-2"
            >
              {errors.name || errors.email || errors.password || errors.confirmPassword}
            </motion.p>
          )}

          {/* Terms */}
          <div className="flex items-center gap-3 py-1 sm:py-1.5 justify-center sm:justify-start">
            <button
              type="button"
              onClick={() => setAgreed(!agreed)}
              className={`w-5 h-5 rounded border transition-all flex items-center justify-center flex-shrink-0 ${agreed ? "bg-[#22C55E] border-[#22C55E]" : "bg-[#1A2026] border-white/10"
                } ${isSubmitted && !agreed ? "border-red-500/40 bg-red-500/5" : ""}`}
            >
              {agreed && <Check size={14} className="text-black" strokeWidth={4} />}
            </button>
            <span className="text-[11px] sm:text-[12px] text-zinc-400 font-medium leading-tight">
              I agree to <a href="#" className="text-[#22C55E] hover:underline">Terms</a> & <a href="#" className="text-[#22C55E] hover:underline">Privacy Policy</a>
            </span>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.01, backgroundColor: "#4ADE80" }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-11 sm:h-12 min-[1920px]:h-14 rounded-xl bg-[#22C55E] text-black font-bold text-sm sm:text-base transition-colors flex items-center justify-center gap-2 group shadow-[0_4px_20px_rgba(34,197,94,0.2)]"
          >
            <span>Create Account</span>
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </motion.button>

          <div className="relative py-1 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 whitespace-nowrap">
              Or continue with
            </span>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <button
            type="button"
            className="w-full h-11 rounded-xl sm:bg-white/[0.03] sm:border sm:border-white/20 text-white font-medium text-sm flex items-center justify-center gap-3 hover:text-white/80 sm:hover:bg-white/[0.08] sm:hover:border-white/30 transition-all active:scale-[0.98]"
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
