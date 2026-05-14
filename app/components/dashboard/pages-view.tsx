"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Wrench,
  PenLine,
  X,
  ExternalLink,
  ChevronDown,
  FileText,
  Trash2,
  Link as LinkIcon,
  Search,
  Eye,
  EyeOff,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Monitor,
  Smartphone,
} from "lucide-react";

type PageType = "blank_canvas" | "link";

interface Page {
  id: string;
  name: string;
  slug: string;
  type: PageType;
  url?: string;
  isVisible: boolean;
  content?: string;
}

const MOCK_PAGES: Page[] = [
  { id: "1", name: "Trials", slug: "/Trials", type: "blank_canvas", isVisible: true, content: "Welcome to the Trials page. This is where you can find all our upcoming trial drops." },
  { id: "2", name: "LockScreen", slug: "/LockScreen", type: "blank_canvas", isVisible: true, content: "" },
  { id: "3", name: "Collections", slug: "/Collections", type: "blank_canvas", isVisible: false, content: "" },
  { id: "4", name: "Instagram", slug: "/Instagram", type: "link", url: "https://instagram.com/krifth", isVisible: true },
];

const brandColor = "#22C55E";

export function PagesView() {
  const [pages, setPages] = useState<Page[]>(MOCK_PAGES);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "blank_canvas" | "link">("all");
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [pageName, setPageName] = useState("");
  const [pageType, setPageType] = useState<PageType>("blank_canvas");
  const [pageUrl, setPageUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Tools Modal State
  const [toolsPage, setToolsPage] = useState<Page | null>(null);
  const [toolsActiveTab, setToolsActiveTab] = useState<"general" | "advanced">("general");
  const [toolsData, setToolsData] = useState<{
    name: string;
    slug: string;
    url: string;
    visibility: string;
    isHome: string;
  }>({ name: "", slug: "", url: "", visibility: "Visible", isHome: "No" });

  // Edit Content Modal State
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [editorContent, setEditorContent] = useState("");
  const [deviceView, setDeviceView] = useState<"desktop" | "mobile">("desktop");

  // Advanced Tab Accordion State
  const [openAccordion, setOpenAccordion] = useState<string | null>("html");

  const filteredPages = pages.filter((page) => {
    const matchesSearch =
      page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || page.type === filterType;
    return matchesSearch && matchesType;
  });

  const resetForm = () => {
    setPageName("");
    setPageType("blank_canvas");
    setPageUrl("");
  };

  const handleSave = async () => {
    if (!pageName.trim()) return;
    if (pageType === "link" && !pageUrl.trim()) return;

    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 900));

    const slug = "/" + pageName.trim().replace(/\s+/g, "");
    const newPage: Page = {
      id: Math.random().toString(36).slice(2),
      name: pageName.trim(),
      slug,
      type: pageType,
      url: pageType === "link" ? pageUrl.trim() : undefined,
      isVisible: true,
      content: "",
    };
    setPages((prev) => [newPage, ...prev]);
    setIsSaving(false);
    setShowModal(false);
    resetForm();
  };

  const deletePage = (id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
  };

  const openTools = (page: Page) => {
    setToolsPage(page);
    setToolsActiveTab("general");
    setToolsData({
      name: page.name,
      slug: page.slug,
      url: page.url || "",
      visibility: page.isVisible ? "Visible" : "Not Yet",
      isHome: "No",
    });
  };

  const saveTools = async () => {
    if (!toolsPage) return;
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setPages(prev => prev.map(p => 
      p.id === toolsPage.id 
        ? { ...p, name: toolsData.name, slug: toolsData.slug, url: toolsData.url || p.url, isVisible: toolsData.visibility === "Visible" }
        : p
    ));
    setIsSaving(false);
    setToolsPage(null);
  };

  const openEditor = (page: Page) => {
    setEditingPage(page);
    setEditorContent(page.content || "");
  };

  const saveEditorContent = async () => {
    if (!editingPage) return;
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setPages(prev => prev.map(p => 
      p.id === editingPage.id ? { ...p, content: editorContent } : p
    ));
    setIsSaving(false);
    setEditingPage(null);
  };

  return (
    <div className="flex-1 px-4 sm:px-8 pt-4 sm:pt-6 pb-8 animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto space-y-6">

      {/* ─── Integrated Header ─── */}
      <div className="px-4 sm:px-8 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-30 gap-4">
        <div className="flex items-center justify-between sm:justify-start gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-900">
              <FileText size={15} strokeWidth={2.5} />
            </div>
            <span className="text-sm font-black text-gray-900 tracking-tight">Pages</span>
          </div>
          <div className="h-4 w-px bg-gray-200 hidden sm:block" />
          <div className="flex items-center gap-4">
            {["all", "blank_canvas", "link"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type as any)}
                className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors ${filterType === type ? "text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
              >
                {type === 'all' ? 'All' : type === 'blank_canvas' ? 'Canvas' : 'Links'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative group flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors" size={14} />
            <input
              type="text"
              placeholder="Search pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-gray-200 transition-all w-full sm:w-48 lg:w-64"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#22C55E] text-white rounded-xl text-xs font-bold hover:bg-[#16A34A] transition-all sm:w-auto shadow-lg shadow-emerald-500/20 shrink-0"
          >
            <div className="w-5 h-5 rounded-lg bg-white/10 flex items-center justify-center">
              <Plus size={14} strokeWidth={3} />
            </div>
            <span className="hidden sm:inline">Add Page</span>
            <span className="sm:hidden">Add</span>
          </motion.button>
        </div>
      </div>

        {/* ─── Premium Grid Content ─── */}
        <div className="flex-1 px-4 sm:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
            <AnimatePresence mode="popLayout">
              {filteredPages.map((page, index) => (
                <motion.div
                  layout
                  key={page.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.04 }}
                  className="group bg-white rounded-xl p-5 border border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-gray-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-gray-900 group-hover:text-white transition-all shadow-sm">
                        {page.type === "link" ? <LinkIcon size={20} /> : <FileText size={20} />}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-[15px] font-black text-gray-900 truncate mb-0.5">{page.name}</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">
                          {page.type === "link" ? page.url : `/${page.slug}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className={`w-2 h-2 rounded-full ${page.isVisible ? "bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.3)]" : "bg-gray-300"}`} />
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-lg text-[8px] font-black uppercase tracking-wider border border-gray-100">
                        {page.type === "link" ? "External" : "Canvas"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                    {page.type === "blank_canvas" && (
                      <button
                        onClick={() => openEditor(page)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#22C55E] text-white rounded-xl text-[11px] font-black transition-all active:scale-[0.98] shadow-sm shadow-emerald-500/10"
                      >
                        <PenLine size={13} />
                        Edit Content
                      </button>
                    )}
                    <button
                      onClick={() => openTools(page)}
                      className={`flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-100 rounded-xl text-[11px] font-black text-gray-600 transition-all hover:bg-gray-50 active:scale-[0.98] ${page.type === 'link' ? 'flex-1' : 'w-11'}`}
                    >
                      <Wrench size={13} />
                      {page.type === 'link' && "Configure"}
                    </button>
                    <button
                      onClick={() => deletePage(page.id)}
                      className="w-11 h-11 flex items-center justify-center bg-white text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-100 transition-all active:scale-[0.98]"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredPages.length === 0 && (
              <div className="col-span-full py-24 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 mb-6">
                  <FileText size={32} strokeWidth={1} />
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-2">No pages found</h3>
                <p className="text-sm text-gray-500 font-medium max-w-xs mx-auto mb-8">
                  {searchQuery
                    ? "We couldn't find any pages matching your search."
                    : "Add your first page to build out your storefront navigation."}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(""); setFilterType("all"); }}
                    className="text-sm font-bold hover:underline"
                    style={{ color: brandColor }}
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Add Page Modal ── */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowModal(false); resetForm(); }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden border border-gray-100 max-h-[92vh] overflow-y-auto scrollbar-hide"
            >
              <div className="p-0">
                {/* Premium Header with Gradient */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 px-5 sm:px-8 py-6 sm:py-10 relative overflow-hidden rounded-t-[32px]">
                  <div className="absolute -right-8 -bottom-8 opacity-10 rotate-12">
                    <FileText size={160} strokeWidth={1} className="text-white" />
                  </div>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                      <Plus size={24} strokeWidth={3} />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-3xl font-black text-white leading-tight">Create Page</h3>
                      <p className="text-[10px] sm:text-sm text-white/60 font-medium tracking-wide">Configuration</p>
                    </div>
                    <button onClick={() => { setShowModal(false); resetForm(); }} className="ml-auto w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                      <Plus size={18} className="rotate-45" />
                    </button>
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1 block">Page Name</label>
                      <input
                        type="text"
                        placeholder="e.g. About Us"
                        value={pageName}
                        onChange={(e) => setPageName(e.target.value)}
                        className="w-full py-4 px-5 bg-gray-50 border border-transparent focus:bg-white focus:border-[#22C55E]/30 text-sm font-bold text-gray-900 placeholder:text-gray-300 outline-none transition-all rounded-2xl"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1 block">Type</label>
                        <div className="relative group">
                          <select
                            value={pageType}
                            onChange={(e) => setPageType(e.target.value as PageType)}
                            className="w-full py-4 px-5 bg-gray-50 border border-transparent focus:bg-white focus:border-[#22C55E]/30 text-sm font-bold text-gray-900 appearance-none transition-all cursor-pointer rounded-2xl outline-none"
                          >
                            <option value="blank_canvas">Blank Canvas</option>
                            <option value="link">Link</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-[#22C55E] transition-colors" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1 block">Visibility</label>
                        <div className="relative group">
                          <select
                            className="w-full py-4 px-5 bg-gray-50 border border-transparent focus:bg-white focus:border-[#22C55E]/30 text-sm font-bold text-gray-900 appearance-none transition-all cursor-pointer rounded-2xl outline-none"
                          >
                            <option>Visible</option>
                            <option>Draft</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-[#22C55E] transition-colors" />
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {pageType === "link" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2 overflow-hidden"
                        >
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1 block">External URL</label>
                          <input
                            type="url"
                            placeholder="https://instagram.com/..."
                            value={pageUrl}
                            onChange={(e) => setPageUrl(e.target.value)}
                            className="w-full py-4 px-5 bg-gray-50 border border-transparent focus:bg-white focus:border-[#22C55E]/30 text-sm font-bold text-gray-900 placeholder:text-gray-300 outline-none transition-all rounded-2xl"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex flex-col items-center gap-3 pt-6 border-t border-gray-50">
                    <button onClick={() => { setShowModal(false); resetForm(); }} className="w-full py-4 text-gray-400 hover:text-gray-700 text-sm font-bold transition-colors">Discard</button>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSave}
                      disabled={isSaving || !pageName.trim() || (pageType === "link" && !pageUrl.trim())}
                      className="w-full py-4 bg-[#22C55E] text-white rounded-2xl text-sm font-bold hover:bg-[#16A34A] transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-30"
                    >
                      {isSaving ? "Saving..." : "Create Page"}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Tools Modal ── */}
      <AnimatePresence>
        {toolsPage && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setToolsPage(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 24 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="relative w-full max-w-md bg-white rounded-[32px] overflow-hidden shadow-2xl"
            >
                {/* Premium Header with Gradient */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 px-5 sm:px-8 py-6 relative overflow-hidden rounded-t-[32px] sm:rounded-t-none">
                  <div className="absolute -right-8 -bottom-8 opacity-10 rotate-12">
                    <Wrench size={160} strokeWidth={1} className="text-white" />
                  </div>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                      <Wrench size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white leading-tight">Page Tools</h3>
                      <p className="text-[10px] text-white/60 font-medium tracking-wide">Configuration</p>
                    </div>
                    <button onClick={() => setToolsPage(null)} className="ml-auto w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                      <Plus size={18} className="rotate-45" />
                    </button>
                  </div>
                </div>

              {/* Modal Tabs */}
              <div className="flex px-8 pt-4 border-b border-gray-100 gap-6">
                <button
                  onClick={() => setToolsActiveTab("general")}
                  className={`pb-4 text-sm font-bold transition-all relative ${toolsActiveTab === "general" ? "text-[#22C55E]" : "text-gray-400 hover:text-gray-600"}`}
                >
                  General
                  {toolsActiveTab === "general" && (
                    <motion.div layoutId="toolsTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#22C55E] rounded-t-full" />
                  )}
                </button>
                <button
                  onClick={() => setToolsActiveTab("advanced")}
                  className={`pb-4 text-sm font-bold transition-all relative ${toolsActiveTab === "advanced" ? "text-[#22C55E]" : "text-gray-400 hover:text-gray-600"}`}
                >
                  Advanced
                  {toolsActiveTab === "advanced" && (
                    <motion.div layoutId="toolsTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#22C55E] rounded-t-full" />
                  )}
                </button>
              </div>

              <div className="px-8 py-6 max-h-[60vh] overflow-y-auto scrollbar-hide">
                <AnimatePresence mode="wait">
                  {toolsActiveTab === "general" ? (
                    <motion.div
                      key="general"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-5"
                    >
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1 block">
                          Page Name
                        </label>
                        <input
                          type="text"
                          value={toolsData.name}
                          onChange={(e) => setToolsData({ ...toolsData, name: e.target.value })}
                          className="w-full px-5 py-4 bg-gray-50 rounded-2xl text-sm font-bold text-gray-900 outline-none border border-transparent focus:bg-white focus:border-gray-200 focus:shadow-sm transition-all"
                        />
                      </div>

                      {toolsPage.type === "link" && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1 block">
                            External Link
                          </label>
                          <input
                            type="url"
                            value={toolsData.url}
                            onChange={(e) => setToolsData({ ...toolsData, url: e.target.value })}
                            className="w-full px-5 py-4 bg-gray-50 rounded-2xl text-sm font-bold text-gray-900 outline-none border border-transparent focus:bg-white focus:border-gray-200 focus:shadow-sm transition-all"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1 block">
                          Visibility
                        </label>
                        <div className="relative">
                          <select
                            value={toolsData.visibility}
                            onChange={(e) => setToolsData({ ...toolsData, visibility: e.target.value })}
                            className="w-full appearance-none pl-5 pr-12 py-4 bg-gray-50 rounded-2xl text-sm font-bold text-gray-900 outline-none border border-transparent focus:bg-white focus:border-gray-200 focus:shadow-sm transition-all cursor-pointer"
                          >
                            <option value="Visible">Visible</option>
                            <option value="Not Yet">Not Yet (Draft)</option>
                          </select>
                          <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-gray-400">
                            <ChevronDown size={16} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="advanced"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      {/* Replace Custom HTML */}
                      <div className={`border rounded-2xl overflow-hidden transition-colors ${openAccordion === "html" ? "bg-[#F0FDF4]/50 border-[#22C55E]/30" : "bg-white border-gray-100"}`}>
                        <div 
                          className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors"
                          onClick={() => setOpenAccordion(openAccordion === "html" ? null : "html")}
                        >
                          <h4 className={`text-sm font-bold flex items-center gap-2 ${openAccordion === "html" ? "text-[#16A34A]" : "text-gray-700"}`}>
                            <FileText size={16} />
                            Replace Custom HTML
                          </h4>
                          <ChevronDown size={16} className={`transition-transform duration-300 ${openAccordion === "html" ? "text-[#16A34A] rotate-180" : "text-gray-400"}`} />
                        </div>
                        <AnimatePresence initial={false}>
                          {openAccordion === "html" && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="p-5 space-y-4 border-t border-[#22C55E]/20">
                                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                                  Upload a custom HTML template for this page. Only <code className="text-[#e11d48] bg-rose-50 px-1 py-0.5 rounded">.html</code> files are supported.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <div className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-400 flex items-center">
                                    Choose HTML file...
                                  </div>
                                  <button className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-bold transition-colors">
                                    Browse
                                  </button>
                                </div>
                                <button className="w-full py-3.5 bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-xl text-sm font-black transition-colors shadow-sm flex items-center justify-center gap-2">
                                  <ExternalLink size={16} />
                                  Replace Template
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Make Home Page */}
                      <div className={`border rounded-2xl overflow-hidden transition-colors ${openAccordion === "home" ? "bg-gray-50/50 border-gray-300" : "bg-white border-gray-100"}`}>
                        <div 
                          className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors"
                          onClick={() => setOpenAccordion(openAccordion === "home" ? null : "home")}
                        >
                          <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            <Wrench size={16} />
                            Make Home Page
                          </h4>
                          <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${openAccordion === "home" ? "rotate-180" : ""}`} />
                        </div>
                        <AnimatePresence initial={false}>
                          {openAccordion === "home" && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="p-5 space-y-4 border-t border-gray-100">
                                <p className="text-xs text-gray-500 font-medium">Set this page as the home page for your site.</p>
                                <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-gray-900 block">Set as Home Page?</label>
                                  <div className="relative">
                                    <select
                                      value={toolsData.isHome}
                                      onChange={(e) => setToolsData({ ...toolsData, isHome: e.target.value })}
                                      className="w-full appearance-none pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-900 cursor-pointer focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] outline-none"
                                    >
                                      <option value="No">No</option>
                                      <option value="Yes">Yes</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                                      <ChevronDown size={14} />
                                    </div>
                                  </div>
                                </div>
                                <button className="w-full py-3.5 bg-gray-500 hover:bg-gray-600 text-white rounded-xl text-sm font-black transition-colors shadow-sm flex items-center justify-center gap-2">
                                  <PenLine size={16} />
                                  Save Home Page Setting
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Danger Zone */}
                      <div className={`border rounded-2xl overflow-hidden transition-colors ${openAccordion === "danger" ? "bg-red-50/50 border-red-200" : "bg-white border-red-100"}`}>
                        <div 
                          className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-red-50/30 transition-colors"
                          onClick={() => setOpenAccordion(openAccordion === "danger" ? null : "danger")}
                        >
                          <h4 className="text-sm font-bold text-red-600 flex items-center gap-2">
                            <Trash2 size={16} />
                            Danger Zone
                          </h4>
                          <ChevronDown size={16} className={`text-red-400 transition-transform duration-300 ${openAccordion === "danger" ? "rotate-180" : ""}`} />
                        </div>
                        <AnimatePresence initial={false}>
                          {openAccordion === "danger" && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="p-5 space-y-4 border-t border-red-100">
                                <p className="text-xs text-red-600/80 font-medium leading-relaxed">
                                  Once you delete a page, there is no going back. Please be certain.
                                </p>
                                <button 
                                  onClick={() => { deletePage(toolsPage.id); setToolsPage(null); }}
                                  className="w-full py-3 border border-red-200 hover:bg-red-500 hover:text-white hover:border-red-500 text-red-500 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2"
                                >
                                  <Trash2 size={16} />
                                  Delete Page Permanently
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Modal footer */}
              {toolsActiveTab === "general" && (
                <div className="flex justify-end px-8 py-5 border-t border-gray-50 bg-gray-50/50">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={saveTools}
                    disabled={isSaving || !toolsData.name.trim()}
                    className="flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-black text-white transition-all disabled:opacity-40 shadow-lg"
                    style={{ backgroundColor: brandColor, boxShadow: `0 8px 24px ${brandColor}30` }}
                  >
                    {isSaving && (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    {isSaving ? "Saving..." : "Save"}
                  </motion.button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Edit Content Modal ── */}
      <AnimatePresence>
        {editingPage && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-0 sm:p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="relative w-full h-full sm:h-[90vh] max-w-5xl bg-white sm:rounded-[32px] overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Header */}
              {/* Premium Header with Gradient */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 px-6 py-5 relative overflow-hidden flex-shrink-0">
                <div className="absolute -right-8 -bottom-8 opacity-10 rotate-12">
                  <PenLine size={160} strokeWidth={1} className="text-white" />
                </div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                    <PenLine size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white leading-tight">{editingPage.name}</h3>
                    <p className="text-[10px] text-white/60 font-medium tracking-wide">Editing Content • {editingPage.slug}</p>
                  </div>
                  <button onClick={() => setEditingPage(null)} className="ml-auto w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                    <Plus size={24} className="rotate-45" />
                  </button>
                </div>
              </div>

              {/* Editor Body */}
              <div className="flex-1 bg-gray-50/50 p-4 sm:p-8 overflow-y-auto scrollbar-hide relative flex flex-col items-center">
                
                {/* Floating Movable Device Toolbar */}
                <motion.div
                  drag
                  dragMomentum={false}
                  dragElastic={0.1}
                  initial={{ x: 20, y: 20 }}
                  className="absolute z-50 bg-gray-900/90 backdrop-blur-md rounded-2xl p-1.5 flex gap-1 shadow-2xl cursor-grab active:cursor-grabbing border border-white/10"
                  style={{ top: 0, right: 0, margin: '2rem' }}
                >
                  <button
                    onClick={() => setDeviceView("desktop")}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      deviceView === "desktop" ? "bg-white/20 text-white shadow-inner" : "text-white/50 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Monitor size={18} />
                  </button>
                  <button
                    onClick={() => setDeviceView("mobile")}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      deviceView === "mobile" ? "bg-white/20 text-white shadow-inner" : "text-white/50 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Smartphone size={18} />
                  </button>
                </motion.div>

                <motion.div 
                  initial={false}
                  animate={{ maxWidth: deviceView === "mobile" ? 375 : 768 }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  className="h-full min-h-[400px] flex flex-col bg-white rounded-[24px] border border-gray-200 shadow-sm overflow-hidden w-full"
                >
                  
                  {/* Toolbar */}
                  <div className="flex items-center gap-1 sm:gap-2 px-3 py-2 border-b border-gray-100 bg-gray-50/80 overflow-x-auto scrollbar-hide">
                    <button className="w-9 h-9 rounded-lg hover:bg-white hover:shadow-sm flex items-center justify-center text-gray-600 font-serif font-bold transition-all flex-shrink-0">
                      B
                    </button>
                    <button className="w-9 h-9 rounded-lg hover:bg-white hover:shadow-sm flex items-center justify-center text-gray-600 font-serif font-bold italic transition-all flex-shrink-0">
                      I
                    </button>
                    <button className="w-9 h-9 rounded-lg hover:bg-white hover:shadow-sm flex items-center justify-center text-gray-600 font-bold underline transition-all flex-shrink-0">
                      U
                    </button>
                    <div className="w-px h-5 bg-gray-200 mx-1 flex-shrink-0" />
                    <button className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#22C55E] transition-all flex-shrink-0">
                      <AlignLeft size={16} strokeWidth={2.5} />
                    </button>
                    <button className="w-9 h-9 rounded-lg hover:bg-white hover:shadow-sm flex items-center justify-center text-gray-500 transition-all flex-shrink-0">
                      <AlignCenter size={16} strokeWidth={2.5} />
                    </button>
                    <button className="w-9 h-9 rounded-lg hover:bg-white hover:shadow-sm flex items-center justify-center text-gray-500 transition-all flex-shrink-0">
                      <AlignRight size={16} strokeWidth={2.5} />
                    </button>
                  </div>

                  {/* Textarea */}
                  <textarea
                    value={editorContent}
                    onChange={(e) => setEditorContent(e.target.value)}
                    placeholder="Start writing the content for your page here. You can use markdown or just plain text..."
                    className="flex-1 w-full p-6 sm:p-8 resize-none outline-none text-gray-700 font-medium leading-relaxed placeholder:text-gray-300 bg-transparent text-sm sm:text-base"
                  />
                </motion.div>
              </div>

              {/* Footer */}
              <div className="flex justify-end px-6 py-5 border-t border-gray-100 bg-white flex-shrink-0 z-10">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setEditingPage(null)}
                    className="px-6 py-3.5 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={saveEditorContent}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-black text-white transition-all disabled:opacity-40 shadow-lg"
                    style={{ backgroundColor: brandColor, boxShadow: `0 8px 24px ${brandColor}30` }}
                  >
                    {isSaving && (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    {isSaving ? "Saving..." : "Save Content"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
