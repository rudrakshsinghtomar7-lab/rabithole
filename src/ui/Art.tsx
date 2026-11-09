import type { ArtMotif } from '../content/types'

// Sculptural, conceptual compositions drawn in each subject's palette (via --s-art / --s-art-2).
// Decorative: hidden from assistive tech; reels carry their meaning in text.

const A = 'var(--s-art)'
const B = 'var(--s-art-2)'

const motifs: Record<ArtMotif, React.ReactNode> = {
  pillars: (
    <>
      <path d="M28 52h144l-72-34z" fill={A} />
      <rect x={34} y={58} width={132} height={7} fill={A} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={46 + i * 44} y={72} width={20} height={94} rx={3} fill={i === 1 ? B : A} />
      ))}
      <rect x={24} y={168} width={152} height={10} fill={A} />
      <rect x={14} y={180} width={172} height={8} fill={B} />
    </>
  ),
  ballot: (
    <>
      <rect x={40} y={92} width={120} height={84} rx={6} fill={A} />
      <rect x={70} y={92} width={60} height={8} fill={B} />
      <rect x={78} y={30} width={48} height={70} rx={3} fill="none" stroke={A} strokeWidth={4} transform="rotate(-8 102 65)" />
      <path d="M88 64l10 10 18-22" stroke={B} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" transform="rotate(-8 102 65)" />
    </>
  ),
  globe: (
    <>
      <circle cx={100} cy={100} r={72} fill="none" stroke={A} strokeWidth={5} />
      <ellipse cx={100} cy={100} rx={30} ry={72} fill="none" stroke={A} strokeWidth={3} />
      <path d="M30 76h140M28 124h144M100 28v144" stroke={A} strokeWidth={3} />
      <path d="M62 58c14 6 20 20 14 32s-22 12-26 26c-2 8 4 16 10 22" fill="none" stroke={B} strokeWidth={9} strokeLinecap="round" />
      <path d="M120 70c10 2 22 12 22 26s-14 18-16 30" fill="none" stroke={B} strokeWidth={9} strokeLinecap="round" />
    </>
  ),
  mountain: (
    <>
      <path d="M10 176l62-108 30 46 22-34 66 96z" fill={A} />
      <path d="M72 68l-14 24 14-6 12 10z" fill={B} />
      <path d="M20 46c10-10 26-10 36 0M30 34c6-6 14-6 20 0" stroke={B} strokeWidth={4} fill="none" strokeLinecap="round" />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${22 + i * 10} 56l-6 14`} stroke={B} strokeWidth={3} strokeLinecap="round" />
      ))}
    </>
  ),
  coins: (
    <>
      {[0, 1, 2, 3].map((i) => (
        <ellipse key={i} cx={70} cy={160 - i * 18} rx={40} ry={12} fill={i % 2 ? B : A} stroke={A} strokeWidth={2} />
      ))}
      {[0, 1].map((i) => (
        <ellipse key={i} cx={138} cy={160 - i * 18} rx={34} ry={10} fill={i % 2 ? A : B} stroke={A} strokeWidth={2} />
      ))}
      <circle cx={140} cy={62} r={26} fill="none" stroke={A} strokeWidth={5} />
      <circle cx={140} cy={62} r={15} fill={B} />
      <circle cx={140} cy={62} r={6} fill={A} />
    </>
  ),
  chart: (
    <>
      <path d="M24 24v152h156" stroke={A} strokeWidth={4} fill="none" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={40 + i * 28} y={150 - i * i * 6 - i * 8} width={18} height={26 + i * i * 6 + i * 8} fill={i === 4 ? B : A} />
      ))}
      <path d="M40 140 C 80 130, 120 100, 168 40" stroke={B} strokeWidth={5} fill="none" strokeLinecap="round" />
    </>
  ),
  flask: (
    <>
      <path d="M80 24h40M88 24v50l-46 86a12 12 0 0 0 10 18h96a12 12 0 0 0 10-18l-46-86V24" fill="none" stroke={A} strokeWidth={5} strokeLinejoin="round" />
      <path d="M58 132h84l18 34a6 6 0 0 1-5 9H45a6 6 0 0 1-5-9z" fill={A} />
      <circle cx={92} cy={150} r={7} fill={B} />
      <circle cx={114} cy={160} r={5} fill={B} />
      <circle cx={104} cy={104} r={4} fill={A} />
      <circle cx={118} cy={88} r={3} fill={A} />
    </>
  ),
  ship: (
    <>
      <path d="M20 128h160l-22 30H44z" fill={A} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} x={38 + i * 18} y={112} width={14} height={14} fill={i % 3 === 0 ? B : A} opacity={i % 3 === 0 ? 1 : 0.9} />
      ))}
      <path d="M100 30v80" stroke={A} strokeWidth={4} />
      <path d="M104 36c34 14 44 44 40 70h-40z" fill={A} />
      <path d="M96 48c-22 12-30 34-28 58h28z" fill={B} />
      <path d="M10 170c20-8 40 8 60 0s40 8 60 0 40 8 60 0" stroke={A} strokeWidth={3} fill="none" />
    </>
  ),
  figure: (
    <>
      <circle cx={78} cy={58} r={22} fill={A} />
      <path d="M48 180c0-50 12-90 30-90s30 40 30 90z" fill={A} />
      <circle cx={132} cy={58} r={22} fill="none" stroke={A} strokeWidth={4} />
      <path d="M102 180c0-50 12-90 30-90s30 40 30 90z" fill="none" stroke={A} strokeWidth={4} />
      <rect x={20} y={180} width={160} height={4} fill={B} />
    </>
  ),
  mirror: (
    <>
      <ellipse cx={100} cy={96} rx={58} ry={78} fill="none" stroke={A} strokeWidth={5} />
      <path d="M100 18v156" stroke={B} strokeWidth={3} strokeDasharray="6 7" />
      <path d="M70 70a18 18 0 1 1 0 .1zM58 150c0-32 6-50 12-50s12 18 12 50z" fill={A} />
      <path d="M130 70a18 18 0 1 1 0 .1zM118 150c0-32 6-50 12-50s12 18 12 50z" fill={A} opacity={0.4} />
    </>
  ),
  branch: (
    <>
      <path d="M100 186V112M100 112L52 50M100 112l48-62" stroke={A} strokeWidth={6} fill="none" strokeLinecap="round" />
      <circle cx={100} cy={112} r={10} fill={B} />
      <circle cx={52} cy={44} r={16} fill={A} />
      <circle cx={148} cy={44} r={16} fill="none" stroke={A} strokeWidth={5} />
    </>
  ),
  scales: (
    <>
      <path d="M100 30v140M60 176h80" stroke={A} strokeWidth={5} strokeLinecap="round" />
      <path d="M36 66l128-14" stroke={A} strokeWidth={5} strokeLinecap="round" />
      <path d="M36 66l-20 44h40zM164 52l-20 44h40z" fill="none" stroke={A} strokeWidth={3} />
      <path d="M16 110a20 10 0 0 0 40 0zM144 96a20 10 0 0 0 40 0z" fill={B} />
      <circle cx={100} cy={30} r={8} fill={A} />
    </>
  ),
  columns: (
    <>
      <path d="M20 54L100 18l80 36z" fill={A} />
      <rect x={24} y={58} width={152} height={8} fill={A} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={36 + i * 36} y={72} width={20} height={96} fill={i === 2 ? B : A} />
      ))}
      <rect x={16} y={170} width={168} height={12} fill={A} />
    </>
  ),
  arch: (
    <>
      <path d="M30 186V96a70 70 0 0 1 140 0v90h-34V100a36 36 0 0 0-72 0v86z" fill={A} />
      <path d="M64 186v-60h72v60" fill={B} opacity={0.6} />
      <rect x={14} y={186} width={172} height={6} fill={A} />
    </>
  ),
  timeline: (
    <>
      <path d="M16 100h168" stroke={A} strokeWidth={4} />
      {[30, 76, 122, 168].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy={100} r={i === 2 ? 14 : 9} fill={i === 2 ? B : A} />
          <rect x={x - 2} y={i % 2 ? 112 : 50} width={4} height={38} fill={A} />
        </g>
      ))}
    </>
  ),
  tablets: (
    <>
      <rect x={30} y={36} width={64} height={130} rx={30} fill={A} />
      <rect x={106} y={50} width={64} height={116} rx={6} fill="none" stroke={A} strokeWidth={4} />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={44} y={70 + i * 16} width={36 - (i % 2) * 10} height={4} fill={B} />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={118} y={72 + i * 16} width={40 - (i % 3) * 8} height={3} fill={A} />
      ))}
    </>
  ),
  dominoes: (
    <>
      <rect x={24} y={70} width={26} height={100} fill={A} />
      <rect x={66} y={70} width={26} height={100} fill={A} transform="rotate(14 79 170)" />
      <rect x={108} y={70} width={26} height={100} fill={A} transform="rotate(36 121 170)" />
      <rect x={150} y={70} width={26} height={100} fill={B} transform="rotate(62 163 170)" />
      <rect x={14} y={170} width={172} height={5} fill={A} />
      <circle cx={37} cy={50} r={8} fill={B} />
    </>
  ),
  target: (
    <>
      <circle cx={100} cy={100} r={78} fill="none" stroke={A} strokeWidth={5} />
      <circle cx={100} cy={100} r={52} fill="none" stroke={A} strokeWidth={5} />
      <circle cx={100} cy={100} r={24} fill={B} />
      <path d="M186 14L104 96" stroke={A} strokeWidth={6} strokeLinecap="round" />
      <path d="M186 14l-26 4 22 22z" fill={A} />
    </>
  ),
  arrow: (
    <>
      <path d="M18 150L120 48" stroke={A} strokeWidth={22} strokeLinecap="square" />
      <path d="M78 40h82v82z" fill={A} />
      <rect x={18} y={160} width={60} height={22} fill={B} />
    </>
  ),
  grid: (
    <>
      {Array.from({ length: 16 }, (_, i) => {
        const x = 24 + (i % 4) * 40
        const y = 24 + Math.floor(i / 4) * 40
        const on = [0, 5, 6, 10, 15].includes(i)
        return <rect key={i} x={x} y={y} width={32} height={32} rx={i === 10 ? 16 : 3} fill={on ? (i === 10 ? B : A) : 'none'} stroke={A} strokeWidth={2.5} />
      })}
    </>
  ),
  stack: (
    <>
      <rect x={40} y={140} width={120} height={30} fill={A} />
      <rect x={52} y={104} width={96} height={30} fill={B} />
      <rect x={64} y={68} width={72} height={30} fill={A} />
      <rect x={78} y={32} width={44} height={30} fill="none" stroke={A} strokeWidth={4} />
    </>
  ),
  curve: (
    <>
      <path d="M26 20v156h156" stroke={A} strokeWidth={4} fill="none" />
      <path d="M44 40c30 70 70 110 130 124" stroke={A} strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d="M44 160c40-10 90-60 126-128" stroke={B} strokeWidth={6} fill="none" strokeLinecap="round" />
      <circle cx={104} cy={118} r={9} fill={A} />
    </>
  ),
}

export function Art({ motif, className }: { motif: ArtMotif; className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false">
      {motifs[motif] ?? motifs.grid}
    </svg>
  )
}

export const subjectMotif: Record<string, ArtMotif> = {
  philosophy: 'mirror',
  history: 'columns',
  marketing: 'target',
  politics: 'ballot',
  economics: 'coins',
  geography: 'globe',
  finance: 'chart',
  science: 'flask',
  course: 'stack',
  neutral: 'grid',
}
