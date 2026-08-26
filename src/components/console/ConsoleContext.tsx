"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "dark" | "light";

type ConsoleState = {
  theme: Theme;
  toggleTheme: () => void;
};

const ConsoleCtx = createContext<ConsoleState | null>(null);

export function ConsoleProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    try {
      const t = window.localStorage.getItem("emita-demo-theme");
      if (t === "dark" || t === "light") setTheme(t);
    } catch {}
  }, []);

  const toggleTheme = () => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      try { window.localStorage.setItem("emita-demo-theme", next); } catch {}
      return next;
    });
  };

  return (
    <ConsoleCtx.Provider value={{ theme, toggleTheme }}>
      {children}
    </ConsoleCtx.Provider>
  );
}

export function useConsole() {
  const ctx = useContext(ConsoleCtx);
  if (!ctx) throw new Error("useConsole must be used within ConsoleProvider");
  return ctx;
}
