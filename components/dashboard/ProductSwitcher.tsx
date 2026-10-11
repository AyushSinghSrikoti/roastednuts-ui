"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Search, Settings2 } from "lucide-react";

export default function ProductSwitcher({ onOpen }: { onOpen?: () => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const normalizedQuery = query.trim().toLowerCase();
  const showConfigurations = "My Configurations".toLowerCase().includes(normalizedQuery);
  const showAlmondLogs = "Almond Logs".toLowerCase().includes(normalizedQuery);

  const toggle = () => {
    if (!open) onOpen?.();
    setOpen((current) => !current);
  };

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("pointerdown", closeOnOutsideClick);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("pointerdown", closeOnOutsideClick);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button type="button" onClick={toggle} className="flex h-9 min-w-0 cursor-pointer items-center gap-2 rounded-xl border border-[#ddd1c3] bg-white/70 px-3 text-sm text-[#705b4d] transition hover:border-[#c8b6a5] hover:bg-white" aria-label="Open product switcher" aria-expanded={open} aria-controls="product-switcher">
        <Image src="/assets/almond-logs-icon.png" alt="" width={32} height={32} className="size-8 shrink-0 object-contain" priority />
        <span className="truncate font-medium text-[#34261e]">Almond Logs</span>
        <ChevronDown className={`size-3.5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div id="product-switcher" className="absolute left-0 top-full z-50 w-[min(32rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#ded3c7] bg-[#fffdf9] shadow-[0_20px_55px_rgba(53,39,30,0.18)]">
          <div className="border-b border-[#eee5dc] p-4">
            <p className="text-sm font-semibold text-[#39291f]">Roasted Almonds services</p>
            <p className="mt-1 text-[11px] text-[#927f72]">Choose where you want to work.</p>
            <label className="relative mt-3 block">
              <span className="sr-only">Search services</span>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-3.5 -translate-y-1/2 text-[#9b887a]" />
              <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search services" className="h-10 w-full rounded-xl border border-[#d9ccbe] bg-white pl-10 pr-3.5 text-sm text-[#34251d] outline-none transition placeholder:text-[#aa998d] focus:border-[#9b7258] focus:ring-3 focus:ring-[#b88a6b]/15" />
            </label>
          </div>

          <div className="grid gap-3 p-4 sm:grid-cols-2">
            {showConfigurations ? (
              <Link href="/dashboard" onClick={() => setOpen(false)} className="group rounded-2xl border border-[#e2d7cb] bg-white p-4 transition hover:border-[#bd9f88] hover:bg-[#fbf4ec]">
                <span className="flex items-center gap-3">
                  <Settings2 className="size-8 shrink-0 text-[#725b4c]" />
                  <span className="text-sm font-semibold text-[#3d2c22]">My Configurations</span>
                </span>
                <span className="mt-3 block text-left text-[11px] leading-4.5 text-[#8e796b]">Manage your Roasted Almonds workspace and account settings.</span>
              </Link>
            ) : null}

            {showAlmondLogs ? (
              <Link href="/logs/projects" onClick={() => setOpen(false)} className="group rounded-2xl border border-[#c9aa91] bg-[#fbf1e5] p-4 ring-2 ring-[#87583d]/8 transition hover:border-[#a97d61]">
                <span className="flex items-center gap-3">
                  <Image src="/assets/almond-logs-icon.png" alt="" width={40} height={40} className="size-10 shrink-0 object-contain" />
                  <span className="flex items-center gap-2 text-sm font-semibold text-[#3d2c22]">Almond Logs <span className="rounded-full bg-[#e7d3bf] px-2 py-0.5 text-[9px] uppercase tracking-wide text-[#75452e]">Current</span></span>
                </span>
                <span className="mt-3 block text-left text-[11px] leading-4.5 text-[#8e796b]">Manage projects, logs, retention, and ingestion settings.</span>
              </Link>
            ) : null}

            {!showConfigurations && !showAlmondLogs ? <p className="py-8 text-center text-xs text-[#927f72] sm:col-span-2">No services found.</p> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
