import AuthenticatedRoute from "@/components/auth/AuthenticatedRoute";
import { BackgroundActionProvider } from "@/components/background-actions/BackgroundActionProvider";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthenticatedRoute>
      <BackgroundActionProvider>
        <DashboardShell>{children}</DashboardShell>
      </BackgroundActionProvider>
    </AuthenticatedRoute>
  );
}
