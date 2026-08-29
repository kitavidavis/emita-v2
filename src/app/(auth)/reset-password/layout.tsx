import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Choose a New Password — Emita",
  description: "Set a new password for your Emita utility console account.",
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
