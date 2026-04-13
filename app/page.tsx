"use client";

import React, { useState } from "react";
import { MarketingSide } from "./components/marketing-side";
import { SignInForm } from "./components/signin-form";
import { SignUpForm } from "./components/signup-form";
import { VerifyForm } from "./components/verify-form";
import { ForgotPasswordForm } from "./components/forgot-password-form";
import { Logo } from "./components/logo";
import { motion, AnimatePresence } from "framer-motion";
import { DynamicBackground } from "./components/dynamic-background";

export default function SignInPage() {
  const [step, setStep] = useState<"signin" | "signup" | "verify" | "forgot-password">("signin");
  const [email, setEmail] = useState("");

  const handleSignInNext = (emailValue: string) => {
    setEmail(emailValue);
    setStep("verify");
  };

  const handleBackToSignIn = () => {
    setStep("signin");
  };

  const handleGoToSignUp = () => {
    setStep("signup");
  };

  const handleGoToForgotPassword = () => {
    setStep("forgot-password");
  };

  const renderForm = () => {
    switch (step) {
      case "signin":
        return <SignInForm onNext={handleSignInNext} onSignUp={handleGoToSignUp} onForgotPassword={handleGoToForgotPassword} />;
      case "signup":
        return <SignUpForm onSignIn={handleBackToSignIn} />;
      case "verify":
        return <VerifyForm email={email} onBack={handleBackToSignIn} />;
      case "forgot-password":
        return <ForgotPasswordForm onBack={handleBackToSignIn} />;
    }
  };

  return (
    <main className="h-[100dvh] w-full relative overflow-hidden bg-[#050505] text-white">
      <DynamicBackground />

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* MOBILE LAYOUT — Fixed screen, internal scroll, no marketing */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="lg:hidden relative z-10 h-full flex flex-col">
        {/* Mobile Header - Fixed at top */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2 shrink-0">
          <Logo />
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              {step === "signin" ? "Sign In" : step === "signup" ? "Sign Up" : step === "forgot-password" ? "Reset Auth" : "Verify"}
            </span>
          </div>
        </div>

        {/* Mobile Form - Scrolls internally if it exceeds screen height */}
        <div className="flex-1 flex flex-col justify-center px-6 pt-4 pb-8 overflow-y-auto overflow-x-hidden">
          <div className="w-full max-w-md mx-auto my-auto">
            {renderForm()}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* DESKTOP LAYOUT — Two-panel: Marketing + Form              */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:h-svh lg:max-h-svh lg:min-h-0 w-full relative z-10 overflow-hidden">
        {/* Logo - Desktop only */}
        <AnimatePresence>
          {step === "signin" && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="absolute top-8 left-10 z-50 pointer-events-auto min-[1441px]:left-14"
            >
              <Logo />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Marketing Hero - Desktop only */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`marketing-${step}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col overflow-hidden min-h-0 lg:h-full relative origin-center transition-transform duration-300 [@media(max-height:800px)]:scale-95 [@media(max-height:700px)]:scale-[0.85] [@media(max-height:600px)]:scale-[0.75]"
          >
            <MarketingSide mode={step} />
          </motion.div>
        </AnimatePresence>

        {/* Form Side - Desktop */}
        <div className="flex flex-col min-h-0 lg:h-full lg:px-8 xl:px-12 min-[1441px]:px-16 relative lg:overflow-hidden overflow-y-auto overscroll-y-contain">
          {/* Subtle background glow — stronger on ultra-wide */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(100%,400px)] h-[min(100vh,440px)] max-h-[80svh] min-[1441px]:w-[min(100%,520px)] min-[1441px]:h-[min(100vh,520px)] min-[1441px]:max-h-[85svh] min-[1441px]:blur-[140px] rounded-full blur-[120px] pointer-events-none transition-colors duration-1000 ${step === "signin" ? "bg-[#22C55E]/5 min-[1441px]:bg-[#22C55E]/[0.09]" : step === "signup" ? "bg-[#3B82F6]/8 min-[1441px]:bg-[#3B82F6]/12" : "bg-[#A855F7]/8 min-[1441px]:bg-[#A855F7]/12"
              }`}
          />

          <div className="w-full max-w-md min-[1441px]:max-w-lg relative z-10 grid mx-auto my-auto shrink-0 origin-center transition-transform duration-300 min-h-[440px] [@media(max-height:800px)]:scale-95 [@media(max-height:700px)]:scale-[0.85] [@media(max-height:600px)]:scale-[0.75]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`form-${step}`}
                className="col-start-1 row-start-1 w-full"
                initial={{ opacity: 0, filter: "blur(8px)", scale: 0.98, y: 6 }}
                animate={{ opacity: 1, filter: "blur(0px)", scale: 1, y: 0 }}
                exit={{ opacity: 0, filter: "blur(8px)", scale: 0.98, y: -6 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {renderForm()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
