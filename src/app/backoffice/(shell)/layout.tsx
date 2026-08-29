import type { ReactNode } from "react";
import { BackofficeShell } from "@/components/backoffice/BackofficeShell";

export default function BackofficeLayout({ children }: { children: ReactNode }) {
  return <BackofficeShell>{children}</BackofficeShell>;
}
