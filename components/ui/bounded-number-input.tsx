"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

interface BoundedNumberInputProps {
  name: string;
  min: number;
  max: number;
  placeholder?: string;
  defaultValue?: number;
  invalid?: boolean;
  onValueChange?: (value: string) => void;
}

export function BoundedNumberInput({ name, min, max, placeholder, defaultValue, invalid, onValueChange }: BoundedNumberInputProps) {
  const [value, setValue] = useState(defaultValue === undefined ? "" : String(defaultValue));

  const updateValue = (rawValue: string) => {
    if (rawValue === "") {
      setValue("");
      onValueChange?.("");
      return;
    }

    const numericValue = Number(rawValue);
    if (!Number.isFinite(numericValue)) return;

    const boundedValue = Math.min(max, Math.max(min, Math.trunc(numericValue)));
    const nextValue = String(boundedValue);
    setValue(nextValue);
    onValueChange?.(nextValue);
  };

  return (
    <input
      name={name}
      type="number"
      inputMode="numeric"
      min={min}
      max={max}
      step={1}
      value={value}
      placeholder={placeholder}
      onChange={(event) => updateValue(event.target.value)}
      onKeyDown={(event) => {
        if (["-", "+", "e", "E", "."].includes(event.key)) event.preventDefault();
      }}
      aria-invalid={invalid || undefined}
      className={cn(
        "h-10 w-full rounded-xl border border-[#d9ccbe] bg-white px-3.5 text-sm text-[#34251d] outline-none transition placeholder:text-[#b09f93] focus:border-[#9b7258] focus:ring-3 focus:ring-[#b88a6b]/15",
        invalid && "border-[#b84f42] focus:border-[#b84f42] focus:ring-[#b84f42]/15",
      )}
    />
  );
}
