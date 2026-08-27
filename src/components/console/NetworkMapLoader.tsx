"use client";

import dynamic from "next/dynamic";
import styles from "./console.module.css";

// Leaflet touches `window`/`document` at import time, so it can never run during SSR — this is
// the standard react-leaflet + Next.js App Router pattern: a client-only dynamic import, loaded
// from a page (server component) via this small client wrapper.
const NetworkMap = dynamic(() => import("./NetworkMap").then((m) => m.NetworkMap), {
  ssr: false,
  loading: () => <div className={styles.leafletLoading}>Loading map…</div>,
});

export function NetworkMapLoader() {
  return <NetworkMap />;
}
