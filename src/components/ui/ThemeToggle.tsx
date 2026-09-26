import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme, ACCENT_COLORS, AccentColor } from '../../context/ThemeContext';
import { Sun, Moon, Palette } from '../icons/UIIcons';

export const ThemeToggle: React.FC = () => {
  const { resolvedMode, toggleMode, accent, setAccent } = useTheme();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close palette on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setPaletteOpen(false);
      }
    };
    if (paletteOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [paletteOpen]);

  const isDark = resolvedMode === 'dark';

  return (
    <div className="relative flex items-center gap-1.5" ref={popoverRef}>
      {/* Light / Dark Mode Toggle */}
      <button
        type="button"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          toggleMode({
            clientX: rect.left + rect.width / 2,
            clientY: rect.top + rect.height / 2
          });
        }}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        className="pill-shadow flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink transition-transform duration-300 hover:scale-105 hover:border-ink/40 cursor-pointer"
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <motion.div
          key={resolvedMode}
          initial={{ rotate: -90, scale: 0.7, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.7, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isDark ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-ink" />
          )}
        </motion.div>
      </button>

      {/* Accent Color Palette Popover Button */}
      <button
        type="button"
        onClick={() => setPaletteOpen((prev) => !prev)}
        aria-label="Customize accent color theme"
        className="pill-shadow flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink transition-transform duration-300 hover:scale-105 hover:border-ink/40 cursor-pointer"
        title="Change accent color theme"
      >
        <Palette className="h-4 w-4 text-accent transition-colors duration-300" />
      </button>

      {/* Palette Popover */}
      <AnimatePresence>
        {paletteOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pill-shadow absolute right-0 top-12 z-50 flex w-48 flex-col gap-2 rounded-2xl border border-line bg-white p-3 shadow-xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-line pb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                Accent Theme
              </span>
            </div>

            <div className="flex flex-col gap-1">
              {ACCENT_COLORS.map((item) => {
                const isSelected = accent === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setAccent(item.id as AccentColor);
                      setPaletteOpen(false);
                    }}
                    className={`flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-left text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-ink/5 font-semibold text-ink'
                        : 'text-muted hover:bg-paper hover:text-ink'
                    }`}
                  >
                    <span
                      className="h-3.5 w-3.5 rounded-full ring-2 ring-offset-1 transition-transform"
                      style={{
                        backgroundColor: item.hex,
                        boxShadow: isSelected ? `0 0 8px ${item.hex}` : undefined
                      }}
                    />
                    <span className="flex-1">{item.name}</span>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-accent">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
