import { useCallback, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('light')

  // Sync from localStorage after hydration
  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored === 'dark') {
      setThemeState('dark')
    }
  }, [])

  // Apply theme class whenever state changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    localStorage.setItem('theme', t)
    document.documentElement.style.colorScheme = t
    document.documentElement.classList.add('no-transition')
    document.documentElement.classList.toggle('dark', t === 'dark')
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('no-transition')
      })
    })
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  return { theme, setTheme, toggleTheme } as const
}
