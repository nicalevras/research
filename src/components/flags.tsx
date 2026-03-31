import type { SVGProps } from 'react'

type FlagProps = SVGProps<SVGSVGElement>

function US(props: FlagProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" {...props}>
      <path fill="#bd3d44" d="M0 0h640v480H0" />
      <path stroke="#fff" strokeWidth="37" d="M0 55.3h640M0 129h640M0 203h640M0 277h640M0 351h640M0 425h640" />
      <path fill="#192f5d" d="M0 0h364.8v258.5H0" />
      <marker id="us-a" markerHeight="30" markerWidth="30">
        <path fill="#fff" d="m14 0 9 27L0 10h28L5 27z" />
      </marker>
      <path fill="none" markerMid="url(#us-a)" d="m0 0 16 11h61 61 61 61 60L47 37h61 61 60 61L16 63h61 61 61 61 60L47 89h61 61 60 61L16 115h61 61 61 61 60L47 141h61 61 60 61L16 166h61 61 61 61 60L47 192h61 61 60 61L16 218h61 61 61 61 60z" />
    </svg>
  )
}

function CA(props: FlagProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" {...props}>
      <path fill="#fff" d="M150.1 0h339.7v480H150z" />
      <path fill="#d52b1e" d="M-19.7 0h169.8v480H-19.7zm509.5 0h169.8v480H489.9zM201 232l-13.3 4.4 61.4 54c4.7 13.7-1.6 17.8-5.6 25l66.6-8.4-1.6 67 13.9-.3-3.1-66.6 66.7 8c-4.1-8.7-7.8-13.3-4-27.2l61.3-51-10.7-4c-8.8-6.8 3.8-32.6 5.6-48.9 0 0-35.7 12.3-38 5.8l-9.2-17.5-32.6 35.8c-3.5.9-5-.5-5.9-3.5l15-74.8-23.8 13.4q-3.2 1.3-5.2-2.2l-23-46-23.6 47.8q-2.8 2.5-5 .7L264 130.8l13.7 74.1c-1.1 3-3.7 3.8-6.7 2.2l-31.2-35.3c-4 6.5-6.8 17.1-12.2 19.5s-23.5-4.5-35.6-7c4.2 14.8 17 39.6 9 47.7" />
    </svg>
  )
}

function CH(props: FlagProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" {...props}>
      <path fill="#d52b1e" d="M0 0h640v480H0z" />
      <path fill="#fff" d="M170 195h300v90H170z" />
      <path fill="#fff" d="M275 90h90v300h-90z" />
    </svg>
  )
}

function DE(props: FlagProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" {...props}>
      <path fill="#ffce00" d="M0 320h640v160H0z" />
      <path d="M0 0h640v160H0z" />
      <path fill="#d00" d="M0 160h640v160H0z" />
    </svg>
  )
}

function FR(props: FlagProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" {...props}>
      <path fill="#fff" d="M0 0h640v480H0z" />
      <path fill="#00267f" d="M0 0h213.3v480H0z" />
      <path fill="#f31830" d="M426.7 0H640v480H426.7z" />
    </svg>
  )
}

function KR(props: FlagProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" {...props}>
      <path fill="#fff" d="M0 0h640v480H0z" />
      <g transform="translate(320 240) scale(4.5)">
        <circle fill="#c60c30" r="24" />
        <path fill="#003478" d="M-24 0a24 24 0 0 0 24 24A12 12 0 0 1 0 0a12 12 0 0 0-12-12A12 12 0 0 1 0-24 24 24 0 0 0-24 0" />
      </g>
    </svg>
  )
}

function CN(props: FlagProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" {...props}>
      <path fill="#de2910" d="M0 0h640v480H0z" />
      <path fill="#ffde00" d="M87.2 28.8l24.3 74.7-63.5-46.2h78.4L62.9 103.5z" />
      <path fill="#ffde00" d="M167.3 12.6l-19.1 11 3.2-21.8-15.8 15.3 6-21.3-20.2 9.2 10.5-19.4-22 4.7 14.8-16.3-22.1-1.6 18-11.6" transform="translate(26 58) rotate(23.4)" />
      <path fill="#ffde00" d="M167.3 12.6l-19.1 11 3.2-21.8-15.8 15.3 6-21.3-20.2 9.2 10.5-19.4-22 4.7 14.8-16.3-22.1-1.6 18-11.6" transform="translate(60 92) rotate(46)" />
      <path fill="#ffde00" d="M167.3 12.6l-19.1 11 3.2-21.8-15.8 15.3 6-21.3-20.2 9.2 10.5-19.4-22 4.7 14.8-16.3-22.1-1.6 18-11.6" transform="translate(56 140) rotate(70)" />
      <path fill="#ffde00" d="M167.3 12.6l-19.1 11 3.2-21.8-15.8 15.3 6-21.3-20.2 9.2 10.5-19.4-22 4.7 14.8-16.3-22.1-1.6 18-11.6" transform="translate(24 168) rotate(20)" />
    </svg>
  )
}

const FLAG_MAP: Record<string, (props: FlagProps) => JSX.Element> = {
  'USA': US,
  'Canada': CA,
  'Switzerland': CH,
  'Germany': DE,
  'France': FR,
  'South Korea': KR,
  'China': CN,
}

export function CountryFlag({ country, className }: { country: string; className?: string }) {
  const Flag = FLAG_MAP[country]
  if (!Flag) return null
  const size = className ?? 'h-4 w-4'
  return (
    <span className={`inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 ${size}`}>
      <Flag className="h-full w-auto min-w-[133%]" />
    </span>
  )
}
