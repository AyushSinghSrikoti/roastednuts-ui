"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";

interface CreatableComboboxProps {
  name: string;
  options: string[];
  placeholder?: string;
  defaultValue?: string;
}

export function CreatableCombobox({ name, options, placeholder = "Select or type a value", defaultValue = "" }: CreatableComboboxProps) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const filteredOptions = options.filter((option) => option.toLowerCase().includes(value.trim().toLowerCase()));

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };

    window.addEventListener("pointerdown", closeOnOutsideClick);
    return () => window.removeEventListener("pointerdown", closeOnOutsideClick);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <input type="hidden" name={name} value={value} />
      <div className="flex h-10 w-full items-center rounded-xl border border-[#d9ccbe] bg-[#fffdf9] transition hover:border-[#c6b19f] focus-within:border-[#9b7258] focus-within:ring-3 focus-within:ring-[#b88a6b]/15">
        <input
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
          }}
          placeholder={placeholder}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listId}
          className="min-w-0 flex-1 bg-transparent px-3.5 text-sm text-[#34251d] outline-none placeholder:text-[#b09f93]"
        />
        {value ? (
          <button type="button" onClick={() => setValue("")} className="grid size-8 cursor-pointer place-items-center text-[#9b8678] hover:text-[#5c4130]" aria-label="Clear environment label">
            <X className="size-3.5" />
          </button>
        ) : null}
        <button type="button" onClick={() => setOpen((current) => !current)} className="grid size-9 cursor-pointer place-items-center text-[#80695a]" aria-label="Show environment suggestions">
          <ChevronDown className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>

      {open ? (
        <div id={listId} role="listbox" className="absolute left-0 right-0 top-full z-[100] overflow-hidden rounded-xl border border-[#d9ccbe] bg-[#fffdf9] p-1.5 shadow-[0_14px_35px_rgba(53,39,30,0.14)]">
          {filteredOptions.length ? filteredOptions.map((option) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={value.toLowerCase() === option.toLowerCase()}
              onClick={() => {
                setValue(option);
                setOpen(false);
              }}
              className="grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_18px] items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs text-[#34251d] hover:bg-[#f1e2d3] hover:text-[#593724]"
            >
              <span>{option}</span>
              {value.toLowerCase() === option.toLowerCase() ? <Check className="size-3.5 text-[#75452e]" /> : null}
            </button>
          )) : (
            <p className="px-2.5 py-2 text-[11px] text-[#8f7a6c]">Press Tab to keep “{value}”.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
