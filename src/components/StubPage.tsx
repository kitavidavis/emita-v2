import Link from "next/link";
import s from "@/styles/detail.module.css";

export function StubPage({ kicker, title, body }: { kicker: string; title: string; body: string }) {
  return (
    <main>
      <section className={s.section}>
        <div className={s.heroPad} style={{ paddingBottom: 96 }}>
          <div className={s.kicker}>{kicker}</div>
          <h1 className={s.h1} style={{ maxWidth: "18ch" }}>{title}</h1>
          <p className={s.bodyLarge} style={{ margin: "0 0 12px" }}>{body}</p>
          <Link href="/demo" className="btn btn-secondary" style={{ padding: "13px 22px" }}>Get in touch →</Link>
        </div>
      </section>
    </main>
  );
}
