"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PlayCircle, 
  ChevronDown, 
  HelpCircle, 
  ExternalLink,
  BookOpen,
  MessageSquare,
  Zap,
  ArrowRight
} from "lucide-react";

interface Tutorial {
  id: string;
  title: string;
  url: string;
  category: string;
  duration?: string;
}

const TUTORIALS: Tutorial[] = [
  {
    id: "1",
    title: "How to setup shop link",
    url: "https://www.youtube.com",
    category: "Getting Started",
    duration: "2:45"
  },
  {
    id: "2",
    title: "How to add external links to your shop",
    url: "https://www.youtube.com",
    category: "Customization",
    duration: "3:12"
  },
  {
    id: "3",
    title: "Managing your inventory like a pro",
    url: "https://www.youtube.com",
    category: "Operations",
    duration: "5:20"
  },
  {
    id: "4",
    title: "Setting up custom shipping zones",
    url: "https://www.youtube.com",
    category: "Shipping",
    duration: "4:15"
  },
  {
    id: "5",
    title: "Understanding analytics dashboard",
    url: "https://www.youtube.com",
    category: "Operations",
    duration: "6:30"
  }
];

export function TutorialsView() {
  const [expanded, setExpanded] = useState<string | null>("Getting Started");

  const categories = Array.from(new Set(TUTORIALS.map(t => t.category)));

  const STATS = [
    { label: "Total Guides", value: "24", icon: BookOpen, color: "#64748b", bg: "#f1f5f9" },
    { label: "Video Minutes", value: "128", icon: PlayCircle, color: "#64748b", bg: "#f1f5f9" },
    { label: "New Updates", value: "3", icon: Zap, color: "#22c55e", bg: "#f0fdf4" },
  ];

  return (
    <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-12 flex flex-col gap-6 min-w-0">
      
      {/* Integrated Header */}
      <div className="px-4 sm:px-8 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-900">
            <HelpCircle size={15} strokeWidth={2.5} />
          </div>
          <span className="text-sm font-black text-gray-900 tracking-tight">Tutorials & Guides</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {STATS.map((s, i) => (
          <motion.div 
            key={s.label} 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`bg-white rounded-2xl px-4 py-4 flex items-center gap-3 shadow-sm border border-gray-100 ${i === 2 ? "col-span-2 lg:col-span-1" : ""}`}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
              <s.icon size={18} color={s.color} strokeWidth={2} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">{s.label}</p>
              <p className="text-lg font-black text-gray-900 leading-none">{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Categories Accordion */}
      <div className="flex flex-col gap-3">
        {categories.map((cat, idx) => {
          const isExpanded = expanded === cat;
          const catTutorials = TUTORIALS.filter(t => t.category === cat);
          
          return (
            <motion.div 
              key={cat}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.05 }}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            >
              <button
                onClick={() => setExpanded(isExpanded ? null : cat)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isExpanded ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-400"}`}>
                    <BookOpen size={14} strokeWidth={2.5} />
                  </div>
                  <span className="text-sm font-black text-gray-900 tracking-tight">{cat}</span>
                  <span className="px-1.5 py-0.5 rounded-md bg-gray-100 text-[10px] font-black text-gray-400 uppercase">
                    {catTutorials.length} Videos
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  className="text-gray-400"
                >
                  <ChevronDown size={16} strokeWidth={2.5} />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <div className="px-5 pb-5 pt-1 divide-y divide-gray-50">
                      {catTutorials.map((t) => (
                        <a
                          key={t.id}
                          href={t.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between py-3 group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-gray-900 group-hover:text-white transition-all shadow-inner-sm">
                              <PlayCircle size={16} strokeWidth={2} />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors">
                                {t.title}
                              </h4>
                              {t.duration && (
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                                  Duration: {t.duration}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 group-hover:text-gray-900 group-hover:bg-gray-50 transition-all">
                            <ExternalLink size={14} />
                          </div>
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Support Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
          className="relative bg-gray-900 rounded-2xl p-6 overflow-hidden"
        >
          <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none">
            <MessageSquare size={120} strokeWidth={1} className="text-white translate-x-4 translate-y-4" />
          </div>
          <div className="relative z-10">
            <p className="text-white font-black text-lg mb-2 leading-tight">Need Direct Support?</p>
            <p className="text-white/60 text-xs font-medium leading-relaxed mb-6 max-w-[240px]">
              Our team is available 24/7 to help you with technical setup and configurations.
            </p>
            <button className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-xl text-xs font-black hover:bg-gray-100 transition-all shadow-xl shadow-black/20">
              Contact Support
              <ArrowRight size={14} strokeWidth={3} />
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
              <BookOpen size={18} strokeWidth={2.5} />
            </div>
            <p className="text-sm font-black text-gray-900 mb-2">Knowledge Base</p>
            <p className="text-xs font-medium text-gray-500 leading-relaxed mb-6">
              Browse our extensive documentation for in-depth articles on every feature.
            </p>
          </div>
          <button className="text-xs font-black text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors group">
            Open Documentation
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
