import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import s from "@/styles/detail.module.css";
import { Reveal } from "@/components/Reveal";
import { ClosingCta } from "@/components/ClosingCta";
import { StatPanel } from "@/components/StatPanel";
import { products, getProduct } from "@/lib/content/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return { title: `${product.title} — Emita`, description: product.body };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return (
    <main>
      <section className={s.section}>
        <div className={`${s.container} ${s.heroSplit}`}>
          <div className={s.heroSplitLeft}>
            <div className={s.kicker}>Products / {product.title}</div>
            <h1 className={s.h1}>{product.headline}</h1>
            <p className={s.bodyLarge} style={{ maxWidth: "52ch" }}>{product.body}</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/demo" className="btn btn-primary" style={{ padding: "15px 26px", fontSize: 15 }}>Request a Demo</Link>
              {product.relatedSolution && (
                <Link href={`/solutions/${product.relatedSolution}`} className="btn btn-secondary" style={{ padding: "15px 26px", fontSize: 15 }}>
                  The related solution
                </Link>
              )}
            </div>
          </div>
          <div className={s.heroSplitRight}>
            <StatPanel label={product.statPanel.label} period={product.statPanel.period} rows={product.statPanel.rows} />
          </div>
        </div>
      </section>

      {product.howItWorks && (
        <section className={`${s.section} ${s.surface}`}>
          <div className={s.sectionPad}>
            <Reveal><h2 className={s.h2}>How it works</h2></Reveal>
            <Reveal>
              <div className={s.stepGrid}>
                {product.howItWorks.map((step) => (
                  <div key={step.n} className={s.stepItem}>
                    <div className={s.stepNum}>{step.n}</div>
                    <h4 className={s.stepTitle}>{step.title}</h4>
                    <p className={s.stepBody}>{step.body}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      <section className={product.howItWorks ? s.section : `${s.section} ${s.surface}`}>
        <div className={s.sectionPad}>
          <Reveal><h2 className={s.h2}>What it covers</h2></Reveal>
          <Reveal>
            <div className={s.arrowList} style={{ borderTop: "1px solid var(--color-divider)" }}>
              {product.covers.map((c) => (
                <div key={c} className={s.bulletRow} style={{ display: "flex", gap: 12 }}>
                  <span style={{ color: "var(--color-accent)", fontFamily: "ui-monospace, Menlo, monospace", fontSize: 11 }}>—</span>
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <ClosingCta />
    </main>
  );
}
