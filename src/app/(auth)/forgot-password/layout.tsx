import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password — Emita",
  description: "Reset the password on your Emita utility console account.",
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
