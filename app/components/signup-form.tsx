"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Check } from "lucide-react";

export function SignUpForm({ onSignIn }: { onSignIn: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [values, setValues] = useState({ name: "", email: "", password: "" });

  const validate = (name: string, value: string) => {
    let error = "";
    if (!value) {
      error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    } else if (name === "email" && !/\S+@\S+\.\S+/.test(value)) {
      error = "Please enter a valid email address";
    } else if (name === "password" && value.length < 8) {
      error = "Password must be at least 8 characters";
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

    if (!nameError && !emailError && !passwordError && agreed) {
      // Handle Sign Up
      console.log("Sign up success", values);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full p-0 sm:p-10 lg:p-12 rounded-none sm:rounded-[32px] bg-transparent sm:bg-[#161B22] border-0 sm:border sm:border-white/10 shadow-none sm:shadow-premium relative overflow-hidden group/card"
      >
        <div className="text-center mb-6 sm:mb-10 relative z-10">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2 tracking-tight">
            Create your account
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-medium">
            Join thousands of creators building with AI
          </p>
        </div>

        <form className="space-y-4 sm:space-y-5 relative z-10" onSubmit={onSubmit}>
          {/* Full Name */}
          <div className="space-y-2">
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
                  {errors.name}
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
                className={`w-full h-12 sm:h-14 pl-12 pr-4 rounded-xl bg-[#1A2026] border text-sm sm:text-base transition-all font-medium focus:outline-none placeholder:text-zinc-600 ${errors.name && (touched.name || isSubmitted)
                    ? "border-red-500/20 focus:border-red-500/40 bg-red-500/5"
                    : "border-white/5 focus:border-[#22C55E]/50 focus:shadow-[0_0_12px_rgba(34,197,94,0.15)]"
                  }`}
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-2">
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
                  {errors.email}
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
                className={`w-full h-12 sm:h-14 pl-12 pr-4 rounded-xl bg-[#1A2026] border text-sm sm:text-base transition-all font-medium focus:outline-none placeholder:text-zinc-600 ${errors.email && (touched.email || isSubmitted)
                    ? "border-red-500/20 focus:border-red-500/40 bg-red-500/5"
                    : "border-white/5 focus:border-[#22C55E]/50 focus:shadow-[0_0_12px_rgba(34,197,94,0.15)]"
                  }`}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">
                Create Password
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
                className={`w-full h-12 sm:h-14 pl-12 pr-12 rounded-xl bg-[#1A2026] border text-sm sm:text-base transition-all font-medium focus:outline-none placeholder:text-zinc-600 ${errors.password && (touched.password || isSubmitted)
                    ? "border-red-500/20 focus:border-red-500/40 bg-red-500/5"
                    : "border-white/5 focus:border-[#22C55E]/50 focus:shadow-[0_0_12px_rgba(34,197,94,0.15)]"
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
          </div>

          {/* Terms */}
          <div className="flex items-center gap-3 py-2">
            <button
              type="button"
              onClick={() => setAgreed(!agreed)}
              className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${agreed ? "bg-[#22C55E] border-[#22C55E]" : "bg-[#1A2026] border-white/10"
                } ${isSubmitted && !agreed ? "border-red-500/40 bg-red-500/5" : ""}`}
            >
              {agreed && <Check size={14} className="text-black" strokeWidth={4} />}
            </button>
            <span className="text-[12px] text-zinc-400 font-medium">
              I agree to <a href="#" className="text-[#22C55E] hover:underline">Terms of Service</a> & <a href="#" className="text-[#22C55E] hover:underline">Privacy Policy</a>
            </span>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.01, backgroundColor: "#4ADE80" }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-12 sm:h-14 rounded-xl bg-[#22C55E] text-black font-bold text-sm sm:text-base transition-colors flex items-center justify-center gap-2 group shadow-[0_4px_20px_rgba(34,197,94,0.2)]"
          >
            <span>Create Account</span>
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </motion.button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-4 sm:mt-12 flex items-center justify-center"
      >
        <p className="text-sm text-zinc-400 font-medium tracking-tight">
          Already have an account?{" "}
          <button
            onClick={onSignIn}
            className="text-[#22C55E] font-bold hover:underline ml-1"
          >
            Sign in
          </button>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="mt-6 sm:mt-12 text-[10px] uppercase tracking-[0.2em] font-medium text-zinc-500 text-center w-full"
      >
        © 2024 KRIFTH AI. ALL RIGHTS RESERVED.
      </motion.div>
    </div>
  );
}
