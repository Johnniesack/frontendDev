"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Users,
  Search,
  ChevronDown,
  Mail,
  Shield,
  Trash2,
  Edit2,
  CheckCircle2,
  X,
  ArrowRight
} from "lucide-react";

interface Personnel {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Staff";
  status: "Active" | "Pending" | "Inactive";
  joinedDate: string;
}

const MOCK_PERSONNEL: Personnel[] = [
  { id: "1", name: "Alex Rivera", email: "alex@krifth.com", role: "Admin", status: "Active", joinedDate: "Jan 12, 2024" },
  { id: "2", name: "Sarah Chen", email: "sarah.c@krifth.com", role: "Manager", status: "Active", joinedDate: "Feb 05, 2024" },
  { id: "3", name: "Marcus Johnson", email: "marcus@krifth.com", role: "Staff", status: "Pending", joinedDate: "Mar 20, 2024" },
  { id: "4", name: "Elena Rodriguez", email: "elena@krifth.com", role: "Staff", status: "Active", joinedDate: "Apr 02, 2024" },
];

const ROLES = ["Admin", "Manager", "Staff"];

export function PersonnelView() {
  const [personnel, setPersonnel] = useState<Personnel[]>(MOCK_PERSONNEL);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Personnel | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Staff" as Personnel["role"],
  });

  const filteredPersonnel = personnel.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = 
      activeTab === "All" || 
      (activeTab === "Admins" && p.role === "Admin") || 
      (activeTab === "Staff" && p.role === "Staff");

    return matchesSearch && matchesTab;
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember) {
      setPersonnel(prev => prev.map(p => p.id === editingMember.id ? { ...p, ...formData } : p));
    } else {
      const newMember: Personnel = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        status: "Active",
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
      };
      setPersonnel(prev => [newMember, ...prev]);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
    setFormData({ name: "", email: "", role: "Staff" });
  };

  const openEdit = (member: Personnel) => {
    setEditingMember(member);
    setFormData({ name: member.name, email: member.email, role: member.role });
    setIsModalOpen(true);
  };

  const handleDelete = () => {
    if (isDeletingId) {
      setPersonnel(prev => prev.filter(p => p.id !== isDeletingId));
      setIsDeletingId(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen animate-in fade-in duration-500">
      {/* ─── Integrated Header ─── */}
      <div className="px-4 sm:px-8 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-30 gap-4">
        <div className="flex items-center justify-between sm:justify-start gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-900">
              <Users size={15} strokeWidth={2.5} />
            </div>
            <span className="text-sm font-black text-gray-900 tracking-tight">Personnel</span>
          </div>
          <div className="h-4 w-px bg-gray-200 hidden sm:block" />
          <div className="flex items-center gap-4">
            {["All", "Admins", "Staff"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === tab ? "text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative group flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors" size={14} />
            <input
              type="text"
              placeholder="Search team..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-gray-200 transition-all w-full sm:w-48 lg:w-64"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all sm:w-auto shadow-lg shadow-gray-200 shrink-0"
          >
            <div className="w-5 h-5 rounded-lg bg-white/10 flex items-center justify-center">
              <Plus size={14} strokeWidth={3} />
            </div>
            <span className="hidden sm:inline">Add Personnel</span>
            <span className="sm:hidden">Add</span>
          </motion.button>
        </div>
      </div>

      {/* ─── Hero Stats Bar ─── */}
      <div className="px-4 sm:px-8 py-6 sm:py-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 border-b border-gray-50 bg-gray-50/30">
        {[
          { label: "Total Team", value: personnel.length, icon: Users, color: "text-gray-900" },
          { label: "Active Access", value: personnel.filter(p => p.status === "Active").length, icon: CheckCircle2, color: "text-[#22C55E]" },
          { label: "Administrators", value: personnel.filter(p => p.role === "Admin").length, icon: Shield, color: "text-purple-600" },
          { label: "Pending Invites", value: personnel.filter(p => p.status === "Pending").length, icon: Mail, color: "text-orange-500" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 sm:p-5 bg-white border border-gray-100 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center ${stat.color} group-hover:bg-white transition-colors`}>
                  <Icon size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{stat.label}</p>
                  <p className="text-xl font-black text-gray-900 leading-none">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ─── High-Density Content ─── */}
      <div className="flex-1 px-4 sm:px-8 py-6">
        <div className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.01)]">
          
          {/* Desktop Table (Hidden on Mobile) */}
          <div className="hidden lg:block overflow-x-auto scrollbar-hide">
            <table className="w-full text-left table-fixed">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="w-[35%] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-400">Team Member</th>
                  <th className="w-[15%] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-400">Role</th>
                  <th className="w-[15%] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-400">Status</th>
                  <th className="w-[15%] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-400">Joined</th>
                  <th className="w-[10%] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-400 text-right pr-10">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredPersonnel.map((member) => (
                  <tr key={member.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 text-[10px] font-bold group-hover:bg-gray-200 transition-colors">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-semibold text-gray-900 truncate">{member.name}</span>
                          <span className="text-[10px] text-gray-400 truncate">{member.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-2.5 py-1 bg-gray-100 text-[10px] font-black rounded-lg border border-gray-100 uppercase tracking-wider ${member.role === 'Admin' ? 'text-purple-600' : member.role === 'Manager' ? 'text-blue-600' : 'text-gray-600'}`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${member.status === "Active" ? "bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-orange-400"}`} />
                        <span className={`text-xs font-black ${member.status === "Active" ? "text-gray-900" : "text-gray-400 uppercase tracking-widest"}`}>{member.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-bold text-gray-500">{member.joinedDate}</span>
                    </td>
                    <td className="px-6 py-5 text-right pr-10">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(member)}
                          className="p-2 text-gray-400 hover:text-gray-900 hover:bg-white rounded-xl shadow-sm transition-all border border-transparent hover:border-gray-100"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => setIsDeletingId(member.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Card List (Visible on smaller screens) */}
          <div className="block lg:hidden space-y-3 p-4 bg-gray-50/30">
            {filteredPersonnel.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="p-5 space-y-4 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 text-[10px] font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">{member.name}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5 truncate">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className={`w-2 h-2 rounded-full ${member.status === "Active" ? "bg-[#22C55E]" : "bg-orange-400"}`} />
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-lg text-[8px] font-black uppercase tracking-wider border border-gray-100">
                      {member.role}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(member)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-100 rounded-xl text-xs font-black transition-all active:scale-[0.98]"
                  >
                    <Edit2 size={14} />
                    Edit Member
                  </button>
                  <button
                    onClick={() => setIsDeletingId(member.id)}
                    className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-500 rounded-xl border border-red-100 transition-all active:scale-[0.98]"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeModal} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div 
              initial={{ y: "100%", opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }} 
              transition={{ type: "spring", damping: 32, stiffness: 350 }}
              className="relative w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl border border-gray-100 flex flex-col max-h-[92vh] overflow-hidden"
            >
              {/* Mobile Handle */}
              <div className="sm:hidden flex justify-center py-3 shrink-0">
                <div className="w-10 h-1.5 bg-gray-200 rounded-full" />
              </div>

              {/* Modal Header - Fixed */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 px-5 sm:px-8 py-6 sm:py-8 relative overflow-hidden shrink-0 rounded-t-[32px] sm:rounded-t-none">
                <div className="absolute -right-8 -bottom-8 opacity-10 rotate-12">
                  <Users size={160} strokeWidth={1} className="text-white" />
                </div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                    {editingMember ? <Edit2 size={22} strokeWidth={2.5} /> : <Plus size={22} strokeWidth={3} />}
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">{editingMember ? "Edit Personnel" : "New Personnel"}</h3>
                    <p className="text-[10px] text-white/60 font-medium tracking-wide">Configure access & permissions</p>
                  </div>
                  <button onClick={closeModal} className="ml-auto w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                    <Plus size={18} className="rotate-45" />
                  </button>
                </div>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto scrollbar-hide px-6 sm:px-8 py-6 sm:py-8">
                <form id="personnel-form" onSubmit={handleSave} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Full Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full py-4 px-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 text-base font-bold text-gray-900 placeholder:text-gray-300 outline-none transition-all" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Email Address</label>
                    <input 
                      required
                      type="email" 
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full py-4 px-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 text-base font-bold text-gray-900 placeholder:text-gray-300 outline-none transition-all" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Assigned Role</label>
                    <div className="relative group">
                      <select 
                        value={formData.role}
                        onChange={e => setFormData({ ...formData, role: e.target.value as Personnel["role"] })}
                        className="w-full py-4 px-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 text-base font-bold text-gray-900 outline-none transition-all appearance-none cursor-pointer"
                      >
                        {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-gray-900 transition-colors" />
                    </div>
                  </div>
                  <div className="pt-4 flex flex-col gap-2 pb-8">
                    <motion.button 
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      form="personnel-form"
                      type="submit"
                      className="w-full py-4 bg-gray-900 text-white rounded-2xl text-sm font-black hover:bg-black transition-all shadow-xl shadow-gray-200"
                    >
                      {editingMember ? "Update Member" : "Invite Member"}
                    </motion.button>
                    <button type="button" onClick={closeModal} className="w-full py-3 text-gray-400 hover:text-gray-700 text-sm font-bold transition-colors">Discard Changes</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {isDeletingId && (
          <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsDeletingId(null)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div 
              initial={{ y: "100%", opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              className="relative w-full max-w-sm bg-white rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl border border-gray-100 p-8 text-center pb-10 sm:pb-8"
            >
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trash2 size={28} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Remove Access?</h3>
              <p className="text-sm text-gray-400 font-bold mb-8 leading-relaxed">
                This will revoke all access for this personnel member. This action cannot be undone.
              </p>
              <div className="flex flex-col gap-3">
                <button onClick={handleDelete} className="w-full py-4 bg-red-500 text-white rounded-2xl text-sm font-black hover:bg-red-600 transition-all">Yes, Remove Access</button>
                <button onClick={() => setIsDeletingId(null)} className="w-full py-3 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
