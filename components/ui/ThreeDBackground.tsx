"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MouseEvent, ReactNode } from "react";

type ThreeDBackgroundProps = {
  children: ReactNode;
};

export default function ThreeDBackground({
  children,
}: ThreeDBackgroundProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, {
    stiffness: 70,
    damping: 20,
  });

  const smoothY = useSpring(mouseY, {
    stiffness: 70,
    damping: 20,
  });

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [4, -4]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-4, 4]);

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();

    mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#050505]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#b89235]/10 blur-[120px]"
        style={{
          x: useTransform(smoothX, [-0.5, 0.5], [-30, 30]),
          y: useTransform(smoothY, [-0.5, 0.5], [-20, 20]),
        }}
      />

      <motion.div
        className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#8a6a22]/10 blur-[120px]"
        style={{
          x: useTransform(smoothX, [-0.5, 0.5], [30, -30]),
          y: useTransform(smoothY, [-0.5, 0.5], [20, -20]),
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.25) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.25) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="pointer-events-none absolute inset-0 [perspective:1200px]">
        <motion.div
          className="absolute left-1/2 top-1/2 h-[70vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-[40px] border border-white/[0.04] bg-white/[0.015]"
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="absolute inset-10 rounded-[30px] border border-[#b89235]/10"
            style={{ transform: "translateZ(60px)" }}
          />

          <div
            className="absolute inset-20 rounded-[24px] border border-white/[0.03]"
            style={{ transform: "translateZ(100px)" }}
          />
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#050505_90%)]" />

      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  );
}
