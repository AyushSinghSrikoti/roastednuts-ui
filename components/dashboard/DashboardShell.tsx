"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toast";
import { Bell, Menu, Plus, Search } from "lucide-react";

import { useCurrentUser } from "@/components/auth/AuthenticatedRoute";
import CreateProjectModal from "@/components/dashboard/CreateProjectModal";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import ProductSwitcher from "@/components/dashboard/ProductSwitcher";
import { DASHBOARD_SEARCH_ITEMS } from "@/constants/dashboard-navigation";
import { genericAxios } from "@/services/genericAxios";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const currentUser = useCurrentUser();
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const notificationsContainerRef = useRef<HTMLDivElement>(null);

  const searchResults = searchQuery.trim()
    ? DASHBOARD_SEARCH_ITEMS.filter((item) =>
        `${item.label} ${item.description}`.toLowerCase().includes(searchQuery.trim().toLowerCase()),
      )
    : [];

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
        searchInputRef.current?.focus();
      }

      if (event.key === "Escape") {
        setSearchOpen(false);
        setNotificationsOpen(false);
        searchInputRef.current?.blur();
      }
    };

    const handleOutsideClick = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!searchContainerRef.current?.contains(target)) setSearchOpen(false);
      if (!notificationsContainerRef.current?.contains(target)) setNotificationsOpen(false);
    };

    window.addEventListener("keydown", handleShortcut);
    window.addEventListener("pointerdown", handleOutsideClick);
    return () => {
      window.removeEventListener("keydown", handleShortcut);
      window.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, []);

  const logout = async () => {
    const refreshToken = window.localStorage.getItem("refreshToken");
    try {
      await genericAxios.post<null>("/auth/logout", { refreshToken });
    } catch {
      toast.info("You have been logged out locally.");
    } finally {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("refreshToken");
      router.replace("/login");
    }
  };

  return (
    <div className="min-h-dvh bg-[#f6f1e9] text-[#2d2119] lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      <DashboardSidebar
        currentUser={currentUser}
        onLogout={() => void logout()}
        className="sticky top-0 hidden lg:flex"
      />

      {mobileNavigationOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 cursor-pointer bg-[#1b120d]/60 backdrop-blur-sm" onClick={() => setMobileNavigationOpen(false)} aria-label="Close navigation overlay" />
          <DashboardSidebar
            currentUser={currentUser}
            onLogout={() => void logout()}
            onNavigate={() => setMobileNavigationOpen(false)}
            showCloseButton
            className="relative w-[min(82vw,290px)] shadow-2xl"
          />
        </div>
      ) : null}

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-[#dfd4c7] bg-[#f6f1e9]/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <button type="button" onClick={() => setMobileNavigationOpen(true)} className="grid size-9 cursor-pointer place-items-center rounded-xl border border-[#dfd4c7] bg-white text-[#5d493c] lg:hidden" aria-label="Open navigation">
            <Menu className="size-4" />
          </button>

          <ProductSwitcher onOpen={() => { setSearchOpen(false); setNotificationsOpen(false); }} />

          <div className="ml-auto flex items-center gap-2">
            <div ref={searchContainerRef} className="relative hidden w-80 sm:block xl:w-96">
              <div className="flex h-9 items-center gap-2 rounded-xl border border-[#ddd1c3] bg-white/70 px-3 text-xs text-[#9b887a] transition focus-within:border-[#b99e89] focus-within:bg-white">
                <Search className="size-3.5 shrink-0" />
                <input ref={searchInputRef} value={searchQuery} onChange={(event) => { setSearchQuery(event.target.value); setSearchOpen(true); }} onFocus={() => setSearchOpen(true)} placeholder="Search" aria-label="Search" role="combobox" aria-autocomplete="list" aria-expanded={searchOpen} aria-controls="dashboard-search-results" className="min-w-0 flex-1 bg-transparent text-[#3f3027] outline-none placeholder:text-[#9b887a]" />
                <span className="whitespace-nowrap rounded border border-[#ded3c7] bg-[#f6f1e9] px-1.5 py-0.5 text-[9px]">⌘ K / Ctrl K</span>
              </div>

              {searchOpen && searchQuery.trim() ? (
                <div id="dashboard-search-results" className="absolute left-0 right-0 top-full overflow-hidden rounded-xl border border-[#ded3c7] bg-[#fffdf9] p-1.5 shadow-[0_16px_40px_rgba(53,39,30,0.12)]">
                  {searchResults.length ? searchResults.map((item) => (
                    <Link key={`${item.label}-${item.href}`} href={item.href} onClick={() => { setSearchQuery(""); setSearchOpen(false); }} className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition hover:bg-[#f5eee5]">
                      <Search className="size-3.5 text-[#9a8374]" />
                      <span className="min-w-0"><span className="block truncate text-xs font-medium text-[#3f3027]">{item.label}</span><span className="block truncate text-[10px] text-[#9a877a]">{item.description}</span></span>
                    </Link>
                  )) : <div className="px-4 py-6 text-center"><p className="text-xs font-medium text-[#4a382d]">No search results</p><p className="mt-1 text-[10px] text-[#9a877a]">Try a different search term.</p></div>}
                </div>
              ) : null}
            </div>

            <div ref={notificationsContainerRef} className="relative">
              <button type="button" onClick={() => { setNotificationsOpen((open) => !open); setSearchOpen(false); }} className="relative grid size-9 cursor-pointer place-items-center rounded-xl border border-[#ddd1c3] bg-white/70 text-[#705b4d] transition hover:bg-white" aria-label="Notifications" aria-expanded={notificationsOpen} aria-controls="notifications-panel"><Bell className="size-4" /></button>
              {notificationsOpen ? (
                <div id="notifications-panel" className="absolute right-0 top-full w-72 overflow-hidden rounded-xl border border-[#ded3c7] bg-[#fffdf9] shadow-[0_16px_40px_rgba(53,39,30,0.12)]">
                  <div className="border-b border-[#eee5dc] px-4 py-3"><p className="text-xs font-semibold text-[#3f3027]">Notifications</p></div>
                  <div className="px-5 py-7 text-center"><div className="mx-auto grid size-9 place-items-center rounded-full bg-[#f2ebe2] text-[#8d7667]"><Bell className="size-4" /></div><p className="mt-3 text-xs font-medium text-[#4a382d]">No new notifications</p><p className="mt-1 text-[10px] text-[#9a877a]">Nothing new in the past 24 hours.</p></div>
                </div>
              ) : null}
            </div>

            <button type="button" onClick={() => setCreateProjectOpen(true)} className="hidden h-9 cursor-pointer items-center gap-2 rounded-xl bg-[#75452e] px-3.5 text-xs font-semibold text-white shadow-[0_8px_20px_rgba(117,69,46,0.18)] transition hover:bg-[#603722] sm:flex"><Plus className="size-3.5" />Add project</button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      <CreateProjectModal open={createProjectOpen} onClose={() => setCreateProjectOpen(false)} />
    </div>
  );
}
