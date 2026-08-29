export function SearchIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="7" cy="7" r="4.6" />
      <path d="M10.4 10.4L14 14" />
    </svg>
  );
}

export function CheckIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="#FFFFFF" strokeWidth="2.4">
      <path d="M3 9.5L7 13.5L15 5" />
    </svg>
  );
}

export function ArrowUpIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 13V3M3.5 7.5L8 3l4.5 4.5" />
    </svg>
  );
}

export function LinkedInIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
      <path d="M1 5.6h2.6V15H1zM2.3 1a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM5.6 5.6h2.5v1.3c.4-.7 1.3-1.5 2.8-1.5 2 0 3.1 1.3 3.1 3.8V15h-2.6v-4.4c0-1.2-.4-2-1.5-2-1 0-1.6.7-1.8 1.4-.1.2-.1.5-.1.8V15H5.6z" />
    </svg>
  );
}

export function XIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
      <path d="M12.2 1h2.4L9.5 6.9 15.5 15h-4.6L7.3 10.3 3.2 15H.8l5.4-6.2L.4 1h4.7l3.3 4.4zm-.9 12.5h1.3L4.4 2.4H3z" />
    </svg>
  );
}

export function HamburgerIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M0 1h22M0 8h22M0 15h22" />
    </svg>
  );
}

export function CloseIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M2 2l12 12M14 2L2 14" />
    </svg>
  );
}

export function ChevronDownIcon({ size = 12, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M1 1.5L6 6.5L11 1.5" />
    </svg>
  );
}
