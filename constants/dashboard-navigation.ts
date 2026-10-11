import {
  KeyRound,
  LayoutDashboard,
  Rocket,
  ScrollText,
  Zap,
} from "lucide-react";

import type { DashboardNavigationItem } from "@/types/dashboard-navigation";

export const PRIMARY_DASHBOARD_NAVIGATION: DashboardNavigationItem[] = [
  { label: "Get started", href: "#get-started", icon: Rocket, badge: "Soon" },
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
];

export const PROJECT_DASHBOARD_NAVIGATION: DashboardNavigationItem[] = [
  { label: "API keys", href: "#api-keys", icon: KeyRound },
  { label: "Issues", href: "#issues", icon: Zap, badge: "Soon" },
  { label: "Logs", href: "#logs", icon: ScrollText, badge: "Soon" },
];

export const DASHBOARD_SEARCH_ITEMS = [
  { label: "Get started", description: "Set up Almond Logs", href: "#get-started" },
  { label: "Overview", description: "Dashboard summary", href: "/dashboard" },
  { label: "Recent logs", description: "Latest events across services", href: "#logs" },
  { label: "checkout-api", description: "Production service", href: "#services" },
  { label: "users-api", description: "Production service", href: "#services" },
  { label: "auth-service", description: "Production service", href: "#services" },
  { label: "API keys", description: "Project credentials", href: "#api-keys" },
  { label: "Settings", description: "Almond Logs preferences", href: "#settings" },
] as const;
