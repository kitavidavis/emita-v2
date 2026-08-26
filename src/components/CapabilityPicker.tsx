"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./CapabilityPicker.module.css";
import { products } from "@/lib/content/products";

export function CapabilityPicker() {
  const [active, setActive] = useState(0);
  const cat = products[active];

  return (
    <>
      <div className={styles.tabs}>
        {products.map((p, i) => (
          <button key={p.slug} type="button" className={styles.tab} onClick={() => setActive(i)}>
            {i === active && <span className={styles.selBar} />}
            <div className={styles.tabTitle}>{p.title}</div>
            <div className={styles.tabBody}>{p.menuBlurb}</div>
          </button>
        ))}
      </div>
      <div className={styles.detail}>
        <div className={styles.detailLeft}>
          <div className={styles.kicker}>Selected capability</div>
          <h3 className={styles.detailTitle}>{cat.title}</h3>
          <p className={styles.detailBody}>{cat.body}</p>
          <Link href={`/products/${cat.slug}`} className="btn btn-ghost" style={{ paddingLeft: 0 }}>Learn more →</Link>
        </div>
        <div className={styles.detailRight}>
          <div className={styles.coversLabel}>What it covers</div>
          <div className={styles.coversGrid}>
            {cat.covers.map((t) => (
              <div key={t} className={styles.coversRow}>
                <span className={styles.coversDash}>—</span>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
