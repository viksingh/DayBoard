"use client";

import { cn } from "@/lib/cn";

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-stone-200/60 dark:bg-stone-700/60",
        className
      )}
    />
  );
}
