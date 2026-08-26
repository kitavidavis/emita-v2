"use client";

import { useEffect, useState } from "react";
import { ArrowUpIcon } from "@/components/icons";

export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(document.documentElement.scrollTop > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      style={{
        position: "fixed",
        right: 26,
        bottom: 26,
        zIndex: 70,
        appearance: "none",
        cursor: "pointer",
        width: 46,
        height: 46,
        background: "var(--color-deep)",
        color: "#FFFFFF",
        border: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 10px 30px rgba(11,31,51,0.25)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-accent)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-deep)")}
    >
      <ArrowUpIcon />
    </button>
  );
}
