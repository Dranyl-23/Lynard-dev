import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { profile } from '../../data/portfolioData';
import { useLenisScroll } from '../LenisProvider';
import { useTheme } from '../../context/ThemeContext';

interface LoadingScreenProps {
  onComplete?: () => void;
}

const statusMessages = [
  'Initializing workspace...',
  'Configuring user interfaces...',
  'Loading portfolio archives & credentials...',
  'Calibrating smooth physics...',
  'Ready'
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const { lockScroll } = useLenisScroll();
  const { resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  useEffect(() => {
    lockScroll(true);

    // Fast, organic counter easing
    let current = 0;
    const interval = setInterval(() => {
      // Faster progression at start, organic slowdown near 90-100%
      const increment = current < 30 ? 4 : current < 70 ? 3 : current < 92 ? 2 : 1;
      current += increment;

      if (current >= 100) {
        current = 100;
        setProgress(100);
        clearInterval(interval);

        // Brief pause at 100% before wiping curtain
        setTimeout(() => {
          setIsFinished(true);
        }, 350);
      } else {
        setProgress(current);
      }
    }, 28);

    return () => {
      clearInterval(interval);
      lockScroll(false);
    };
  }, [lockScroll]);

  // Determine current status message based on progress
  const messageIndex = Math.min(
    Math.floor((progress / 100) * statusMessages.length),
    statusMessages.length - 1
  );

  return (
    <AnimatePresence
      onExitComplete={() => {
        lockScroll(false);
        onComplete?.();
      }}
    >
      {!isFinished && (
        <motion.div
          key="loader"
          initial={{ y: 0 }}
          exit={{
            y: '-100%',
            transition: { duration: 1.05, ease: [0.76, 0, 0.24, 1] }
          }}
          className={`fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden p-6 sm:p-12 transition-colors duration-300 ${
            isDark ? 'bg-[#0d0d0d] text-white' : 'bg-[#f7f7f5] text-[#141414]'
          }`}
          data-lenis-prevent
        >
          {/* Subtle Ambient Radial Glow */}
          <div
            className={`pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl ${
              isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]'
            }`}
            aria-hidden="true"
          />

          {/* Top Row: Brand Monogram & Live Status */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl font-display text-xs font-bold tracking-tight sm:h-10 sm:w-10 sm:text-sm ${
                  isDark ? 'bg-white/10 text-white' : 'bg-black/[0.07] text-[#141414]'
                }`}
              >
                {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
              </span>
              <span
                className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${
                  isDark ? 'text-white/50' : 'text-[#141414]/55'
                }`}
              >
                {profile.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <span
                className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
                  isDark ? 'text-white/60' : 'text-[#141414]/60'
                }`}
              >
                Portfolio 2026
              </span>
            </div>
          </div>

          {/* Centerpiece: Name, Role & Status Hint */}
          <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`mb-3 text-xs font-semibold uppercase tracking-[0.28em] sm:text-sm ${
                isDark ? 'text-white/40' : 'text-[#141414]/50'
              }`}
            >
              Creative Engineering
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className={`font-display display-tight text-3xl font-black uppercase sm:text-5xl lg:text-6xl ${
                isDark ? 'text-white' : 'text-[#141414]'
              }`}
            >
              {profile.firstName} {profile.lastName}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`mx-auto mt-3 max-w-md text-xs font-medium sm:text-sm ${
                isDark ? 'text-white/60' : 'text-[#141414]/65'
              }`}
            >
              {profile.role}
            </motion.p>

            {/* Dynamic Status message */}
            <div className="mt-8 flex items-center justify-center gap-2 sm:mt-10">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              <p
                className={`text-xs font-medium uppercase tracking-[0.2em] ${
                  isDark ? 'text-white/50' : 'text-[#141414]/55'
                }`}
              >
                {statusMessages[messageIndex]}
              </p>
            </div>
          </div>

          {/* Bottom Row: Location, Hairline Progress Bar & Big Percentage */}
          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            {/* Location & Timezone */}
            <div className="hidden sm:block">
              <p
                className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${
                  isDark ? 'text-white/40' : 'text-[#141414]/45'
                }`}
              >
                Location
              </p>
              <p
                className={`mt-1 text-xs font-medium ${
                  isDark ? 'text-white/80' : 'text-[#141414]/80'
                }`}
              >
                {profile.location}
              </p>
            </div>

            {/* Central Progress Line */}
            <div className="flex flex-1 flex-col items-center gap-2 sm:max-w-md sm:px-8">
              <div
                className={`h-[2px] w-full overflow-hidden rounded-full ${
                  isDark ? 'bg-white/10' : 'bg-black/10'
                }`}
              >
                <div
                  className="h-full bg-accent shadow-[0_0_12px_rgba(34,197,94,0.6)] transition-all duration-100 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Crisp Big Counter */}
            <div className="flex items-baseline justify-between sm:justify-end gap-1">
              <span
                className={`text-[11px] font-semibold uppercase tracking-[0.2em] sm:hidden ${
                  isDark ? 'text-white/40' : 'text-[#141414]/45'
                }`}
              >
                Loading
              </span>
              <div
                className={`font-display flex items-baseline font-black tabular-nums ${
                  isDark ? 'text-white' : 'text-[#141414]'
                }`}
              >
                <span className="text-5xl sm:text-7xl">{progress}</span>
                <span
                  className={`text-2xl sm:text-3xl ${
                    isDark ? 'text-white/40' : 'text-[#141414]/35'
                  }`}
                >
                  %
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Curved Curtain Accent */}
          <div
            className={`pointer-events-none absolute -bottom-1 inset-x-0 h-4 bg-gradient-to-b from-transparent ${
              isDark ? 'to-black/30' : 'to-black/10'
            }`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
