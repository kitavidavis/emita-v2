export function GisMap() {
  return (
    <svg viewBox="0 0 640 300" style={{ width: "100%", height: "auto", border: "1px solid var(--color-divider)" }}>
      <rect width="640" height="300" fill="#F7F9FC" />
      <g stroke="#111827" strokeWidth="1" opacity="0.18">
        <path d="M0 60H640M0 120H640M0 180H640M0 240H640" />
        <path d="M80 0V300M160 0V300M240 0V300M320 0V300M400 0V300M480 0V300M560 0V300" />
      </g>
      <g stroke="#111827" strokeWidth="2" fill="none">
        <path d="M40 250L140 160L260 175L360 90L520 110L600 60" />
        <path d="M140 160L170 60" />
        <path d="M260 175L280 270" />
        <path d="M360 90L420 230L560 250" />
      </g>
      <path d="M300 40L470 40L470 150L300 150Z" fill="#2F80ED" opacity="0.12" stroke="#2F80ED" strokeWidth="2" />
      <g fill="#111827">
        <circle cx="140" cy="160" r="5" />
        <circle cx="260" cy="175" r="5" />
        <circle cx="520" cy="110" r="5" />
        <circle cx="420" cy="230" r="5" />
      </g>
      <circle cx="360" cy="90" r="8" fill="#2F80ED" />
      <circle cx="360" cy="90" r="8" fill="#2F80ED" style={{ animation: "emita-pulse 2.2s ease-in-out infinite" }} />
      <g fontFamily="var(--font-heading)" fontSize="10" letterSpacing="1.2" fill="#111827">
        <text x="306" y="32">DMA 04 — UNDER INVESTIGATION</text>
        <text x="46" y="272">ZONE BOUNDARY</text>
      </g>
    </svg>
  );
}
