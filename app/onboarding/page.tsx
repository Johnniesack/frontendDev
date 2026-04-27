"use client";

import React from "react";
import { OnboardingFlow } from "../components/onboarding-flow";
import { DynamicBackground } from "../components/dynamic-background";

export default function OnboardingPage() {
  const handleComplete = () => {
    // Redirect to dashboard or home after completion
    window.location.href = "/dashboard";
  };

  return (
    <main className="h-[100dvh] w-full relative overflow-hidden bg-[#050505] text-white">
      <DynamicBackground />
      <div className="relative z-10 w-full h-full">
        <OnboardingFlow onComplete={handleComplete} />
      </div>
    </main>
  );
}
