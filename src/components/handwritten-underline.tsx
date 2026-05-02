import type { ReactNode } from 'react'

type HandwrittenUnderlineProps = {
  children: ReactNode
  color?: string
}

export function HandwrittenUnderline({
  children,
  color = '#f59e0b',
}: Readonly<HandwrittenUnderlineProps>) {
  return (
    <span className="relative inline-block whitespace-nowrap pb-[0.18em]">
      <span className="relative z-10">{children}</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 240 32"
        preserveAspectRatio="none"
        className="handwritten-underline pointer-events-none absolute bottom-[-0.06em] left-[-0.04em] h-[0.38em] w-[calc(100%+0.12em)] overflow-visible"
      >
        <path
          d="M4 18.8C43 19.7 82 18.1 121 18.6C157 19.1 195 17.6 236 18.3"
          pathLength="1"
          stroke={color}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M9 22.2C49 22.8 89 20.9 129 21.1C164 21.4 197 23.5 236 17"
          pathLength="1"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.95"
          fill="none"
        />
      </svg>
    </span>
  )
}
