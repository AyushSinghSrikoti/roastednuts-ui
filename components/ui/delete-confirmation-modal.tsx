"use client";

import { useEffect, useId, type ReactNode } from "react";
import { Trash2, X } from "lucide-react";

interface DeleteConfirmationModalProps {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmationModal({
  open,
  title,
  description,
  confirmLabel = "Delete",
  onClose,
  onConfirm,
}: DeleteConfirmationModalProps) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center bg-[#1c120d]/55 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="w-full max-w-md overflow-hidden rounded-2xl border border-[#e1d6ca] bg-[#fffdf9] shadow-[0_24px_80px_rgba(40,25,17,0.28)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-[#ebe2d8] px-5 py-5">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#f7e6e2] text-[#a04439]">
              <Trash2 className="size-4.5" />
            </span>
            <div>
              <h2 id={titleId} className="text-base font-semibold text-[#302219]">{title}</h2>
              <div id={descriptionId} className="mt-1 text-xs leading-5 text-[#8e796b]">{description}</div>
            </div>
          </div>
          <button type="button" onClick={onClose} className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-lg text-[#8e796b] transition hover:bg-[#f2eae1] hover:text-[#3f2e24]" aria-label="Close delete confirmation dialog">
            <X className="size-4" />
          </button>
        </div>
        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <button type="button" onClick={onClose} className="h-9 cursor-pointer rounded-xl border border-[#d9ccbe] bg-white px-4 text-xs font-semibold text-[#6f594b] transition hover:bg-[#f5eee6]">Cancel</button>
          <button type="button" onClick={onConfirm} className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-xl bg-[#a04439] px-4 text-xs font-semibold text-white transition hover:bg-[#87362e]">
            <Trash2 className="size-3.5" />
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
