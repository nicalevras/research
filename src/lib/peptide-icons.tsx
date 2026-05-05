export const PEPTIDE_ICON_LABELS: Record<string, string> = {
  '5-amino-1mq': '1MQ',
  'acetic-acid': 'ACID',
  adamax: 'ADMX',
  adipotide: 'ADIP',
  'ahk-cu': 'AHK',
  aicar: 'AICAR',
  'aod-9604': 'AOD',
  'ara-290': 'ARA',
  astaxanthin: 'ASTA',
  'b-12': 'B12',
  'bacteriostatic-water': 'BAC',
  'bpc-157': 'BPC',
  'bpc-157-ghk-cu': 'BPC/GHK',
  'bpc-157-tb-500': 'BPC/TB',
  bronchogen: 'BRON',
  cagrilintide: 'CAGRI',
  'cagrilintide-ipamorelin': 'CAG/IPA',
  'cagrilintide-semaglutide': 'CAG/SEMA',
  cardiogen: 'CARD',
  cartalax: 'CART',
  'cjc-1295': 'CJC',
  'cjc-1295-ipamorelin': 'CJC/IPA',
  cortagen: 'CORT',
  dsip: 'DSIP',
  epitalon: 'EPI',
  'follistatin-344': 'FST',
  'foxo4-dri': 'FOXO',
  'ghk-cu': 'GHK',
  'ghrp-2': 'GHRP2',
  'ghrp-6': 'GHRP6',
  glow: 'GLOW',
  glutathione: 'GLUT',
  gonadorelin: 'GONA',
  hcg: 'HCG',
  hexarelin: 'HEXA',
  'hgh-frag-176-191': 'FRAG',
  hmg: 'HMG',
  humanin: 'HMN',
  'igf-1-lr3': 'IGF',
  ipamorelin: 'IPA',
  kisspeptin: 'KISS',
  klow: 'KLOW',
  kpv: 'KPV',
  'l-carnitine': 'LCAR',
  'lipo-c': 'LIPO',
  'lipo-c-b-12': 'LIPO/B12',
  'll-37': 'LL37',
  mazdutide: 'MAZD',
  'melanotan-i': 'MT1',
  'melanotan-ii': 'MT2',
  'mots-c': 'MOTS',
  'nad-plus': 'NAD',
  'nad-plus-buffered': 'NAD-B',
  oxytocin: 'OXY',
  'p-21': 'P21',
  pancragen: 'PANC',
  pda: 'PDA',
  'pe-12-28': 'PE12',
  'pe-22-28': 'PE22',
  'peg-mgf': 'MGF',
  pinealon: 'PINE',
  'pnc-27': 'PNC27',
  'pnc-28': 'PNC28',
  'pt-141': 'PT141',
  retatrutide: 'RETA',
  'retatrutide-cagrilintide': 'RETA/CAG',
  'retatrutide-tirzepatide': 'RETA/TZ',
  selank: 'SEL',
  semaglutide: 'SEMA',
  semax: 'SMAX',
  'semax-selank': 'SMX/SEL',
  sermorelin: 'SERM',
  'slu-pp-332': 'SLU',
  'snap-8': 'SNAP8',
  'ss-31': 'SS31',
  survodutide: 'SURVO',
  'tb-500': 'TB500',
  'tb-500-frag-17-23': 'TB/FRAG',
  tesamorelin: 'TESA',
  'tesamorelin-ipamorelin': 'TESA/IPA',
  testagen: 'TSTG',
  thymagen: 'THYG',
  thymalin: 'THYM',
  'thymosin-alpha-1': 'TA1',
  thymulin: 'THYU',
  tirzepatide: 'TIRZ',
  vesugen: 'VESU',
  vilon: 'VIL',
  vip: 'VIP',
}

function peptideInitials(name: string) {
  return name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 2).toUpperCase() || 'PE'
}

export function peptideIconLabel(id: string, name: string) {
  return PEPTIDE_ICON_LABELS[id] ?? peptideInitials(name)
}

function peptideAvatarFontSize(label: string) {
  const lines = label.split('\n')
  const longestLine = Math.max(...lines.map((line) => line.length))

  if (lines.length > 1) return longestLine >= 8 ? 72 : 82
  if (longestLine >= 10) return 58
  if (longestLine >= 8) return 68
  if (longestLine >= 6) return 78
  return 92
}

function peptideAvatarLetterSpacing(label: string) {
  return label.replace(/\n/g, '').length >= 8 ? '-1' : '-2'
}

