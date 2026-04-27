"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Lock,
  ShieldCheck,
  History,
  Camera,
  CheckCircle2,
  CreditCard,
  Trash2,
  Plus,
  ShieldAlert
} from "lucide-react";

export function AccountView() {
  const [activeTab, setActiveTab] = useState("Profile Information");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  return (
    <div className="flex-1 px-4 sm:px-8 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-gray-200 mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {["Profile Information", "Update Payment Method"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-semibold transition-all relative ${activeTab === tab ? "text-[#22C55E]" : "text-gray-400 hover:text-gray-600"
              }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#22C55E]"
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "Profile Information" ? (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-6">
              <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-50">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Profile Details</h3>
                  <p className="text-sm text-gray-500 font-medium">
                    Update your shop's primary contact information and branding identity.
                  </p>
                </div>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">
                        Username
                      </label>
                      <input
                        type="text"
                        placeholder="degali"
                        autoComplete="off"
                        className="w-full px-5 py-3 bg-white border border-gray-100 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#22C55E] transition-all shadow-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">
                        Brand Name
                      </label>
                      <input
                        type="text"
                        placeholder="kRiTH Test Shop"
                        autoComplete="off"
                        className="w-full px-5 py-3 bg-white border border-gray-100 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#22C55E] transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        placeholder="0543772852"
                        autoComplete="off"
                        className="w-full px-5 py-3 bg-white border border-gray-100 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#22C55E] transition-all shadow-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="cephyosms@gmail.com"
                        autoComplete="off"
                        className="w-full px-5 py-3 bg-white border border-gray-100 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#22C55E] transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="pt-8 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => setIsPasswordModalOpen(true)}
                      className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors px-2"
                    >
                      <Lock size={16} />
                      Update Password
                    </button>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <button
                        type="button"
                        className="flex-1 sm:flex-none px-8 py-3.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 sm:flex-none px-8 py-3.5 bg-[#22C55E] text-white rounded-xl text-sm font-bold shadow-lg shadow-green-200 hover:bg-[#16A34A] transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </form>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-8">
              {/* User Profile Card */}
              <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-2xl bg-gray-50 flex items-center justify-center shadow-inner ring-4 ring-gray-50 text-gray-300">
                    <User size={48} />
                  </div>
                  <button className="absolute -right-2 -bottom-2 w-9 h-9 bg-white border border-gray-100 rounded-xl shadow-lg flex items-center justify-center text-gray-500 hover:text-[#22C55E] transition-colors">
                    <Camera size={18} />
                  </button>
                </div>

                <h4 className="text-lg font-bold text-gray-900 mb-1">Alex Rivera</h4>
                <p className="text-xs text-gray-400 font-semibold mb-4">Administrator</p>

                <span className="px-4 py-1 bg-green-50 text-[#22C55E] rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Active Account
                </span>
              </section>

              {/* Security Status Card */}
              <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                    <ShieldCheck size={18} />
                  </div>
                  <h4 className="text-base font-bold text-gray-900">Security Status</h4>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="mt-1">
                      <CheckCircle2 size={16} className="text-[#22C55E]" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-gray-900">Two-Factor Authentication</h5>
                      <p className="text-[10px] text-gray-400 font-semibold mt-1">Enabled via Email OTP</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="mt-1">
                      <History size={16} className="text-gray-400" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-gray-900">Last Login</h5>
                      <p className="text-[10px] text-gray-400 font-semibold mt-1 leading-relaxed">
                        Today at 09:42 AM from Mac OS
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </aside>
          </motion.div>
        ) : (
          <motion.div
            key="payment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Left Column: Saved Cards & Current Plan */}
            <div className="lg:col-span-4 space-y-4">
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Saved Cards</h4>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative group overflow-hidden">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-7 bg-gray-50 rounded-md border border-gray-100 flex items-center justify-center">
                      <CreditCard size={16} className="text-gray-400" />
                    </div>
                    <span className="px-2 py-1 bg-green-50 text-[#22C55E] text-[9px] font-black uppercase tracking-wider rounded-md">Primary</span>
                  </div>
                  <p className="text-base font-bold text-gray-900 tracking-[0.15em] mb-1">•••• •••• •••• 1234</p>
                  <p className="text-xs text-gray-400 font-semibold mb-4">Expires 12/26</p>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <span className="text-sm font-bold text-gray-700">Alex Rivera</span>
                    <button className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1.5 transition-colors">
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              {/* Current Plan Card */}
              <div className="bg-gradient-to-br from-[#22C55E] to-[#16A34A] rounded-2xl p-5 text-white shadow-lg shadow-green-100 relative overflow-hidden group">
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80 mb-2">Current Plan</p>
                  <h3 className="text-xl font-black mb-1">Growth Plan</h3>
                  <p className="text-xs font-bold text-white/90">$10.00 / billed monthly</p>
                </div>

                {/* Decorative Pattern */}
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <CheckCircle2 size={120} strokeWidth={1} />
                </div>
              </div>
            </div>

            {/* Right Column: Add Payment Method Form */}
            <div className="lg:col-span-8">
              <section className="bg-white rounded-[24px] p-6 sm:p-8 border border-gray-50 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-xl font-black text-gray-900 mb-1">Add New Payment Method</h3>
                  <p className="text-sm text-gray-500 font-medium">Securely add a new card to your account for future billing cycles.</p>
                </div>

                <form className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Alex Rivera"
                      className="w-full py-3 px-5 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#22C55E]/30 focus:ring-4 focus:ring-[#22C55E]/5 transition-all text-sm font-bold text-gray-900 placeholder:text-gray-300"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        className="w-full py-3 px-5 pr-12 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#22C55E]/30 focus:ring-4 focus:ring-[#22C55E]/5 transition-all text-sm font-bold text-gray-900 placeholder:text-gray-300 tracking-widest"
                      />
                      <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Expiration Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full py-3 px-5 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#22C55E]/30 focus:ring-4 focus:ring-[#22C55E]/5 transition-all text-sm font-bold text-gray-900 placeholder:text-gray-300"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">CVC</label>
                      <input
                        type="text"
                        placeholder="•••"
                        className="w-full py-3 px-5 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#22C55E]/30 focus:ring-4 focus:ring-[#22C55E]/5 transition-all text-sm font-bold text-gray-900 placeholder:text-gray-300"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer group py-2">
                    <div className="relative flex items-center justify-center">
                      <input type="checkbox" className="peer sr-only" />
                      <div className="w-5 h-5 border-2 border-gray-200 rounded-md peer-checked:bg-[#22C55E] peer-checked:border-[#22C55E] transition-all"></div>
                      <CheckCircle2 size={12} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={4} />
                    </div>
                    <span className="text-sm font-bold text-gray-500 group-hover:text-gray-700 transition-colors">Set as primary payment method</span>
                  </label>

                  <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-50">
                    <button
                      type="button"
                      className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#22C55E] text-white rounded-xl text-sm font-bold shadow-lg shadow-green-100 hover:bg-[#16A34A] transition-all"
                    >
                      Save Payment Method
                    </button>
                  </div>
                </form>
              </section>

              <div className="mt-4 flex items-center justify-center gap-2 text-gray-400">
                <ShieldAlert size={16} className="text-[#22C55E]" />
                <p className="text-[10px] font-bold leading-relaxed max-w-md">
                  Your payment information is encrypted and securely processed. KRIFTH never stores your full card number on our servers.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Password Update Modal */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPasswordModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100"
            >
              <div className="mb-8">
                <h3 className="text-2xl font-black text-gray-900 mb-2">Update Password</h3>
                <p className="text-sm text-gray-500 font-medium">Ensure your account is using a long, random password to stay secure.</p>
              </div>

              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsPasswordModalOpen(false); }}>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full py-3 px-5 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#22C55E]/30 focus:ring-4 focus:ring-[#22C55E]/5 transition-all text-sm font-bold text-gray-900 placeholder:text-gray-300"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full py-3 px-5 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#22C55E]/30 focus:ring-4 focus:ring-[#22C55E]/5 transition-all text-sm font-bold text-gray-900 placeholder:text-gray-300"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full py-3 px-5 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#22C55E]/30 focus:ring-4 focus:ring-[#22C55E]/5 transition-all text-sm font-bold text-gray-900 placeholder:text-gray-300"
                  />
                </div>

                <div className="pt-6 flex items-center justify-end gap-3 border-t border-gray-50 mt-8">
                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#22C55E] text-white rounded-xl text-sm font-bold shadow-lg shadow-green-100 hover:bg-[#16A34A] transition-all"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
