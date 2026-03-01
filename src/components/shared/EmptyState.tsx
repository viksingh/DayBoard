"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-blue-400" />
      </div>
      <h3 className="text-lg font-semibold text-stone-700 mb-1">{title}</h3>
      <p className="text-sm text-stone-500 max-w-sm mb-4">{description}</p>
      {action && (
        <button onClick={action.onClick} className="btn-primary text-sm">
          {action.label}
        </button>
      )}
    </motion.div>
  );
}