function peptideAvatarVerticalOffset(label: string) {
  return label.includes('\n') ? 8 : 12
}

interface PeptideAvatarProps {
  id: string
  name: string
  className?: string
}

export function PeptideAvatar({ id, name, className = '' }: PeptideAvatarProps) {
  const label = peptideIconLabel(id, name)
  const lines = label.split('\n')
  const fontSize = peptideAvatarFontSize(label)
  const lineHeight = Math.round(fontSize * 0.92)
  const startY = 256 + peptideAvatarVerticalOffset(label) - ((lines.length - 1) * lineHeight) / 2

  return (
    <svg
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="peptide-avatar-b" x1="52" y1="24" x2="460" y2="486" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#7b7f85" />
          <stop offset=".12" stopColor="#2a2d32" />
          <stop offset=".36" stopColor="#07090d" />
          <stop offset=".74" stopColor="#030507" />
          <stop offset="1" stopColor="#24282e" />
        </linearGradient>
        <linearGradient id="peptide-avatar-c" x1="54" y1="26" x2="446" y2="462" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4b4f55" />
          <stop offset=".13" stopColor="#25282e" />
          <stop offset=".34" stopColor="#080b10" />
          <stop offset=".72" stopColor="#030507" />
          <stop offset="1" stopColor="#020407" />
        </linearGradient>
        <linearGradient id="peptide-avatar-d" x1="38" y1="24" x2="450" y2="460" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity=".86" />
          <stop offset=".18" stopColor="#eef0f2" stopOpacity=".8" />
          <stop offset=".48" stopColor="#6b7078" stopOpacity=".38" />
          <stop offset=".82" stopColor="#30343a" stopOpacity=".18" />
          <stop offset="1" stopColor="#fff" stopOpacity=".6" />
        </linearGradient>
        <linearGradient id="peptide-avatar-g" x1="24" y1="398" x2="210" y2="296" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#313844" stopOpacity=".82" />
          <stop offset=".45" stopColor="#252b33" stopOpacity=".58" />
          <stop offset="1" stopColor="#1a1e24" stopOpacity=".3" />
        </linearGradient>
        <radialGradient
          id="peptide-avatar-e"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="rotate(44 -12.518 143.629)scale(230 182)"
        >
          <stop offset="0" stopColor="#fff" stopOpacity=".28" />
          <stop offset=".42" stopColor="#fff" stopOpacity=".08" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <clipPath id="peptide-avatar-f">
          <rect x="28" y="12" width="456" height="456" rx="66" />
        </clipPath>
        <filter
          id="peptide-avatar-a"
          x="4"
          y="2"
          width="504"
          height="508"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#000" floodOpacity=".18" />
        </filter>
      </defs>
      <path fill="transparent" d="M0 0h512v512H0z" />
      <g filter="url(#peptide-avatar-a)">
        <rect x="12" y="4" width="488" height="488" rx="76" fill="url(#peptide-avatar-b)" />
        <rect x="28" y="12" width="456" height="456" rx="66" fill="url(#peptide-avatar-c)" stroke="url(#peptide-avatar-d)" strokeWidth="3" />
        <rect x="28" y="12" width="456" height="456" rx="66" fill="url(#peptide-avatar-e)" clipPath="url(#peptide-avatar-f)" />
        <g
          stroke="url(#peptide-avatar-g)"
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeLinecap="round"
          clipPath="url(#peptide-avatar-f)"
          opacity=".82"
        >
          <path d="m26 344 24-14 24 14v28l-24 14-24-14z" />
          <path d="m74 344 24-14 24 14v28l-24 14-24-14z" />
          <path d="m122 344 24-14 24 14v28l-24 14-24-14z" />
          <path d="m170 344 24-14 24 14v28l-24 14-24-14z" />
          <path d="m50 386 24-14 24 14v28l-24 14-24-14z" />
          <path d="m98 386 24-14 24 14v28l-24 14-24-14z" />
          <path d="m146 386 24-14 24 14v28l-24 14-24-14z" />
        </g>
        <text
          x="256"
          y={startY}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize={fontSize}
          fontWeight="700"
          letterSpacing={peptideAvatarLetterSpacing(label)}
        >
          {lines.map((line, index) => (
            <tspan key={`${line}-${index}`} x="256" dy={index === 0 ? 0 : lineHeight}>
              {line}
            </tspan>
          ))}
        </text>
      </g>
    </svg>
  )
}
