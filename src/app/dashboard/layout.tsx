import type { Metadata } from "next";
import { ConsoleProvider } from "@/components/console/ConsoleContext";
import { DashboardShell } from "@/components/console/DashboardShell";

export const metadata: Metadata = {
  title: "Console — Emita",
  description: "The Emita console for Bwaliro Water Project.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConsoleProvider>
      <DashboardShell>{children}</DashboardShell>
    </ConsoleProvider>
  );
}
