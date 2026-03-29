import { useTheme } from '~/lib/use-theme'
import { SunIcon, MoonIcon } from '~/components/icons'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center justify-center rounded-full h-8 w-8 bg-white/70 dark:bg-white/[0.04] border border-neutral-200/60 dark:border-white/8 text-neutral-500 dark:text-neutral-400 hover:bg-white dark:hover:bg-white/[0.08] hover:text-neutral-900 dark:hover:text-white transition-all duration-200"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <SunIcon className="h-4 w-4" strokeWidth={1.5} />
      ) : (
        <MoonIcon className="h-4 w-4" strokeWidth={1.5} />
      )}
    </button>
  )
}
