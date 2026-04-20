import { useEffect, useRef, useState } from 'react'
import { CopyIcon } from '~/components/icons'

interface CopyButtonProps {
  value: string
  className?: string
  label?: string
  unstyled?: boolean
}

async function writeClipboard(value: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value)
    return
  }

  if (typeof document === 'undefined') return

  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.left = '-9999px'
  textarea.style.top = '0'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  textarea.remove()
}

export function CopyButton({ value, className = '', label = 'Copy', unstyled = false }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tooltipText = copied ? 'Copied' : 'Copy'
  const tooltipVisibility = copied ? 'opacity-100' : 'opacity-0 group-hover/copy:opacity-100 group-focus-visible/copy:opacity-100'

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleCopy = async () => {
    await writeClipboard(value)
    setCopied(true)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setCopied(false), 1400)
  }

  return (
    <button
      type="button"
      className={`group/copy relative inline-flex shrink-0 items-center justify-center transition-colors cursor-pointer disabled:opacity-50 ${unstyled ? '' : 'rounded-lg border'} ${className}`}
      onClick={handleCopy}
      aria-label={`${label} ${value}`}
    >
      <CopyIcon className="h-4 w-4" aria-hidden="true" />
      <span
        role="tooltip"
        className={`pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-neutral-950 px-2 py-1 text-xs font-medium text-white shadow-sm transition-opacity dark:bg-white dark:text-neutral-950 ${tooltipVisibility}`}
      >
        {tooltipText}
      </span>
    </button>
  )
}
