import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Two-Factor Authentication — Emita",
  description: "Enter your verification code to continue.",
};

export default function VerifyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
