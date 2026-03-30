import { useState, useRef, useEffect } from 'react'
import type { ReactNode } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { useAuth, SignInButton, UserButton } from '@clerk/tanstack-react-start'
import { ThemeToggle } from '~/components/theme-toggle'
import { MenuIcon, UserIcon } from '~/components/icons'

function DropdownMenu({ trigger, children, align = 'right' }: { trigger: ReactNode; children: ReactNode; align?: 'left' | 'right' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const location = useRouterState({ select: (s) => s.location })
  const prevLocation = useRef(location)
  useEffect(() => {
    if (prevLocation.current !== location) {
      setOpen(false)
      prevLocation.current = location
    }
  }, [location])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-center rounded-full h-8 w-8 cursor-pointer bg-white/70 dark:bg-white/[0.04] border border-neutral-200/60 dark:border-white/8 text-neutral-500 dark:text-neutral-400 hover:bg-white dark:hover:bg-white/[0.08] hover:text-neutral-900 dark:hover:text-white transition-all duration-200"
      >
        {trigger}
      </button>
      {open && (
        <div className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} top-full mt-2 z-50 min-w-[180px] rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-white/[0.06] py-1 shadow-lg`}>
          {children}
        </div>
      )}
    </div>
  )
}

function DropdownItem({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={() => { onClick?.(); }}
      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/[0.04] transition-colors text-left cursor-pointer"
    >
      {children}
    </button>
  )
}

function DropdownLink({ to, params, children }: { to: '/' | '/$category'; params?: { category: string }; children: ReactNode }) {
  return (
    <Link
      to={to}
      params={params}
      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/[0.04] transition-colors"
    >
      {children}
    </Link>
  )
}

function DropdownDivider() {
  return <div className="my-1 h-px bg-neutral-100 dark:bg-white/[0.04]" />
}

export function HamburgerMenu() {
  return (
    <DropdownMenu
      align="left"
      trigger={<MenuIcon className="h-5 w-5" strokeWidth={1.5} />}
    >
      <DropdownLink to="/">Vendors</DropdownLink>
      <DropdownLink to="/$category" params={{ category: 'research' }}>Research</DropdownLink>
      <DropdownLink to="/$category" params={{ category: 'therapeutic' }}>Therapeutic</DropdownLink>
      <DropdownLink to="/$category" params={{ category: 'cosmetic' }}>Cosmetic</DropdownLink>
      <DropdownLink to="/$category" params={{ category: 'api-supplier' }}>API Suppliers</DropdownLink>
      <DropdownDivider />
      <DropdownLink to="/$category" params={{ category: 'custom-synthesis' }}>Custom Synthesis</DropdownLink>
      <DropdownLink to="/$category" params={{ category: 'bpc' }}>BPC-157</DropdownLink>
      <DropdownLink to="/$category" params={{ category: 'tb500' }}>TB-500</DropdownLink>
      <DropdownLink to="/$category" params={{ category: 'ghrp' }}>GHRP</DropdownLink>
    </DropdownMenu>
  )
}

const userIconButton = (
  <button
    type="button"
    className="inline-flex items-center justify-center rounded-full h-8 w-8 cursor-pointer bg-white/70 dark:bg-white/[0.04] border border-neutral-200/60 dark:border-white/8 text-neutral-500 dark:text-neutral-400 hover:bg-white dark:hover:bg-white/[0.08] hover:text-neutral-900 dark:hover:text-white transition-all duration-200"
  >
    <UserIcon className="h-5 w-5" strokeWidth={1.5} />
  </button>
)

export function UserMenu() {
  const { isLoaded, isSignedIn } = useAuth()

  return (
    <div className="flex items-center gap-2">
      {!isLoaded ? (
        // Show static icon while Clerk loads
        userIconButton
      ) : isSignedIn ? (
        <UserButton
          appearance={{
            elements: {
              avatarBox: 'h-8 w-8',
            },
          }}
        />
      ) : (
        <SignInButton mode="modal">
          {userIconButton}
        </SignInButton>
      )}
      <ThemeToggle />
    </div>
  )
}
