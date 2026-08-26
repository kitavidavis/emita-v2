import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request a Demo — Emita",
  description: "See Emita on your own network. A 45-minute walkthrough of the platform against a utility environment like yours.",
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
