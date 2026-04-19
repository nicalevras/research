import { useState, useRef, useEffect } from 'react'
import type { ReactNode } from 'react'
import { Link, useNavigate, useRouter, useRouterState } from '@tanstack/react-router'
import { useTheme } from '~/lib/use-theme'
import { useAuthModal } from '~/lib/auth-context'
import { authClient } from '~/lib/auth-client'
import { MenuIcon, UserIcon, SunIcon, MoonIcon, LogInIcon, UserPlusIcon, LogOutIcon, SettingsIcon, SearchIcon, XIcon, HeartIcon } from '~/components/icons'

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
        className="inline-flex items-center justify-center rounded-xl h-8 w-8 cursor-pointer bg-white/70 dark:bg-white/[0.04] border border-neutral-200/60 dark:border-white/[0.06] text-neutral-500 dark:text-neutral-400 hover:bg-white dark:hover:bg-white/[0.08] hover:text-neutral-900 dark:hover:text-white transition-all duration-200"
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

function DropdownLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
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
      align="right"
      trigger={<MenuIcon className="h-5 w-5" strokeWidth={1.5} />}
    >
      <DropdownLink to="/vendors">All Vendors</DropdownLink>
      <DropdownLink to="/peptides">All Peptides</DropdownLink>
      <DropdownDivider />
      <DropdownLink to="/calculator">Calculator</DropdownLink>
      <DropdownDivider />
      <DropdownItem>Submit a vendor</DropdownItem>
    </DropdownMenu>
  )
}

export function UserMenu() {
  const { theme, toggleTheme } = useTheme()
  const { openSignIn, openSignUp } = useAuthModal()
  const { data: session, isPending } = authClient.useSession()
  const router = useRouter()

  const handleSignOut = async () => {
    await authClient.signOut()
    router.invalidate()
  }

  return (
    <DropdownMenu
      trigger={<UserIcon className="h-5 w-5" strokeWidth={1.5} />}
    >
      {isPending ? (
        <DropdownItem>Loading...</DropdownItem>
      ) : session ? (
        <>
          <DropdownLink to="/account">
            <SettingsIcon className="h-4 w-4" strokeWidth={1.5} />
            Account
          </DropdownLink>
          <DropdownLink to="/favorites">
            <HeartIcon className="h-4 w-4" strokeWidth={1.5} />
            Favorites
          </DropdownLink>
          <DropdownDivider />
          <DropdownItem onClick={handleSignOut}>
            <LogOutIcon className="h-4 w-4" strokeWidth={1.5} />
            Sign Out
          </DropdownItem>
        </>
      ) : (
        <>
          <DropdownItem onClick={openSignIn}><LogInIcon className="h-4 w-4" strokeWidth={1.5} /> Sign In</DropdownItem>
          <DropdownDivider />
          <DropdownItem onClick={openSignUp}><UserPlusIcon className="h-4 w-4" strokeWidth={1.5} /> Sign Up</DropdownItem>
        </>
      )}
      <DropdownDivider />
      <DropdownItem onClick={toggleTheme}>
        {theme === 'dark' ? (
          <MoonIcon className="h-4 w-4" strokeWidth={1.5} />
        ) : (
          <SunIcon className="h-4 w-4" strokeWidth={1.5} />
        )}
        Theme
      </DropdownItem>
    </DropdownMenu>
  )
}

export function NavSearch() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const mobileInputRef = useRef<HTMLInputElement>(null)
  const desktopInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    if (open) {
      // Focus whichever input is visible
      mobileInputRef.current?.focus()
      desktopInputRef.current?.focus()
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handle = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [])

  const handleChange = (value: string) => {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      navigate({ to: '/vendors', search: { q: value || undefined } })
    }, 300)
  }

  const close = () => {
    setOpen(false)
    setQuery('')
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-end rounded-xl h-8 w-8 cursor-pointer text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all duration-200 md:justify-center md:bg-white/70 md:dark:bg-white/[0.04] md:border md:border-neutral-200/60 md:dark:border-white/[0.06] md:hover:bg-white md:dark:hover:bg-white/[0.08]"
        aria-label="Search"
      >
        <SearchIcon className="h-4 w-4" strokeWidth={1.5} />
      </button>
    )
  }

  return (
    <div ref={containerRef}>
      {/* Mobile: full-width takeover */}
      <div className="md:hidden absolute inset-0 z-10 flex items-center p-2.5 bg-white dark:bg-neutral-900 rounded-2xl">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
          <input
            ref={mobileInputRef}
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') close()
            }}
            className="w-full h-8 rounded-xl border border-neutral-200/60 dark:border-white/[0.06] bg-white/70 dark:bg-white/[0.04] pl-8 pr-8 text-sm placeholder-neutral-400 dark:placeholder-neutral-500 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10 transition-all"
          />
          <button
            type="button"
            onClick={() => {
              if (query) {
                setQuery('')
                navigate({ to: '/vendors', search: {} })
              } else {
                close()
              }
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors cursor-pointer"
            aria-label="Close search"
          >
            <XIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Desktop: inline expanding input */}
      <div className="hidden md:block relative">
        <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') close()
          }}
          ref={desktopInputRef}
          className="w-36 sm:w-48 h-8 rounded-xl border border-neutral-200/60 dark:border-white/[0.06] bg-white/70 dark:bg-white/[0.04] pl-8 pr-8 text-sm placeholder-neutral-400 dark:placeholder-neutral-500 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10 transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              navigate({ to: '/vendors', search: {} })
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <XIcon className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}
