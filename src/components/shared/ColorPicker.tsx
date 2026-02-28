"use client";

import { cn } from "@/lib/cn";
import { DEFAULT_LABEL_COLORS } from "@/types/board";
import { Check } from "lucide-react";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {DEFAULT_LABEL_COLORS.map(({ color }) => (
        <button
          key={color}
          onClick={() => onChange(color)}
          className={cn(
            "w-7 h-7 rounded-lg flex items-center justify-center transition-transform hover:scale-110",
            value === color && "ring-2 ring-offset-2 ring-stone-400"
          )}
          style={{ backgroundColor: color }}
        >
          {value === color && <Check className="w-3.5 h-3.5 text-white" />}
        </button>
      ))}
    </div>
  );
}
