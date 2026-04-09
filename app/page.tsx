"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import {
  ArrowRight,
  Lock,
  Zap,
  ChevronLeft,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import TectonicBackground from "@/app/components/tectonic-background";

type View = "login" | "register" | "recovery";

// --- Main Page Component ---

export default function LoginPage() {
  const [view, setView] = useState<View>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth action
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);

    if (view === "recovery") {
      alert("Recovery link sent to your identifier.");
      setView("login");
    } else if (view === "register") {
      alert("Registration request submitted for review.");
      setView("login");
    }
  };

  const renderForm = () => {
    switch (view) {
      case "login":
        return (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="space-y-6 md:space-y-8"
          >
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-display font-medium tracking-tight text-glow">Sign in to your shop</h2>
              <p className="text-on-surface-variant font-body text-sm opacity-60">Your smart AI helper is ready.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-2 relative group">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-display font-bold text-primary/60">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="name@yourstore.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full input-field py-3 pr-10 text-sm font-body outline-none placeholder:text-on-surface-variant/20"
                    />
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-primary/30 text-base font-light">@</span>
                  </div>
                </div>

                <div className="space-y-2 relative group">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-display font-bold text-primary/60">Password</label>
                    <button
                      type="button"
                      onClick={() => setView("recovery")}
                      className="text-[10px] font-bold text-on-surface-variant/40 hover:text-white transition-colors tracking-tighter"
                    >
                      FORGOT?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full input-field py-3 pr-10 text-sm font-body outline-none placeholder:text-on-surface-variant/20 tracking-widest"
                    />
                    <Lock className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary/20" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary-container via-primary to-tertiary text-on-primary font-display font-bold py-4 rounded-md shadow-[0_4px_20px_rgba(160,120,255,0.2)] hover:shadow-[0_4px_40px_rgba(160,120,255,0.4)] transition-all flex items-center justify-center disabled:opacity-70 disabled:pointer-events-none border-none group relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  style={{ skewX: -20 }}
                />
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                    <span className="relative">OPENING...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-base relative">
                    <span>ENTER MY SHOP</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>
            </form>

            <p className="text-center text-sm font-body text-on-surface-variant/60">
              New to Krifth?{" "}
              <button
                onClick={() => setView("register")}
                className="font-bold text-secondary hover:text-white transition-colors underline underline-offset-4 decoration-secondary/30"
              >
                Create your store
              </button>
            </p>
          </motion.div>
        );
      case "register":
        return (
          <motion.div
            key="register"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="space-y-6 md:space-y-8"
          >
            <div className="space-y-3">
              <button
                onClick={() => setView("login")}
                className="flex items-center gap-2 text-[10px] font-display font-bold text-primary mb-4"
              >
                <ChevronLeft className="w-4 h-4" /> BACK TO SIGN IN
              </button>
              <h2 className="text-2xl md:text-3xl font-display font-medium tracking-tight text-glow">Create your store</h2>
              <p className="text-on-surface-variant font-body text-sm opacity-60">Tell us about your brand to get started.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 relative group">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-display font-bold text-primary/60">Full Name</label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      required
                      className="w-full input-field py-3 text-sm font-body outline-none placeholder:text-on-surface-variant/20"
                    />
                  </div>

                  <div className="space-y-2 relative group">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-display font-bold text-primary/60">Email Address</label>
                    <input
                      type="email"
                      placeholder="jane@brand.com"
                      required
                      className="w-full input-field py-3 text-sm font-body outline-none placeholder:text-on-surface-variant/20"
                    />
                  </div>
                </div>

                <div className="space-y-2 relative group">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-display font-bold text-primary/60">Brand Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Culture"
                    required
                    className="w-full input-field py-3 text-sm font-body outline-none placeholder:text-on-surface-variant/20"
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2 relative group">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-display font-bold text-primary/60">What do you sell?</label>
                    <div className="relative">
                      <select
                        required
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full input-field py-3 text-sm font-body outline-none text-on-surface-variant/60 bg-transparent appearance-none"
                      >
                        <option value="" disabled>Select a category</option>
                        <option value="fashion">Fashion & Apparel</option>
                        <option value="electronics">Electronics</option>
                        <option value="digital">Digital Products</option>
                        <option value="beauty">Beauty & Health</option>
                        <option value="other">Other (Please specify)</option>
                      </select>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                        <ArrowRight className="w-4 h-4 rotate-90" />
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {category === "other" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 relative group overflow-hidden"
                      >
                        <label className="text-[10px] uppercase tracking-[0.2em] font-display font-bold text-secondary/60">Specify Category</label>
                        <input
                          type="text"
                          placeholder="e.g. Home Decor"
                          required
                          className="w-full input-field py-3 text-sm font-body outline-none placeholder:text-on-surface-variant/20 border-secondary/30 focus:border-secondary"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-2 relative group">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-display font-bold text-primary/60">Instagram / Website</label>
                  <input
                    type="text"
                    placeholder="@yourbrand"
                    className="w-full input-field py-3 text-sm font-body outline-none placeholder:text-on-surface-variant/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-tertiary text-on-primary font-display font-bold py-4 rounded-md shadow-lg transition-all flex items-center justify-center border-none"
              >
                {isLoading ? <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" /> : "CREATE MY STORE"}
              </button>
            </form>
          </motion.div>
        );
      case "recovery":
        return (
          <motion.div
            key="recovery"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="space-y-6 md:space-y-8"
          >
            <div className="space-y-3">
              <button
                onClick={() => setView("login")}
                className="flex items-center gap-2 text-[10px] font-display font-bold text-primary mb-4"
              >
                <ChevronLeft className="w-4 h-4" /> BACK TO SIGN IN
              </button>
              <h2 className="text-2xl md:text-3xl font-display font-medium tracking-tight text-glow">Access Recovery</h2>
              <p className="text-on-surface-variant font-body text-sm opacity-60">Reset your password to get back in.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2 relative group">
                <label className="text-[10px] uppercase tracking-[0.2em] font-display font-bold text-primary/60">Email Address</label>
                <input
                  type="email"
                  placeholder="name@krifth.ai"
                  required
                  className="w-full input-field py-3 text-sm font-body outline-none placeholder:text-on-surface-variant/20"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-tertiary text-on-primary font-display font-bold py-4 rounded-md shadow-lg transition-all flex items-center justify-center border-none"
              >
                {isLoading ? <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" /> : "RESET MY PASSWORD"}
              </button>
            </form>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30 selection:text-white font-body overflow-x-hidden">
      <TectonicBackground />

      {/* Header */}
      <header className="flex items-center justify-between px-6 lg:px-8 py-4 z-20">
        <div className="flex items-center gap-2">
          <span className="font-display text-lg font-bold tracking-tighter text-foreground uppercase">
            KRIFTH
            <motion.span 
              animate={{ opacity: [1, 0.4, 1] }} 
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-secondary"
            >
              .
            </motion.span>
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-6">
          <span className="text-[9px] font-display font-bold tracking-widest text-on-surface-variant/40 uppercase">New To Krifth?</span>
          <button
            onClick={() => setView("register")}
            className="bg-primary text-on-primary hover:opacity-90 px-4 py-1.5 rounded-md font-display font-bold tracking-tight transition-all text-xs shadow-[0_0_20px_rgba(208,188,255,0.2)]"
          >
            Create Account
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:grid lg:grid-cols-2 xl:grid-cols-[1.2fr_1fr] px-6 md:px-12 lg:px-8 xl:px-24 py-4 md:py-6 lg:py-8 relative gap-6 md:gap-8 lg:gap-4 xl:gap-6">
        {/* Narrative Section (Left / Top) */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col justify-center gap-4 md:gap-6 lg:gap-4 xl:gap-6 relative z-10"
        >
          <div className="space-y-4 md:space-y-5 lg:space-y-6">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-6xl xl:text-8xl font-display font-medium leading-[0.85] tracking-tighter uppercase"
            >
              Krifth <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-tertiary to-secondary opacity-80">Dashboard</span>
            </motion.h1>
 
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="max-w-[480px] text-sm md:text-base text-on-surface-variant/60 font-body leading-relaxed font-light"
            >
              The smart AI tool for creators and small brands. Handle your marketing, sales, and shipping all in one place.
            </motion.p>
 
            <div className="flex flex-wrap items-center gap-3">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-2 bg-surface-high/10 py-2 px-3 rounded-md border border-outline-variant/20 backdrop-blur-md"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_10px_var(--color-secondary)] animate-pulse" />
                <span className="text-[8px] font-display font-bold tracking-[0.2em] text-white/60 uppercase">All Systems: Good</span>
              </motion.div>
 
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex items-center gap-2 bg-primary/5 py-2 px-3 rounded-md border border-primary/20 backdrop-blur-md"
              >
                <Zap className="w-2.5 h-2.5 text-primary" />
                <span className="text-[8px] font-display font-bold tracking-[0.2em] text-primary uppercase">Smart Stats: Active</span>
              </motion.div>
            </div>
          </div>
 
          {/* AI Insight Widget & Brand Marquee */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="w-full max-w-[500px] flex flex-col gap-4 md:gap-5"
          >
            {/* AI Insight Card */}
            <div className="glass-card p-6 rounded-xl border border-outline-variant/10 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-display font-bold tracking-widest text-primary uppercase">Daily Shop Tips</span>
                <span className="text-[10px] font-display font-bold text-secondary">POPULAR NOW</span>
              </div>
              <div className="flex items-end gap-1 h-12">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 2 }}
                    animate={{ height: [2, 10 + Math.random() * 30, 2] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                    className="flex-1 bg-primary/20 rounded-t-[1px]"
                  />
                ))}
              </div>
              <p className="mt-4 text-[11px] text-on-surface-variant/60 font-body leading-relaxed">
                <span className="text-white font-bold">Selling Tip:</span> Customers are buying <span className="text-secondary">24% more</span>&nbsp;clothes this week. We&apos;ve updated your shipping options.
              </p>
            </div>

            {/* Brand Marquee */}
            <div className="overflow-hidden relative h-8 flex items-center">
              <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent z-10" />
              <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent z-10" />
              <motion.div
                animate={{ x: [0, -1000] }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="flex gap-12 whitespace-nowrap text-[10px] font-display font-bold tracking-[0.4em] text-on-surface-variant/20 uppercase"
              >
                <span>Apex Culture</span>
                <span>Nova Streetwear</span>
                <span>Flux Dynamics</span>
                <span>Core Operatives</span>
                <span>Zenith Goods</span>
                <span>Apex Culture</span>
                <span>Nova Streetwear</span>
                <span>Flux Dynamics</span>
                <span>Core Operatives</span>
                <span>Zenith Goods</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.section>

        {/* Interactive Section (Right / Bottom) */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center justify-center relative z-20 pb-12 lg:pb-0"
        >
          <div className="w-full max-w-[420px] xl:max-w-[460px] glass-card p-6 md:p-10 rounded-xl relative overflow-hidden group">
            {/* Card ambient internal glow */}
            <div className="absolute -top-[50%] -right-[50%] w-[100%] h-[100%] bg-primary/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-primary/10 transition-colors duration-500" />

            <AnimatePresence mode="wait">
              {renderForm()}
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex items-center gap-6 md:gap-10 mt-8 md:mt-10"
          >
            <div className="flex items-center gap-2 text-on-surface-variant/40 hover:text-on-surface-variant/60 transition-colors">
              <ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="text-[9px] md:text-[10px] font-display font-bold tracking-[0.3em] uppercase">Safe & Secure</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant/40 hover:text-on-surface-variant/60 transition-colors">
              <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="text-[9px] md:text-[10px] font-display font-bold tracking-[0.3em] uppercase">Trusted</span>
            </div>
          </motion.div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-3 lg:py-4 z-20 border-t border-outline-variant/10 mt-auto bg-background/50 backdrop-blur-md gap-2 lg:gap-0">
        <span className="text-[9px] md:text-[10px] font-display font-bold tracking-[0.2em] text-on-surface-variant/40 uppercase text-center md:text-left">
          &copy; 2026 Kрифth. The Better Way to Sell.
        </span>
        <div className="flex gap-6 md:gap-8 text-[9px] md:text-[10px] font-display font-bold tracking-[0.2em] text-on-surface-variant/60 uppercase">
          <button className="hover:text-primary transition-colors">Privacy</button>
          <button className="hover:text-primary transition-colors">Terms</button>
          <button className="hover:text-primary transition-colors">Support</button>
        </div>
      </footer>

      <style jsx global>{`
        .input-field {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--color-primary);
          border-radius: 10px;
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}



