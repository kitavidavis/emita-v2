"use client";

import { useEffect, useRef, type ReactNode, type CSSProperties } from "react";

export function Reveal({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    el.style.transition = "opacity .55s ease, transform .55s cubic-bezier(.2,.7,.3,1)";
    el.style.opacity = "0";
    el.style.transform = "translateY(16px)";
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.style.opacity = "1";
            el.style.transform = "none";
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  );
}
