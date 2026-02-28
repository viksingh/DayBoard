"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

export default function Tooltip({ children, content }: TooltipProps) {
  const [show, setShow] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const handleEnter = () => {
    timeoutRef.current = setTimeout(() => setShow(true), 500);
  };

  const handleLeave = () => {
    clearTimeout(timeoutRef.current);
    setShow(false);
  };

  return (
    <div className="relative inline-flex" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-stone-800 rounded-lg whitespace-nowrap z-50 pointer-events-none"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
