export default function Logo() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <CastleMark size={28} />
      <span style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>Chateaux Rouge</span>
    </span>
  )
}

export function CastleMark({ size = 32, door = '#F7F3EE' }: { size?: number; door?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <g fill="#B3122E">
        <rect x="8" y="28" width="14" height="28" rx="3.5" />
        <rect x="10" y="18" width="4.2" height="12" rx="1.6" />
        <rect x="16" y="18" width="4.2" height="12" rx="1.6" />
        <rect x="25" y="14" width="14" height="42" rx="3.5" />
        <rect x="27" y="6" width="4.2" height="10" rx="1.6" />
        <rect x="33" y="6" width="4.2" height="10" rx="1.6" />
        <rect x="42" y="28" width="14" height="28" rx="3.5" />
        <rect x="44" y="18" width="4.2" height="12" rx="1.6" />
        <rect x="50" y="18" width="4.2" height="12" rx="1.6" />
      </g>
      <path fill={door} d="M29.2 43.2a2.8 2.8 0 0 1 5.6 0V56h-5.6V43.2z" />
    </svg>
  )
}
