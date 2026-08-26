"use client";

import { useId, useState } from "react";
import styles from "./authForm.module.css";

export function PasswordField({
  label,
  name,
  placeholder = "••••••••••",
  minLength,
  wrap = true,
  onChange,
}: {
  label?: string;
  name: string;
  placeholder?: string;
  minLength?: number;
  wrap?: boolean;
  onChange?: (value: string) => void;
}) {
  const [show, setShow] = useState(false);
  const id = useId();

  const control = (
    <div className={styles.passwordBox}>
      <input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        required
        minLength={minLength}
        className={styles.passwordInput}
        onChange={(e) => onChange?.(e.target.value)}
      />
      <button type="button" className={styles.toggleBtn} onClick={() => setShow((s) => !s)}>
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );

  if (!wrap) return control;

  return (
    <div className={styles.field}>
      {label && <label htmlFor={id} className={styles.label}>{label}</label>}
      {control}
    </div>
  );
}
