"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, SlidersHorizontal, X, Zap } from "lucide-react";

import { cn } from "@/lib/utils";
import { createProject } from "@/services/projects";
import { useBackgroundActions } from "@/components/background-actions/BackgroundActionProvider";
import { announceProjectsChanged } from "@/constants/project-events";

type LaunchMode = "quick" | "configured";

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateProjectModal({ open, onClose }: CreateProjectModalProps) {
  const router = useRouter();
  const { runBackgroundAction } = useBackgroundActions();
  const [launchMode, setLaunchMode] = useState<LaunchMode>("quick");
  const [projectName, setProjectName] = useState("");
  const [nameError, setNameError] = useState("");
  const [submissionError, setSubmissionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose, open]);

  if (!open) return null;

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = projectName.trim();

    if (name.length < 3 || name.length > 64) {
      setNameError(name.length < 3 ? "Project name must be at least 3 characters." : "Project name cannot exceed 64 characters.");
      return;
    }

    setNameError("");
    setSubmissionError("");

    if (launchMode === "quick") {
      setIsSubmitting(true);
      void runBackgroundAction({
        title: `Creating ${name}`,
        runningMessage: "Creating the project and applying its settings…",
        successMessage: `${name} was created successfully.`,
        errorMessage: `We could not create ${name}. Please try again.`,
        task: () => createProject({ name, launchMode: "quick" }),
        onSuccess: announceProjectsChanged,
      });
      onClose();
      setIsSubmitting(false);
      router.push("/logs/projects");
    } else {
      const query = new URLSearchParams({ name });
      router.push(`/logs/projects/configure?${query.toString()}`);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-[#1c120d]/55 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-project-title"
        className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-[#e1d6ca] bg-[#fffdf9] shadow-[0_24px_80px_rgba(40,25,17,0.28)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-[#ebe2d8] px-5 py-5 sm:px-6">
          <div>
            <h2 id="create-project-title" className="text-lg font-semibold tracking-[-0.025em] text-[#302219]">
              Create a new project
            </h2>
            <p className="mt-1 text-xs leading-5 text-[#8e796b]">
              Choose how you want to get your project ready.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 cursor-pointer place-items-center rounded-lg text-[#8e796b] transition hover:bg-[#f2eae1] hover:text-[#3f2e24]"
            aria-label="Close create project dialog"
          >
            <X className="size-4" />
          </button>
        </div>

        <form noValidate onSubmit={submit}>
          <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
            <fieldset>
              <legend className="mb-2.5 text-xs font-semibold text-[#49362b]">Launch type</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setLaunchMode("quick")}
                  className={cn(
                    "relative cursor-pointer rounded-2xl border p-4 text-left transition",
                    launchMode === "quick"
                      ? "border-[#87583d] bg-[#f8ede1] ring-2 ring-[#87583d]/10"
                      : "border-[#dfd4c8] bg-white hover:border-[#c5b09e] hover:bg-[#fdfaf6]",
                  )}
                  aria-pressed={launchMode === "quick"}
                >
                  <div className="flex items-start gap-3">
                    <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl", launchMode === "quick" ? "bg-[#75452e] text-white" : "bg-[#f2ebe3] text-[#7e6758]")}>
                      <Zap className="size-4" />
                    </span>
                    <span className="pr-4">
                      <span className="block text-sm font-semibold text-[#39291f]">Quick launch</span>
                      <span className="mt-1 block text-[11px] leading-4.5 text-[#887466]">
                        Start now with recommended defaults. Configure everything later.
                      </span>
                    </span>
                  </div>
                  {launchMode === "quick" ? (
                    <span className="absolute right-3 top-3 grid size-5 place-items-center rounded-full bg-[#75452e] text-white">
                      <Check className="size-3" />
                    </span>
                  ) : null}
                </button>

                <button
                  type="button"
                  onClick={() => setLaunchMode("configured")}
                  className={cn(
                    "relative cursor-pointer rounded-2xl border p-4 text-left transition",
                    launchMode === "configured"
                      ? "border-[#87583d] bg-[#f8ede1] ring-2 ring-[#87583d]/10"
                      : "border-[#dfd4c8] bg-white hover:border-[#c5b09e] hover:bg-[#fdfaf6]",
                  )}
                  aria-pressed={launchMode === "configured"}
                >
                  <div className="flex items-start gap-3">
                    <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl", launchMode === "configured" ? "bg-[#75452e] text-white" : "bg-[#f2ebe3] text-[#7e6758]")}>
                      <SlidersHorizontal className="size-4" />
                    </span>
                    <span className="pr-4">
                      <span className="block text-sm font-semibold text-[#39291f]">Configure and launch</span>
                      <span className="mt-1 block text-[11px] leading-4.5 text-[#887466]">
                        Review storage, limits, retention, and privacy before launch.
                      </span>
                    </span>
                  </div>
                  {launchMode === "configured" ? (
                    <span className="absolute right-3 top-3 grid size-5 place-items-center rounded-full bg-[#75452e] text-white">
                      <Check className="size-3" />
                    </span>
                  ) : null}
                </button>
              </div>
            </fieldset>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-[#49362b]">Project name</span>
              <input
                autoFocus
                required
                value={projectName}
                onChange={(event) => {
                  setProjectName(event.target.value);
                  setNameError("");
                  setSubmissionError("");
                }}
                placeholder="e.g. Checkout API"
                minLength={3}
                maxLength={64}
                aria-invalid={Boolean(nameError)}
                className={cn("h-10 w-full rounded-xl border bg-white px-3.5 text-sm text-[#34251d] outline-none transition placeholder:text-[#b09f93] focus:border-[#9b7258] focus:ring-3 focus:ring-[#b88a6b]/15", nameError ? "border-[#b84f42]" : "border-[#d9ccbe]")}
              />
              {nameError ? <span className="mt-1.5 block text-[10px] text-[#b84f42]">{nameError}</span> : null}
            </label>

            {submissionError ? <p role="alert" className="text-xs text-[#b84f42]">{submissionError}</p> : null}

            <div className="rounded-xl border border-[#e3d7ca] bg-[#f8f2ea] px-4 py-3">
              {launchMode === "quick" ? (
                <p className="text-[11px] leading-5 text-[#7c6658]">
                  Uses Roasted Almonds recommended defaults. You can change them later in Project Settings.
                </p>
              ) : (
                <p className="text-[11px] leading-5 text-[#7c6658]">
                  Next, you&apos;ll choose the project&apos;s storage, ingestion limits, retention, and privacy settings.
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-[#ebe2d8] bg-[#fbf7f2] px-5 py-4 sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="h-9 cursor-pointer rounded-xl border border-[#d9ccbe] bg-white px-4 text-xs font-semibold text-[#6f594b] transition hover:bg-[#f5eee6]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-9 cursor-pointer items-center gap-1.5 rounded-xl bg-[#75452e] px-4 text-xs font-semibold text-white transition hover:bg-[#603722] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Creating project..." : launchMode === "quick" ? "Launch project" : "Continue to configuration"}
              {launchMode === "configured" ? <ArrowRight className="size-3.5" /> : null}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
