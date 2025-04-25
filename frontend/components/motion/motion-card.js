"use client";

import { motion } from "framer-motion";

export const MotionCard = ({ children }) => {
  return (
    <motion.div
      className="w-full max-w-md bg-slate-50 p-8 rounded-2xl shadow-xl"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};
