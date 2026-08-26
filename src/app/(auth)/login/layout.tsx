import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — Emita",
  description: "Sign in to your Emita utility console.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
