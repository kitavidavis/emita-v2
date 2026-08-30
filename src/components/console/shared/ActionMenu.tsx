"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import styles from "../console.module.css";

export type MenuAction = {
  label: string;
  onSelect: () => void;
  danger?: boolean;
  icon?: ReactNode;
};

const MENU_WIDTH = 190; // matches .actionMenu's min-width

export function ActionMenu({ actions }: { actions: MenuAction[] }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // A table row's action menu used to be `position: absolute` inside a `.tableWrap` with
  // `overflow-x: auto` — CSS quietly turns that into `overflow-y: auto` too, so any menu that
  // opened near the bottom of the table got silently clipped, not covered. Portaling to <body>
  // with `position: fixed` coordinates escapes every ancestor's overflow, not just this table's.
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (btnRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  useEffect(() => {
    if (!open || !btnRef.current) return;
    const updatePosition = () => {
      const rect = btnRef.current!.getBoundingClientRect();
      const left = Math.max(4, Math.min(rect.right - MENU_WIDTH, window.innerWidth - MENU_WIDTH - 4));
      const spaceBelow = window.innerHeight - rect.bottom;
      const top = spaceBelow < 200 ? Math.max(4, rect.top - 4) : rect.bottom + 4;
      setCoords({ top, left });
    };
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open]);

  const spaceBelow = coords && btnRef.current ? window.innerHeight - btnRef.current.getBoundingClientRect().bottom : null;
  const opensUpward = spaceBelow !== null && spaceBelow < 200;

  return (
    <div className={styles.actionMenuWrap}>
      <button type="button" ref={btnRef} className={styles.kebabBtn} onClick={() => setOpen((v) => !v)} aria-label="Actions">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="8" cy="3" r="1.4" />
          <circle cx="8" cy="8" r="1.4" />
          <circle cx="8" cy="13" r="1.4" />
        </svg>
      </button>
      {open && coords && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={menuRef}
              className={styles.actionMenu}
              style={{ position: "fixed", top: coords.top, left: coords.left, right: "auto", transform: opensUpward ? "translateY(-100%)" : "none" }}
            >
              {actions.map((a) => (
                <button
                  key={a.label}
                  type="button"
                  className={`${styles.actionMenuItem} ${a.danger ? styles.actionMenuItemDanger : ""}`}
                  onClick={() => {
                    setOpen(false);
                    a.onSelect();
                  }}
                >
                  {a.icon}
                  {a.label}
                </button>
              ))}
            </div>,
            // Portal into the console shell, not document.body: the shell defines the dark-theme
            // CSS custom properties (--d-panel, --d-line-2, ...) that .actionMenu depends on, and
            // those only inherit through the real DOM tree, not React's component tree. Landing
            // outside it renders a fully transparent, unreadable menu.
            btnRef.current?.closest('[class*="shell"]') ?? document.body
          )
        : null}
    </div>
  );
}
