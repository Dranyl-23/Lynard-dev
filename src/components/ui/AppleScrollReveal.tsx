import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useLenisScroll } from '../LenisProvider';

interface AppleScrollRevealProps {
  phrase: string;
  className?: string;
  kicker?: string;
  highlights?: string[];
  withCard?: boolean;
}

const Word: React.FC<{
  word: string;
  range: [number, number];
  progress: MotionValue<number>;
  isHighlight?: boolean;
}> = ({ word, range, progress, isHighlight }) => {
  // Single-element opacity transform: from muted ghost (0.18) to full crisp contrast (1.0)
  const opacity = useTransform(progress, range, [0.18, 1]);

  return (
    <motion.span
      style={{ opacity }}
      className={`inline-block whitespace-nowrap mr-[0.28em] my-[0.05em] transition-colors duration-200 ${
        isHighlight
          ? 'text-accent font-extrabold drop-shadow-[0_0_12px_rgba(34,197,94,0.35)]'
          : 'text-ink'
      }`}
    >
      {word}
    </motion.span>
  );
};

export const AppleScrollReveal: React.FC<AppleScrollRevealProps> = ({
  phrase,
  className = '',
  kicker,
  highlights = [],
  withCard = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollRef } = useLenisScroll();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollRef.current ? scrollRef : undefined,
    offset: ['start 0.85', 'end 0.45']
  });

  const words = useMemo(() => phrase.trim().split(/\s+/), [phrase]);
  const totalWords = words.length;

  const normalizedHighlights = useMemo(() => {
    return highlights
      .flatMap((h) => h.toLowerCase().split(/\s+/))
      .map((w) => w.replace(/[^a-z0-9-]/g, ''))
      .filter(Boolean);
  }, [highlights]);

  const content = (
    <div ref={containerRef} className="relative">
      {/* Optional Apple-style Kicker Badge */}
      {kicker && (
        <div className="mb-4 flex items-center gap-2.5 sm:mb-6">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
            {kicker}
          </span>
        </div>
      )}

      {/* Scroll Scrub Text Body (Single element per word, comfortable line-height, zero overlap) */}
      <div
        className={`font-display tracking-tight leading-[1.35] sm:leading-[1.3] text-ink ${
          className || 'text-2xl font-bold sm:text-3xl md:text-4xl lg:text-[40px]'
        }`}
      >
        {words.map((word, index) => {
          const step = 1 / totalWords;
          const start = index * step;
          const end = Math.min(1, start + step * 1.55);

          const cleanWord = word.toLowerCase().replace(/[^a-z0-9-]/g, '');
          const isHighlight = normalizedHighlights.includes(cleanWord);

          return (
            <Word
              key={`${word}-${index}`}
              word={word}
              range={[start, end]}
              progress={scrollYProgress}
              isHighlight={isHighlight}
            />
          );
        })}
      </div>
    </div>
  );

  if (withCard) {
    return (
      <div className="frame-shadow relative overflow-hidden rounded-3xl border border-line bg-card/75 p-6 backdrop-blur-md transition-all duration-500 sm:rounded-[2rem] sm:p-10 lg:p-12">
        {/* Subtle Ambient Radial Highlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/5 blur-3xl"
        />
        {content}
      </div>
    );
  }

  return content;
};
