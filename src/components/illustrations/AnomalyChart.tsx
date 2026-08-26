export function AnomalyChart() {
  return (
    <svg viewBox="0 0 700 280" style={{ width: "100%", height: "auto", background: "var(--color-bg)", border: "1px solid var(--color-divider)" }}>
      <g stroke="#111827" strokeWidth="1" opacity="0.15">
        <path d="M0 70H700M0 140H700M0 210H700" />
      </g>
      <path d="M20 210L80 200L140 208L200 196L260 205L320 199L380 120L440 112L500 118L560 108L620 115L680 110" fill="none" stroke="#111827" strokeWidth="2.5" />
      <path d="M380 20V280" stroke="#2F80ED" strokeWidth="2" strokeDasharray="6 6" />
      <circle cx="380" cy="120" r="7" fill="#2F80ED" />
      <g fontFamily="var(--font-heading)" fontSize="11" letterSpacing="1.2" fill="#111827">
        <text x="20" y="30">NIGHT FLOW — DMA 04</text>
        <text x="392" y="46" fill="#2F80ED">STEP CHANGE DETECTED</text>
      </g>
    </svg>
  );
}

export function UnderstandDiagram() {
  return (
    <svg viewBox="0 0 320 120" style={{ width: "100%", height: "auto", marginTop: 8 }}>
      <g stroke="#111827" strokeWidth="1.5" fill="none" opacity="0.5">
        <path d="M10 20H120L160 60L120 100H10" />
        <path d="M310 20H200L160 60L200 100H310" />
      </g>
      <rect x="140" y="40" width="40" height="40" fill="#2F80ED" />
    </svg>
  );
}

export function ReportBars() {
  return (
    <svg viewBox="0 0 400 200" style={{ width: "100%", height: "auto" }}>
      <g fill="#111827">
        <rect x="10" y="120" width="46" height="80" />
        <rect x="76" y="90" width="46" height="110" />
        <rect x="142" y="140" width="46" height="60" />
        <rect x="274" y="60" width="46" height="140" />
        <rect x="340" y="105" width="46" height="95" />
      </g>
      <rect x="208" y="30" width="46" height="170" fill="#2F80ED" />
    </svg>
  );
}
