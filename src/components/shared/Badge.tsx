"use client";

import { cn } from "@/lib/cn";

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

export default function Badge({ children, color, className }: BadgeProps) {
  return (
    <span
      className={cn("label-chip", className)}
      style={
        color
          ? { backgroundColor: color + "20", color }
          : undefined
      }
    >
      {children}
    </span>
  );
}
