import type { LucideIcon } from "lucide-react";

import type { CurrentUser } from "@/types/auth";

export interface DashboardNavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export interface DashboardSidebarProps {
  currentUser: CurrentUser;
  onLogout: () => void;
  onNavigate?: () => void;
  showCloseButton?: boolean;
  className?: string;
}
