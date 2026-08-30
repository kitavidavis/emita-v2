"use client";

import { useCallback, useRef, useState } from "react";
import styles from "../console.module.css";

export type ToastItem = { id: number; message: string };

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const show = useCallback((message: string) => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3400);
  }, []);

  return { toasts, show };
}

export function ToastStack({ toasts }: { toasts: ToastItem[] }) {
  if (toasts.length === 0) return null;
  return (
    <div className={styles.toastStack}>
      {toasts.map((t) => (
        <div key={t.id} className={styles.toast}>
          <svg className={styles.toastIcon} width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="8" cy="8" r="6.5" />
            <path d="M5.2 8.2l1.8 1.8 3.8-4.2" />
          </svg>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
