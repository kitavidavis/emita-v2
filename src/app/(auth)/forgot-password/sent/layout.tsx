import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Check Your Inbox — Emita",
  description: "A password reset link has been sent to your email.",
};

export default function ForgotPasswordSentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
