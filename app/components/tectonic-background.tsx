"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const Plate = ({ color, index }: { color: string; index: number }) => {
  const x = useSpring(useMotionValue(0), { stiffness: 40, damping: 25 });
  const y = useSpring(useMotionValue(0), { stiffness: 40, damping: 25 });
  
  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const factor = (index + 1) * 0.03;
      x.set((clientX - window.innerWidth / 2) * factor);
      y.set((clientY - window.innerHeight / 2) * factor);
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
    };
  }, [x, y, index]);

  return (
    <motion.div
      style={{ x, y }}
      className="absolute inset-0 flex items-center justify-center opacity-[0.15] pointer-events-none overflow-hidden"
    >
      <motion.div
        animate={{
          rotate: [0, 90, 180, 270, 360],
          scale: [1, 1.2, 0.8, 1.2, 1],
          borderRadius: ["40% 60% 60% 40% / 40% 40% 60% 60%", "70% 30% 20% 80% / 70% 20% 80% 30%", "40% 60% 60% 40% / 40% 40% 60% 60%"]
        }}
        transition={{
          duration: 25 + index * 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ 
          backgroundColor: color,
          filter: `blur(${100 + index * 20}px)`,
        }}
        className="w-[120vw] h-[120vw] mix-blend-screen"
      />
    </motion.div>
  );
};

const NeuralLine = ({ i }: { i: number }) => {
  const [points, setPoints] = useState({ x1: 0, y1: 0, x2: 0, y2: 0 });
  const [delay, setDelay] = useState(0);
  
  useEffect(() => {
    setPoints({
      x1: Math.random() * 100,
      y1: Math.random() * 100,
      x2: Math.random() * 100,
      y2: Math.random() * 100,
    });
    setDelay(Math.random() * 10);
  }, []);

  return (
    <motion.svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.03, 0] }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay: delay,
      }}
    >
      <motion.line
        x1={`${points.x1}%`}
        y1={`${points.y1}%`}
        x2={`${points.x2}%`}
        y2={`${points.y2}%`}
        stroke="var(--color-primary)"
        strokeWidth="0.5"
        animate={{ strokeDashoffset: [20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        style={{ strokeDasharray: "4 16" }}
      />
      <motion.circle
        cx={`${points.x2}%`}
        cy={`${points.y2}%`}
        r="1"
        fill="var(--color-secondary)"
        animate={{ 
          scale: [1, 3, 1],
          opacity: [0.1, 1, 0.1]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.svg>
  );
};

export default function TectonicBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      mouseX.set(clientX);
      mouseY.set(clientY);
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
    };
  }, [mouseX, mouseY]);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 bg-background overflow-hidden selection:bg-none">
      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* Dynamic Grid */}
      <motion.div 
        className="absolute inset-0 opacity-[0.1]" 
        style={{ 
          backgroundImage: `linear-gradient(var(--color-outline-variant) 1px, transparent 1px), linear-gradient(90deg, var(--color-outline-variant) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          perspective: 1000,
          rotateX: useTransform(springY, [0, 1000], [2, -2]),
          rotateY: useTransform(springX, [0, 1000], [-2, 2]),
        }} 
      />

      {/* Tectonic Plates */}
      <Plate color="var(--color-primary)" index={0} />
      <Plate color="var(--color-tertiary)" index={1} />
      <Plate color="var(--color-secondary)" index={2} />

      {/* Neural Network Connections */}
      {[...Array(30)].map((_, i) => (
        <NeuralLine key={i} i={i} />
      ))}

      {/* Mouse SpotLight */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: useTransform(
            [springX, springY],
            ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, rgba(208,188,255,0.08), transparent)`
          ),
        }}
      />

      {/* Horizontal Scanline follow mouse */}
      <motion.div
        className="absolute left-0 right-0 h-[100px] bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none z-20"
        style={{ top: springY, translateY: "-50%" }}
      />
      
      {/* Ambient Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--color-background)_95%)] pointer-events-none" />
    </div>
  );
}
