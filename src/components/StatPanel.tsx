import type { StatRow } from "@/lib/content/products";

export function StatPanel({ label, period, rows }: { label: string; period: string; rows: StatRow[] }) {
  return (
    <div style={{ width: "100%", border: "2px solid var(--color-divider)" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderBottom: "2px solid var(--color-divider)",
          fontSize: 10.5,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--color-neutral-600)",
        }}
      >
        <span>{label}</span>
        <span>{period}</span>
      </div>
      {rows.map((row, i) => (
        <div
          key={row.name}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 16px",
            borderBottom: i === rows.length - 1 ? "none" : "1px solid var(--color-divider)",
            fontSize: 14,
          }}
        >
          <span style={{ fontWeight: 600 }}>{row.name}</span>
          <span style={{ flex: 1, height: 8, background: "var(--color-neutral-300)", margin: "0 16px" }}>
            <span
              style={{
                display: "block",
                width: `${row.percent}%`,
                height: 8,
                background: row.tone === "accent" ? "var(--color-accent)" : "var(--color-neutral-700)",
              }}
            />
          </span>
          <span style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 12 }}>{row.value}</span>
        </div>
      ))}
      <div style={{ padding: "10px 16px", borderTop: "2px solid var(--color-divider)", fontSize: 11, color: "var(--color-neutral-600)" }}>
        Illustrative figures — not customer data.
      </div>
    </div>
  );
}
