import React, { createContext, useContext, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

export type ThemeMode = 'light' | 'dark' | 'system';
export type AccentColor = 'emerald' | 'blue' | 'purple' | 'amber' | 'rose';

export interface AccentOption {
  id: AccentColor;
  name: string;
  hex: string;
}

export const ACCENT_COLORS: AccentOption[] = [
  { id: 'emerald', name: 'Emerald Green', hex: '#22c55e' },
  { id: 'blue', name: 'Electric Blue', hex: '#3b82f6' },
  { id: 'purple', name: 'Cyber Violet', hex: '#a855f7' },
  { id: 'amber', name: 'Amber Gold', hex: '#f59e0b' },
  { id: 'rose', name: 'Neon Rose', hex: '#f43f5e' }
];

interface ThemeContextType {
  mode: ThemeMode;
  resolvedMode: 'light' | 'dark';
  accent: AccentColor;
  setMode: (mode: ThemeMode) => void;
  toggleMode: (event?: React.MouseEvent | { clientX: number; clientY: number }) => void;
  setAccent: (accent: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  resolvedMode: 'light',
  accent: 'emerald',
  setMode: () => {},
  toggleMode: () => {},
  setAccent: () => {}
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('alfie-portfolio-theme') as ThemeMode;
      return saved && ['light', 'dark', 'system'].includes(saved) ? saved : 'light';
    } catch {
      return 'light';
    }
  });

  const [accent, setAccentState] = useState<AccentColor>(() => {
    try {
      const saved = localStorage.getItem('alfie-portfolio-accent') as AccentColor;
      return saved && ACCENT_COLORS.some((c) => c.id === saved) ? saved : 'emerald';
    } catch {
      return 'emerald';
    }
  });

  const [resolvedMode, setResolvedMode] = useState<'light' | 'dark'>('light');

  // Resolve system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateResolved = () => {
      if (mode === 'system') {
        const isDark = mediaQuery.matches;
        setResolvedMode(isDark ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', isDark);
      } else {
        setResolvedMode(mode);
        document.documentElement.classList.toggle('dark', mode === 'dark');
      }
    };

    updateResolved();
    mediaQuery.addEventListener('change', updateResolved);
    return () => mediaQuery.removeEventListener('change', updateResolved);
  }, [mode]);

  // Sync DOM classes and local storage
  useEffect(() => {
    const root = document.documentElement;
    if (resolvedMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    try {
      localStorage.setItem('alfie-portfolio-theme', mode);
    } catch {}
  }, [mode, resolvedMode]);

  // Sync Accent color variable
  useEffect(() => {
    const root = document.documentElement;
    const selected = ACCENT_COLORS.find((c) => c.id === accent) || ACCENT_COLORS[0];
    root.style.setProperty('--theme-accent', selected.hex);

    try {
      localStorage.setItem('alfie-portfolio-accent', accent);
    } catch {}
  }, [accent]);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
  };

  // Circular Reveal Theme Toggle Animation starting at the clicked element
  const toggleMode = (event?: React.MouseEvent | { clientX: number; clientY: number }) => {
    const nextMode = resolvedMode === 'dark' ? 'light' : 'dark';

    const isViewTransitionSupported =
      typeof document !== 'undefined' &&
      'startViewTransition' in document &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isViewTransitionSupported) {
      setModeState(nextMode);
      setResolvedMode(nextMode);
      document.documentElement.classList.toggle('dark', nextMode === 'dark');
      return;
    }

    const x = event && 'clientX' in event && event.clientX !== 0 ? event.clientX : window.innerWidth / 2;
    const y = event && 'clientY' in event && event.clientY !== 0 ? event.clientY : 30;

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setModeState(nextMode);
        setResolvedMode(nextMode);
        const root = document.documentElement;
        if (nextMode === 'dark') {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      });
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`
      ];

      document.documentElement.animate(
        {
          clipPath
        },
        {
          duration: 480,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          pseudoElement: '::view-transition-new(root)'
        }
      );
    }).catch(() => {});
  };

  const setAccent = (newAccent: AccentColor) => {
    setAccentState(newAccent);
  };

  return (
    <ThemeContext.Provider
      value={{
        mode,
        resolvedMode,
        accent,
        setMode,
        toggleMode,
        setAccent
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
