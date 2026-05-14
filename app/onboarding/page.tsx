"use client";

import React from "react";
import { OnboardingFlow } from "../components/onboarding/onboarding-flow";
import { DynamicBackground } from "../components/marketing/dynamic-background";

export default function OnboardingPage() {

  React.useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const isOnboarded = localStorage.getItem("is_onboarded") === "true";
    
    // If they are already signed in AND marked as onboarded, bounce to dashboard
    if (accessToken && isOnboarded) {
      window.location.href = "/dashboard";
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem("is_onboarded", "true");
    window.location.href = "/dashboard";
  };

  return (
    <main className="min-h-[100dvh] w-full relative overflow-x-hidden overflow-y-auto bg-transparent text-white">
      <DynamicBackground />
      <div className="relative z-10 w-full min-h-[100dvh] lg:h-full">
        <OnboardingFlow onComplete={handleComplete} />
      </div>
    </main>
  );
}
