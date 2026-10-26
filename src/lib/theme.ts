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
    // ignore
  }
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#f8f8f6')
  }
  window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme } }))
}

type CurtainHandler = (targetTheme: Theme) => void
let curtainHandler: CurtainHandler | null = null
let isCurtainBusy = false

export function registerThemeCurtain(fn: CurtainHandler) {
  curtainHandler = fn
  return () => {
    if (curtainHandler === fn) curtainHandler = null
  }
}

export function setCurtainBusy(busy: boolean) {
  isCurtainBusy = busy
}

export function requestThemeToggle(currentTheme: Theme, setThemeState: (t: Theme) => void) {
  if (isCurtainBusy) return
  const next: Theme = currentTheme === 'dark' ? 'light' : 'dark'
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reduceMotion || !curtainHandler) {
    setThemeState(next)
    applyTheme(next)
    return
  }

  isCurtainBusy = true
  setThemeState(next)
  curtainHandler(next)
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
    requestThemeToggle(theme, setThemeState)
  }

  return { theme, toggleTheme, setTheme: setThemeState }
}
