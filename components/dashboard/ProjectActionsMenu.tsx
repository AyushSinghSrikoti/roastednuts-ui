"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, CirclePower, Pencil, Trash2 } from "lucide-react";

interface ProjectActionsMenuProps {
  editHref: string;
  enabled: boolean;
  onToggleStatus: () => void;
  onDelete: () => void;
}

export default function ProjectActionsMenu({ editHref, enabled, onToggleStatus, onDelete }: ProjectActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
      <button type="button" onClick={() => setOpen((current) => !current)} className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-xl bg-[#75452e] px-3 text-xs font-semibold text-white shadow-[0_8px_20px_rgba(117,69,46,0.18)] transition hover:bg-[#603722]" aria-expanded={open} aria-controls="project-actions-menu">
        Actions
        <ChevronDown className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div id="project-actions-menu" className="absolute right-0 top-full z-30 w-44 overflow-hidden rounded-xl border border-[#ded3c7] bg-[#fffdf9] p-1.5 shadow-[0_14px_35px_rgba(53,39,30,0.16)]">
          <Link href={editHref} onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-medium text-[#594438] transition hover:bg-[#f3ebe2]"><Pencil className="size-3.5" />Edit project</Link>
          <button type="button" onClick={() => { setOpen(false); onToggleStatus(); }} className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-[#594438] transition hover:bg-[#f3ebe2]"><CirclePower className="size-3.5" />{enabled ? "Disable project" : "Enable project"}</button>
          <button type="button" onClick={() => { setOpen(false); onDelete(); }} className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-[#a04439] transition hover:bg-[#f7e6e2]"><Trash2 className="size-3.5" />Delete project</button>
        </div>
      ) : null}
    </div>
  );
}
