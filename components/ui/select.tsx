"use client";

import { Select } from "@base-ui/react/select";
import { useState } from "react";
import { Boxes, Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export interface SelectOption {
  label: string;
  value: string;
  iconUrl?: string | null;
}

interface ThemedSelectProps {
  options: SelectOption[];
  defaultValue?: string;
  value?: string;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  onValueChange?: (value: string | null) => void;
}

export function ThemedSelect({
  options,
  defaultValue,
  value,
  name,
  placeholder = "Select an option",
  disabled,
  invalid,
  className,
  onValueChange,
}: ThemedSelectProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const selectedValue = value ?? internalValue;
  const selectedOption = options.find((option) => option.value === selectedValue);

  const handleValueChange = (nextValue: string | null) => {
    if (value === undefined) setInternalValue(nextValue ?? "");
    onValueChange?.(nextValue);
  };

  return (
    <Select.Root
      items={options}
      defaultValue={defaultValue}
      value={value}
      name={name}
      disabled={disabled}
      onValueChange={handleValueChange}
    >
      <Select.Trigger
        className={cn(
          "flex h-10 w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-[#d9ccbe] bg-[#fffdf9] px-3.5 text-left text-sm text-[#34251d] outline-none transition hover:border-[#c6b19f] focus-visible:border-[#9b7258] focus-visible:ring-3 focus-visible:ring-[#b88a6b]/15 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-popup-open:border-[#9b7258]",
          invalid && "border-[#b84f42] focus-visible:border-[#b84f42] focus-visible:ring-[#b84f42]/15",
          className,
        )}
        aria-invalid={invalid || undefined}
      >
        <span className="flex min-w-0 flex-1 items-center gap-2 truncate">
          {selectedOption?.iconUrl ? (
            // Platform icons are URLs supplied by our authenticated platforms API.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={selectedOption.iconUrl} alt="" className="size-4 shrink-0 object-contain" />
          ) : selectedOption?.value === "other" ? (
            <Boxes className="size-4 shrink-0 text-[#80695a]" />
          ) : null}
          <span className={cn("truncate", !selectedOption && "text-[#b09f93]")}>{selectedOption?.label ?? placeholder}</span>
        </span>
        <Select.Icon className="text-[#80695a] transition-transform data-popup-open:rotate-180">
          <ChevronDown className="size-3.5" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Positioner className="z-[100] outline-none" sideOffset={0} alignItemWithTrigger={false}>
          <Select.Popup className="w-max min-w-[var(--anchor-width)] max-w-[var(--available-width)] origin-[var(--transform-origin)] overflow-hidden rounded-xl border border-[#d9ccbe] bg-[#fffdf9] p-1.5 text-[#34251d] shadow-[0_14px_35px_rgba(53,39,30,0.14)] outline-none transition-[transform,opacity] duration-100 data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0">
            <Select.List className="max-h-[var(--available-height)] overflow-y-auto scroll-py-1 outline-none">
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  className="grid cursor-pointer grid-cols-[minmax(0,1fr)_18px] items-center gap-2 rounded-lg px-2.5 py-2 text-xs outline-none select-none data-highlighted:bg-[#f1e2d3] data-highlighted:text-[#593724] data-selected:font-semibold"
                >
                  <Select.ItemText className="col-start-1 flex items-center gap-2 whitespace-nowrap">
                    {option.iconUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={option.iconUrl} alt="" className="size-4 shrink-0 object-contain" />
                    ) : option.value === "other" ? (
                      <Boxes className="size-4 shrink-0 text-[#80695a]" />
                    ) : null}
                    {option.label}
                  </Select.ItemText>
                  <Select.ItemIndicator className="col-start-2 text-[#75452e]">
                    <Check className="size-3.5" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
