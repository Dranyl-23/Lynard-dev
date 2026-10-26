import { useEffect, useState } from 'react'

export type Theme = 'dark' | 'light'

const THEME_KEY = 'portfolio-theme'

export function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  const saved = localStorage.getItem(THEME_KEY) as Theme | null
  if (saved === 'dark' || saved === 'light') return saved
  if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light'
  return 'dark'
}

export function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('data-theme', theme)
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    // ignore local storage errors
  }
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#f8f8f6')
  }
  window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme } }))
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    const onThemeChange = (e: Event) => {
      const custom = e as CustomEvent<{ theme: Theme }>
      if (custom.detail?.theme && custom.detail.theme !== theme) {
        setThemeState(custom.detail.theme)
      }
    }
    window.addEventListener('theme-change', onThemeChange)
    return () => window.removeEventListener('theme-change', onThemeChange)
  }, [theme])

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      // Modern smooth view transition if supported
      ;(document as unknown as { startViewTransition: (cb: () => void) => void }).startViewTransition(() => {
        setThemeState(next)
        applyTheme(next)
      })
    } else {
      setThemeState(next)
      applyTheme(next)
    }
  }

  return { theme, toggleTheme, setTheme: setThemeState }
}
