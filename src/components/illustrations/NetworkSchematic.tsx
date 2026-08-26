export function NetworkSchematic() {
  return (
    <svg viewBox="0 0 520 520" style={{ width: "100%", height: "auto" }} aria-label="Schematic of a connected utility network">
      <g stroke="#111827" strokeWidth="1" opacity="0.18">
        <path d="M0 60H520M0 160H520M0 260H520M0 360H520M0 460H520" />
        <path d="M60 0V520M160 0V520M260 0V520M360 0V520M460 0V520" />
      </g>
      <g stroke="#111827" strokeWidth="2" fill="none">
        <path d="M60 160H260V60H460" />
        <path d="M260 160V360H460" />
        <path d="M60 160V460H260" />
      </g>
      <path d="M60 160H260V60H460" stroke="#2F80ED" strokeWidth="2" fill="none" strokeDasharray="14 206" style={{ animation: "emita-dash 3.4s linear infinite" }} />
      <g fill="#f3f2f2" stroke="#111827" strokeWidth="2">
        <rect x="46" y="146" width="28" height="28" />
        <rect x="246" y="146" width="28" height="28" />
        <rect x="246" y="46" width="28" height="28" />
        <rect x="446" y="346" width="28" height="28" />
        <rect x="246" y="446" width="28" height="28" />
      </g>
      <rect x="444" y="44" width="32" height="32" fill="#2F80ED" />
      <rect x="444" y="44" width="32" height="32" fill="#2F80ED" style={{ animation: "emita-pulse 2.6s ease-in-out infinite" }} />
      <g fontFamily="var(--font-heading)" fontSize="11" fontWeight={600} fill="#111827" letterSpacing="1.4">
        <text x="46" y="196">DMA 04</text>
        <text x="246" y="196">TRUNK MAIN</text>
        <text x="246" y="96" textAnchor="start" dx="40">PRESSURE</text>
        <text x="356" y="36">ANOMALY</text>
        <text x="446" y="396">PUMP ST.</text>
        <text x="246" y="496">METER CLUSTER</text>
      </g>
      <g fontFamily="var(--font-heading)" fontSize="10" fill="#2F80ED" letterSpacing="1.2">
        <text x="356" y="52">FLAGGED 04:12</text>
      </g>
    </svg>
  );
}
