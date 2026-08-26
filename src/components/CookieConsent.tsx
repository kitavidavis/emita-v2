"use client";

import { useEffect, useState } from "react";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!window.localStorage.getItem("emita-consent"));
  }, []);

  const accept = () => {
    window.localStorage.setItem("emita-consent", "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: 26,
        bottom: 26,
        zIndex: 75,
        maxWidth: 420,
        background: "var(--color-bg)",
        border: "2px solid var(--color-text)",
        padding: "22px 24px",
        boxShadow: "0 18px 50px rgba(11,31,51,0.22)",
      }}
    >
      <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 15, marginBottom: 8 }}>Cookies</div>
      <p style={{ fontSize: 13, lineHeight: 1.55, color: "var(--color-neutral-800)", margin: "0 0 16px" }}>
        We use essential cookies to run the site and analytics to understand which pages are useful. You can decline analytics without losing functionality.
      </p>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <button type="button" onClick={accept} className="btn btn-primary" style={{ padding: "10px 18px", fontSize: 13 }}>Accept all</button>
        <button type="button" onClick={accept} className="btn btn-secondary" style={{ padding: "10px 18px", fontSize: 13 }}>Essential only</button>
        <a href="#" style={{ fontSize: 12.5, color: "var(--color-neutral-600)" }}>Preferences</a>
      </div>
    </div>
  );
}
