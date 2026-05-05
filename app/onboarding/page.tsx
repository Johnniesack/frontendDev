"use client";

import React from "react";
import { OnboardingFlow } from "../components/onboarding/onboarding-flow";
import { DynamicBackground } from "../components/marketing/dynamic-background";

export default function OnboardingPage() {
  const handleComplete = () => {
    // Redirect to dashboard or home after completion
    window.location.href = "/dashboard";
  };

  return (
    <main className="min-h-[100dvh] lg:h-[100dvh] w-full relative overflow-x-hidden overflow-y-auto lg:overflow-hidden bg-[#050505] text-white">
      <DynamicBackground />
      <div className="relative z-10 w-full min-h-[100dvh] lg:h-full">
        <OnboardingFlow onComplete={handleComplete} />
      </div>
    </main>
  );
}
