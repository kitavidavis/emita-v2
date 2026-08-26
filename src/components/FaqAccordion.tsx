"use client";

import { useState } from "react";
import { faqs } from "@/lib/content/faqs";

export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div>
      {faqs.map((f, i) => (
        <div key={f.q} style={{ borderTop: "1px solid var(--color-divider)" }}>
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: "100%",
              appearance: "none",
              background: "transparent",
              border: 0,
              cursor: "pointer",
              display: "flex",
              alignItems: "baseline",
              gap: 18,
              textAlign: "left",
              padding: "18px 0",
              fontFamily: "var(--font-body)",
            }}
          >
            <span style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 11, color: "var(--color-accent)" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span style={{ flex: 1, fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 17, letterSpacing: "-0.01em", color: "var(--color-text)" }}>
              {f.q}
            </span>
            <span style={{ fontSize: 18, color: "var(--color-accent)", lineHeight: 1 }}>{open === i ? "–" : "+"}</span>
          </button>
          {open === i && (
            <p style={{ margin: 0, padding: "0 40px 22px 47px", fontSize: 14.5, lineHeight: 1.6, color: "var(--color-neutral-800)" }}>
              {f.a}
            </p>
          )}
        </div>
      ))}
      <div style={{ borderTop: "1px solid var(--color-divider)" }} />
    </div>
  );
}
