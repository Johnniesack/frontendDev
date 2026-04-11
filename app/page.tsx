"use client";

import React, { useState } from "react";
import { MarketingSide } from "./components/marketing-side";
import { SignInForm } from "./components/signin-form";
import { SignUpForm } from "./components/signup-form";
import { VerifyForm } from "./components/verify-form";
import { Logo } from "./components/logo";
import { motion, AnimatePresence } from "framer-motion";
import { DynamicBackground } from "./components/dynamic-background";

export default function SignInPage() {
  const [step, setStep] = useState<"signin" | "signup" | "verify">("signin");
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

  return (
    <main className="min-h-screen w-full relative flex flex-col transition-colors duration-1000 snap-y snap-mandatory h-screen overflow-y-auto lg:h-auto lg:overflow-visible lg:snap-none scroll-smooth">
      <DynamicBackground />
      {/* Absolute Global Logo - Hidden when Marketing Side shows its own in Verify/SignUp Mode */}
      <AnimatePresence>
        {step === "signin" && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="absolute top-6 left-6 sm:top-8 sm:left-12 lg:left-20 z-50 pointer-events-auto"
          >
            <Logo />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-[42%_58%] min-h-screen w-full relative z-10">
        {/* Marketing Hero (Stacked on mobile, Sidebar on desktop) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col overflow-hidden h-screen lg:h-auto lg:min-h-full relative snap-start"
        >
          <MarketingSide mode={step} />
        </motion.div>

        {/* Right side (Form) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col justify-center items-center px-6 py-8 sm:p-8 lg:p-12 relative h-screen lg:h-auto lg:min-h-full overflow-y-auto snap-start"
        >
          {/* Subtle background glow - Shifts color based on step */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[700px] h-[300px] sm:h-[700px] rounded-full blur-[100px] sm:blur-[180px] pointer-events-none transition-colors duration-1000 ${step === "signin" ? "bg-[#22C55E]/5" : step === "signup" ? "bg-[#3B82F6]/8" : "bg-[#A855F7]/8"
              }`}
          />

          <div className="w-full max-w-md relative z-10">
            {step === "signin" ? (
              <SignInForm onNext={handleSignInNext} onSignUp={handleGoToSignUp} />
            ) : step === "signup" ? (
              <SignUpForm onSignIn={handleBackToSignIn} />
            ) : (
              <VerifyForm email={email} onBack={handleBackToSignIn} />
            )}
          </div>
        </motion.div>
      </div>
    </main>

  );
}
