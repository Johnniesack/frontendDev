import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, RotateCcw, HelpCircle, Loader2 } from "lucide-react";
import { verifyOtp, resendOtp } from "@/lib/api/auth";

export function VerifyForm({
  email = "a***n@krifth.com",
  userId,
  onBack,
  onSuccess
}: {
  email?: string;
  userId?: number;
  onBack: () => void;
  onSuccess: (isOnboarded: boolean) => void;
}) {
  const [code, setCode] = useState<string[]>(new Array(6).fill(""));
  const [activeInput, setActiveInput] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (value: string, index: number) => {
    const newCode = [...code];
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
      setActiveInput(index + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setActiveInput(index - 1);
    }
  };

  const handleVerify = async () => {
    const codeString = code.join("");
    if (codeString.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    if (!userId) {
      setError("Session expired. Please sign in again.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await verifyOtp(userId, codeString);
      
      // Store tokens
      const accessToken = response.access_token || response.access || 
                          response.data?.access_token || response.data?.access;
      const refreshToken = response.refresh_token || response.refresh || 
                           response.data?.refresh_token || response.data?.refresh;
      
      if (accessToken) localStorage.setItem("access_token", String(accessToken));
      if (refreshToken) localStorage.setItem("refresh_token", String(refreshToken));
      
      const isOnboarded = response.is_onboarded ?? response.data?.is_onboarded ?? false;
      localStorage.setItem("is_onboarded", String(isOnboarded));
      
      onSuccess(isOnboarded);
    } catch (err: any) {
      console.error("Verification error:", err);
      const msg = (err.message || "Invalid verification code. Please try again.")
        .replace(/OTP/g, "code")
        .replace(/otp/g, "code");
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!userId) {
      setError("Session error: User ID missing. Please go back and try again.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      await resendOtp(userId);
      alert("Verification code resent successfully!");
    } catch (err: any) {
      console.error("Resend error:", err);
      const msg = (err.message || "Failed to resend code. Please try again.")
        .replace(/OTP/g, "code")
        .replace(/otp/g, "code");
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <motion.div
        className="w-full text-center mb-6 min-[1920px]:mb-10 relative z-10"
      >
        <h2 className="text-[32px] sm:text-[40px] font-bold text-white mb-2 min-[1920px]:mb-3 tracking-tight">
          Check your email
        </h2>
        <p className="text-[13px] sm:text-[14px] text-zinc-400 font-medium leading-relaxed max-w-sm mx-auto">
          We've sent a 6-digit verification code to <span className="text-[#22C55E]">{email}</span>.
          Please enter it below to access your core identity.
        </p>
      </motion.div>

      <div className="w-full space-y-6 min-[1920px]:space-y-8 relative z-10">
        <div className="flex justify-between gap-3 sm:gap-4">
          {code.map((digit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * index }}
              className="relative flex-1"
            >
              <input
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={() => setActiveInput(index)}
                disabled={isLoading}
                className={`w-full aspect-[4/5] sm:h-20 rounded-lg bg-white/[0.04] border text-2xl font-bold text-white text-center transition-all focus:outline-none ${activeInput === index
                  ? "border-[#22C55E] ring-1 ring-[#22C55E]/20"
                  : "border-white/10"
                  }`}
              />
              {!digit && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {error && (
          <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest text-center animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}

        <div className="space-y-5 min-[1920px]:space-y-6">
          <motion.button
            whileHover={isLoading ? {} : { scale: 1.01, backgroundColor: "#4ADE80" }}
            whileTap={isLoading ? {} : { scale: 0.98 }}
            onClick={handleVerify}
            disabled={isLoading}
            className="w-full h-12 min-[1920px]:h-14 rounded-lg bg-[#22C55E] text-[#0A0A0B] font-bold text-base transition-colors flex items-center justify-center gap-2 group shadow-[0_4px_24px_rgba(34,197,94,0.2)] disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                <span>Verify</span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </>
            )}
          </motion.button>

          <div className="text-center space-y-3 min-[1920px]:space-y-4">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.15em]">
              Haven't received the Code?
            </p>
            <button 
              disabled={isLoading}
              onClick={handleResend}
              className="flex items-center gap-1.5 mx-auto text-[#22C55E] hover:text-[#4ADE80] font-bold text-sm transition-colors group disabled:opacity-30"
            >
              <span>Resend code</span>
              <RotateCcw size={14} className="group-hover:rotate-180 transition-transform duration-700" />
            </button>
          </div>
        </div>

        <div className="pt-6 min-[1920px]:pt-8 pb-8 min-[1920px]:pb-12 flex flex-col items-center gap-5 min-[1920px]:gap-6">
          <button
            onClick={onBack}
            disabled={isLoading}
            className="text-[10px] font-bold text-[#22C55E] uppercase tracking-[0.15em] hover:text-[#4ADE80] transition-colors disabled:opacity-30"
          >
            ← Back to Sign In
          </button>

          <button className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest hover:text-zinc-400 transition-colors">
            <HelpCircle size={14} className="text-zinc-700" />
            <span>Contact krifth Support</span>
          </button>
        </div>
      </div>
    </div>
  );
}
