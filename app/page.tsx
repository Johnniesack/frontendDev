"use client";

import React, { useState } from "react";
import { MarketingSide } from "./components/marketing/marketing-side";
import { SignInForm } from "./components/auth/signin-form";
import { SignUpForm } from "./components/auth/signup-form";
import { VerifyForm } from "./components/auth/verify-form";
import { ForgotPasswordForm } from "./components/auth/forgot-password-form";
import { Logo } from "./components/ui/logo";
import { motion, AnimatePresence } from "framer-motion";
import { DynamicBackground } from "./components/marketing/dynamic-background";
import { useRouter } from "next/navigation";
import { OnboardingFlow } from "./components/onboarding/onboarding-flow";

export default function SignInPage() {
  const router = useRouter();
  const [step, setStep] = useState<"signin" | "signup" | "verify" | "forgot-password">("signin");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [tempToken, setTempToken] = useState<string | undefined>(undefined);
  const [isSignUpFlow, setIsSignUpFlow] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  React.useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    
    if (accessToken) {
      router.push("/dashboard");
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#22C55E]/20 border-t-[#22C55E] rounded-full animate-spin" />
      </div>
    );
  }

  const handleSignInNext = (emailValue: string, data?: any) => {
    console.log("Sign In Success Data:", data);
    setEmail(emailValue);
    setIsSignUpFlow(false);
    
    const accessToken = data?.access_token || data?.access || 
                        data?.data?.access_token || data?.data?.access;
    const isOnboarded = data?.is_onboarded ?? data?.data?.is_onboarded;
    const extractedUserId = data?.user_id || data?.data?.user_id || data?.user?.id || data?.data?.user?.id;
    
    console.log("Extracted User ID:", extractedUserId);
    if (extractedUserId) setUserId(extractedUserId);
    
    if (accessToken || isOnboarded !== undefined) {
      if (isOnboarded === true) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }
    } else {
      const token = data?.temp_token || data?.Temp_token || data?.TEMP_TOKEN || data?.tempToken ||
                    data?.data?.temp_token || data?.data?.Temp_token || data?.data?.TEMP_TOKEN || data?.data?.tempToken ||
                    data?.token || data?.data?.token;
                    
      if (token || extractedUserId) {
        setTempToken(token);
        setStep("verify");
      } else {
        console.warn("No token or user ID found in sign-in response, defaulting to dashboard");
        router.push("/dashboard");
      }
    }
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

  const handleSignUpSuccess = (emailValue: string, userIdValue: number, token?: string) => {
    console.log("Sign Up Success - Email:", emailValue, "User ID:", userIdValue);
    setEmail(emailValue);
    setUserId(userIdValue);
    setTempToken(token);
    setIsSignUpFlow(true);
    
    // Redirect to onboarding as per new backend flow
    router.push("/onboarding");
  };

  const handleVerifySuccess = (isOnboarded: boolean) => {
    if (isSignUpFlow) {
      router.push("/onboarding");
    } else {
      router.push("/dashboard");
    }
  };

  const renderForm = () => {
    switch (step) {
      case "signin":
        return <SignInForm onNext={handleSignInNext} onSignUp={handleGoToSignUp} onForgotPassword={handleGoToForgotPassword} />;
      case "signup":
        return <SignUpForm onSignIn={handleBackToSignIn} onSignUpSuccess={handleSignUpSuccess} />;
      case "verify":
        return <VerifyForm email={email} userId={userId} tempToken={tempToken} onBack={handleBackToSignIn} onSuccess={handleVerifySuccess} />;
      case "forgot-password":
        return <ForgotPasswordForm onBack={handleBackToSignIn} />;
    }
  };

  return (
    <main className="min-h-[100dvh] w-full relative overflow-x-hidden overflow-y-auto bg-transparent text-white">
      <DynamicBackground />

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* MOBILE LAYOUT — Fixed screen, internal scroll, no marketing */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="xl:hidden relative z-10 min-h-[100dvh] flex flex-col">
        {/* Mobile Header - Fixed at top */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2 shrink-0">
          {step !== "signup" ? <Logo /> : <div />}
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              {step === "signin" ? "Sign In" : step === "signup" ? "Sign Up" : step === "forgot-password" ? "Reset Auth" : "Verify"}
            </span>
          </div>
        </div>

        {/* Mobile Form - Scrolls internally if it exceeds screen height */}
        <div className="flex-1 min-h-0 flex flex-col justify-center px-6 pt-4 pb-4 overflow-y-auto overflow-x-hidden">
          <div className="w-full max-w-md sm:max-w-lg mx-auto">
            {renderForm()}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* DESKTOP LAYOUT — Two-panel: Marketing + Form              */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="hidden xl:grid xl:grid-cols-2 xl:min-h-screen w-full relative z-10">
        {/* Marketing Hero - Desktop only */}
        <AnimatePresence mode="wait">
          <motion.div
              key={`marketing-${step}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col min-h-0 xl:min-h-full relative origin-center transition-transform duration-300 [@media(max-height:800px)]:scale-95 [@media(max-height:700px)]:scale-[0.85] [@media(max-height:600px)]:scale-[0.75]"
            >
              <MarketingSide mode={step} />
            </motion.div>
          </AnimatePresence>

        {/* Form Side - Desktop */}
        <div className={`relative flex flex-col items-center justify-center min-h-screen transition-all duration-1000 ease-[0.23,1,0.32,1] ${step === "signup" ? "xl:col-span-1 px-6 py-12 sm:px-12 md:px-16 xl:px-20 min-[1441px]:px-24" : "xl:col-span-1 px-6 py-12 sm:px-12 md:px-16 xl:px-20 min-[1441px]:px-24"
          }`}>
          <div className={`mx-auto transition-all duration-1000 ease-[0.23,1,0.32,1] flex items-center justify-center ${step === "signup" ? "w-full max-w-[460px] min-[1441px]:max-w-[500px] h-fit" : "w-full max-w-[420px] min-[1441px]:max-w-[460px] h-fit"
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