import { useRef, useState, useEffect, useCallback } from 'react'
import type { Tag } from '~/lib/types'
import { ChevronLeftIcon, ChevronRightIcon } from '~/components/icons'

interface PillNavProps {
  tags: Tag[]
  activeTags: string[]
  onToggleTag: (tagId: string) => void
}

function arrowStyle(active: boolean) {
  return `absolute z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-white/[0.06] transition-colors text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white ${
    active ? 'cursor-pointer' : 'pointer-events-none'
  }`
}

export function PillNav({ tags, activeTags, onToggleTag }: PillNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 2)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScroll()
    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [checkScroll])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' })
  }

  if (tags.length === 0) return null

  return (
    <div className="relative flex items-center">
      <button
        type="button"
        onClick={() => scroll('left')}
        className={`${arrowStyle(canScrollLeft)} -left-1`}
        aria-label="Scroll left"
      >
        <ChevronLeftIcon className="h-3.5 w-3.5" />
      </button>

      <nav
        ref={scrollRef}
        className="flex gap-1.5 overflow-x-auto py-1 mx-8"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        aria-label="Filter by tag"
      >
        {tags.map((tag) => {
          const isActive = activeTags.includes(tag.id)

          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => onToggleTag(tag.id)}
              className={
                `inline-flex items-center shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all duration-200 cursor-pointer ` +
                (isActive
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border border-neutral-900 dark:border-white'
                  : 'bg-white/70 dark:bg-white/[0.04] text-neutral-500 dark:text-neutral-400 hover:bg-white dark:hover:bg-white/[0.08] border border-neutral-200/60 dark:border-white/[0.06] hover:text-neutral-900 dark:hover:text-white')
              }
            >
              {tag.name}
            </button>
          )
        })}
      </nav>

      <button
        type="button"
        onClick={() => scroll('right')}
        className={`${arrowStyle(canScrollRight)} -right-1`}
        aria-label="Scroll right"
      >
        <ChevronRightIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
