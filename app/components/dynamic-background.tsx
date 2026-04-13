"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const NeuralNetwork = () => {
  const connections = [
    { d: "M-50,200 Q150,50 350,250", duration: 12, delay: 0 },
    { d: "M100,600 Q250,450 400,650", duration: 15, delay: 1 },
    { d: "M400,200 Q550,400 350,600", duration: 18, delay: 0.5 },
    { d: "M-100,800 Q100,700 300,900", duration: 20, delay: 2 },
    { d: "M500,100 Q700,300 500,500", duration: 14, delay: 1.5 },
    { d: "M350,250 Q250,450 100,400", duration: 12, delay: 0.2 },
    { d: "M350,250 Q500,100 700,150", duration: 16, delay: 0.8 },
  ];

  const nodes = [
    { x: 350, y: 250, delay: 0 },
    { x: 100, y: 600, delay: 0.5 },
    { x: 500, y: 500, delay: 1 },
    { x: 350, y: 600, delay: 0.2 },
    { x: -50, y: 200, delay: 0.7 },
    { x: 400, y: 200, delay: 1.2 },
    { x: 100, y: 400, delay: 0.4 },
  ];

  return (
    <motion.div
      className="absolute inset-0 z-0 pointer-events-none"
      initial={{ x: -10, y: -10 }}
      animate={{ x: [-10, 10, -10], y: [-10, 10, -10] }}
      transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width="100%" height="100%" viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0   0 0 0 0 1   0 0 0 0 0.6  0 0 0 1 0" result="glow" />
            <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {connections.map((path, i) => (
          <motion.path
            key={`path-${i}`}
            d={path.d}
            stroke="#00FF9F"
            strokeWidth="1.3"
            strokeLinecap="round"
            filter="url(#neon-glow)"
            initial={{ pathLength: 0, opacity: 0.06 }}
            animate={{ pathLength: [0, 1, 0], opacity: [0.06, 0.18, 0.06] }}
            transition={{ duration: path.duration * 2, delay: path.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        {nodes.map((node, i) => (
          <g key={`node-${i}`}>
            <motion.circle
              cx={node.x} cy={node.y} r="6" fill="#00FF9F"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0, 0.2, 0] }}
              transition={{ duration: 8, delay: node.delay, repeat: Infinity, ease: "easeInOut" }}
              filter="url(#neon-glow)"
            />
            <motion.circle
              cx={node.x} cy={node.y} r="2" fill="#FFFFFF"
              initial={{ opacity: 0.6 }}
              animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 4, delay: node.delay, repeat: Infinity, ease: "easeInOut" }}
            />
          </g>
        ))}
      </svg>
    </motion.div>
  );
};

export const DynamicBackground = () => {
  const { scrollYProgress } = useScroll();
  
  // Parallax offsets
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 15]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
      {/* Base Background Gradient */}
      <motion.div 
        style={{ y: y3 }}
        className="absolute -inset-[200px] bg-gradient-to-br from-[#0A2621] via-[#050505] to-[#1E1235]" 
      />

      {/* Tectonic Layers - Hidden on mobile entirely to ensure NO movement */}
      <div className="hidden lg:block">
        {/* Circuit Texture Overlay */}
        <motion.div 
          className="absolute -inset-[200px] opacity-[0.04] mix-blend-overlay"
          style={{ 
            y: y1,
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10h10v10H10zM30 30h10v10H30zM50 50h10v10H50zM70 70h10v10H70z' fill='%2322C55E' fill-opacity='0.1'/%3E%3Cpath d='M20 15h20M40 35h20M60 55h20M80 75h20M15 20v20M35 40v20M55 60v20M75 80v20' stroke='%2322C55E' stroke-opacity='0.1' stroke-width='0.5'/%3E%3C/svg%3E\")", 
            backgroundSize: '150px 150px' 
          }} 
        />

        {/* Neural Network Motion Background */}
        <motion.div className="absolute -inset-[100px]" style={{ y: y2 }}>
          <NeuralNetwork />
        </motion.div>

        {/* Glowing Accents */}
        <motion.div style={{ y: y1 }} className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#22C55E]/8 rounded-full blur-[140px] opacity-50" />
        <motion.div style={{ y: y2 }} className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#14B8A6]/6 rounded-full blur-[120px] opacity-40" />
        <motion.div style={{ y: y3 }} className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-[#A855F7]/4 rounded-full blur-[100px] opacity-30" />

        {/* Concentric Circles Background Pattern */}
        <motion.div style={{ y: y2, rotate }} className="absolute inset-0 z-0 opacity-[0.06]">
          <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full border border-[#22C55E]/20" />
          <div className="absolute top-1/2 right-0 translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] rounded-full border border-[#22C55E]/15" />
        </motion.div>

        {/* Ultra-wide extra depth */}
        <div className="pointer-events-none absolute inset-0 z-0 hidden min-[1441px]:block overflow-hidden">
          <motion.div
            className="absolute -left-[10%] top-[12%] h-[55vh] w-[55vw] max-w-[980px] rounded-full bg-[#22C55E]/[0.07] blur-[120px]"
            animate={{ opacity: [0.35, 0.55, 0.35], x: [0, 18, 0], y: [0, 12, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute left-[18%] bottom-[5%] h-[42vh] w-[48vw] max-w-[820px] rounded-full bg-[#14B8A6]/[0.06] blur-[100px]"
            animate={{ opacity: [0.25, 0.45, 0.25], x: [0, -14, 0] }}
            transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          />
        </div>
      </div>
    </div>
  );
};
