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
import { OnboardingFlow } from "./components/onboarding-flow";

export default function SignInPage() {
  const [step, setStep] = useState<"signin" | "signup" | "verify" | "forgot-password" | "onboarding">("signin");
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

  const handleSignUpSuccess = () => {
    setStep("onboarding");
  };

  const renderForm = () => {
    switch (step) {
      case "signin":
        return <SignInForm onNext={handleSignInNext} onSignUp={handleGoToSignUp} onForgotPassword={handleGoToForgotPassword} />;
      case "signup":
        return <SignUpForm onSignIn={handleBackToSignIn} onSignUpSuccess={handleSignUpSuccess} />;
      case "verify":
        return <VerifyForm email={email} onBack={handleBackToSignIn} />;
      case "forgot-password":
        return <ForgotPasswordForm onBack={handleBackToSignIn} />;
      case "onboarding":
        return <OnboardingFlow onComplete={() => console.log("Onboarding finished!")} />;
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
          {(step === "signin" || step === "signup") && (
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
          {step !== "onboarding" && (
            <motion.div
              key={`marketing-${step}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col overflow-hidden min-h-0 lg:h-full relative origin-center transition-transform duration-300 [@media(max-height:800px)]:scale-95 [@media(max-height:700px)]:scale-[0.85] [@media(max-height:600px)]:scale-[0.75]"
            >
              <MarketingSide mode={step} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Side - Desktop */}
        <div className={`relative flex flex-col items-center justify-center lg:h-full transition-all duration-1000 ease-[0.23,1,0.32,1] overflow-hidden ${
          step === "onboarding" ? "lg:col-span-2 w-full px-4" : "lg:col-span-1 px-6 py-12 sm:px-12 md:px-16 lg:px-20 min-[1441px]:px-24"
        }`}>
          <div className={`mx-auto transition-all duration-1000 ease-[0.23,1,0.32,1] flex items-center justify-center ${
            step === "onboarding" ? "w-full max-w-6xl h-full" : "w-full max-w-[420px] min-[1441px]:max-w-[460px] h-fit"
          }`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
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
