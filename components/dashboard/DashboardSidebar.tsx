"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, CircleHelp, FolderKanban, LogOut, Plus, Settings, X } from "lucide-react";

import productIcon from "@/app/icon.png";
import {
  PRIMARY_DASHBOARD_NAVIGATION,
  PROJECT_DASHBOARD_NAVIGATION,
} from "@/constants/dashboard-navigation";
import { getInitials } from "@/helpers/string.helper";
import { cn } from "@/lib/utils";
import type { DashboardSidebarProps } from "@/types/dashboard-navigation";

export default function DashboardSidebar({
  currentUser,
  onLogout,
  onNavigate,
  showCloseButton = false,
  className,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const [projectsMenuOpen, setProjectsMenuOpen] = useState(false);
  const projectsActive = pathname.startsWith("/logs/projects");
  const configureProjectActive = pathname === "/logs/projects/configure";
  const showProjectSubsections = configureProjectActive || projectsMenuOpen;

  return (
    <aside className={cn("flex h-dvh flex-col bg-[#211813]", className)}>
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
        <div className="grid size-9 shrink-0 place-items-center">
          <Image src={productIcon} alt="" className="size-7 object-contain" priority />
        </div>
        <p className="min-w-0 truncate text-sm font-semibold tracking-tight text-white">Roasted Almonds</p>
        {showCloseButton ? (
          <button
            type="button"
            onClick={onNavigate}
            className="ml-auto grid size-8 cursor-pointer place-items-center rounded-lg text-[#b9a99d] hover:bg-white/10 hover:text-white"
            aria-label="Close navigation"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Dashboard navigation">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#796b62]">Almond Logs</p>
        <div className="space-y-1">
          {PRIMARY_DASHBOARD_NAVIGATION.map((item) => {
            const active = item.href === "/dashboard" && pathname === "/dashboard";
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                  active
                    ? "bg-[#d6a56f] font-medium text-[#25170f] shadow-[0_8px_30px_rgba(214,165,111,0.12)]"
                    : "text-[#b9a99d] hover:bg-white/[0.06] hover:text-white",
                )}
              >
                <Icon className="size-4" />
                <span className="flex-1">{item.label}</span>
                {item.badge ? (
                  <span className={cn("rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide", active ? "bg-black/10" : "bg-white/[0.07] text-[#8e7f76]")}>{item.badge}</span>
                ) : null}
              </Link>
            );
          })}

          <div>
            <div className={cn("group flex items-center rounded-xl transition", projectsActive ? "bg-[#d6a56f] font-medium text-[#25170f] shadow-[0_8px_30px_rgba(214,165,111,0.12)]" : "text-[#b9a99d] hover:bg-white/[0.06] hover:text-white")}>
              <Link href="/logs/projects" onClick={onNavigate} className="flex min-w-0 flex-1 items-center gap-3 rounded-l-xl px-3 py-2.5 text-sm">
                <FolderKanban className="size-4" />
                <span className="flex-1">Projects</span>
              </Link>
              <button
                type="button"
                onClick={() => setProjectsMenuOpen((open) => !open)}
                disabled={configureProjectActive}
                className={cn("mr-1 grid size-8 shrink-0 place-items-center rounded-lg transition", configureProjectActive ? "cursor-default" : "cursor-pointer hover:bg-black/10")}
                aria-label={showProjectSubsections ? "Collapse project navigation" : "Expand project navigation"}
                aria-expanded={showProjectSubsections}
                aria-controls="project-navigation-subsections"
              >
                <ChevronRight className={cn("size-3.5 transition-transform", showProjectSubsections && "rotate-90")} />
              </button>
            </div>

            {showProjectSubsections ? (
              <div id="project-navigation-subsections" className="ml-3 mt-1">
                <Link
                  href="/logs/projects/configure"
                  onClick={onNavigate}
                  aria-current={configureProjectActive ? "page" : undefined}
                  className={cn("flex items-center rounded-lg px-3 py-2 text-xs transition", configureProjectActive ? "bg-white/[0.1] font-medium text-[#efd7bd]" : "text-[#94857b] hover:bg-white/[0.06] hover:text-white")}
                >
                  <Plus className="mr-2 size-3.5" />
                  Configure
                </Link>
              </div>
            ) : null}
          </div>

          {PROJECT_DASHBOARD_NAVIGATION.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.label} href={item.href} onClick={onNavigate} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#b9a99d] transition hover:bg-white/[0.06] hover:text-white">
                <Icon className="size-4" />
                <span className="flex-1">{item.label}</span>
                {item.badge ? <span className="rounded-md bg-white/[0.07] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#8e7f76]">{item.badge}</span> : null}
              </Link>
            );
          })}
        </div>

      </nav>

      <div className="border-t border-white/10 p-3">
        <Link href="#settings" onClick={onNavigate} className="mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-[#b9a99d] transition hover:bg-white/[0.06] hover:text-white">
          <Settings className="size-4" />
          Settings
        </Link>
        <button type="button" className="mb-2 flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm text-[#b9a99d] transition hover:bg-white/[0.06] hover:text-white">
          <CircleHelp className="size-4" />
          Documentation
        </button>
        <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-2">
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-[#efe2d0] text-xs font-semibold text-[#5b3825]">{getInitials(currentUser.name, currentUser.email)}</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-white">{currentUser.name || "Account"}</p>
            <p className="truncate text-[10px] text-[#8f8077]">{currentUser.email}</p>
          </div>
          <button type="button" onClick={onLogout} className="grid size-8 cursor-pointer place-items-center rounded-lg text-[#8f8077] transition hover:bg-white/10 hover:text-white" aria-label="Log out" title="Log out">
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
