import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import s from "@/styles/detail.module.css";
import { Reveal } from "@/components/Reveal";
import { ClosingCta } from "@/components/ClosingCta";
import { solutions, getSolution } from "@/lib/content/solutions";
import { getProduct } from "@/lib/content/products";

export function generateStaticParams() {
  return solutions.map((sol) => ({ slug: sol.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) return {};
  return { title: `${solution.title} — Emita`, description: solution.description };
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) notFound();

  const relatedProducts = solution.productSlugs.map((ps) => getProduct(ps)).filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <main>
      <section className={s.section}>
        <div className={s.heroPad}>
          <div className={s.kicker}>Solutions / {solution.title}</div>
          <h1 className={s.h1} style={{ maxWidth: "18ch" }}>{solution.headline}</h1>
          <p className={s.bodyLarge} style={{ margin: 0 }}>{solution.description}</p>
        </div>
      </section>

      <section className={`${s.section} ${s.surface}`}>
        <div className={s.sectionPad}>
          <div className={s.splitTwo}>
            <Reveal>
              <div className={s.splitTwoLeft}>
                <h2 className={s.splitTwoTitle}>Where utilities get stuck</h2>
                <div className={s.bulletList}>
                  {solution.stuck.map((t) => (
                    <div key={t} className={s.bulletRow}>{t}</div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal>
              <div className={s.splitTwoRight}>
                <h2 className={s.splitTwoTitle}>What Emita changes</h2>
                <div className={s.bulletList}>
                  {solution.changes.map((t) => (
                    <div key={t} className={s.bulletRow}>{t}</div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.sectionPad}>
          <Reveal><h2 className={s.h2} style={{ marginBottom: 36 }}>Products in this solution</h2></Reveal>
          <Reveal>
            <div className={s.relatedGrid}>
              {relatedProducts.map((p) => (
                <Link key={p.slug} href={`/products/${p.slug}`} className={s.relatedTile}>
                  <div className={s.relatedTitle}>{p.title}</div>
                  <div className={s.relatedBody}>{p.menuBlurb}</div>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <ClosingCta />
    </main>
  );
}
