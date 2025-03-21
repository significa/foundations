"use client";

import { motion, MotionConfig } from "motion/react";
import usePrefersReducedMotion from "../use-prefers-reduce-motion";

const UsePrefersReduceMotionFramerPreview = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <MotionConfig reducedMotion={prefersReducedMotion ? "always" : "never"}>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-2xl font-bold">
          Animation is {prefersReducedMotion ? "disabled" : "enabled"}
        </h1>
        {!prefersReducedMotion && (
          <p>Turn on reduce motion in your system settings to see the effect</p>
        )}
      </motion.div>
    </MotionConfig>
  );
};

export default UsePrefersReduceMotionFramerPreview;
