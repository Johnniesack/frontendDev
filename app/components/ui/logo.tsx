import React from "react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center select-none ${className}`}>
      <span className="font-head text-2xl font-bold tracking-tight text-white">
        Krifth<span className="text-[#22C55E]">.</span>
      </span>
    </div>
  );
}

export function SquareLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`w-10 h-10 rounded-lg bg-brand flex items-center justify-center ${className}`}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-black"
      >
        <path
          d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
