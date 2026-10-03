import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FadeIn } from './FadeIn';
import { RevealText } from './RevealText';
import { useLenisScroll } from '../LenisProvider';

interface SectionHeaderProps {
  ghost?: string;
  label: string;
  kicker?: string;
  sub?: string;
  dark?: boolean;
  align?: 'left' | 'center';
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  ghost,
  label,
  kicker,
  sub,
  dark = false,
  align = 'left'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollRef } = useLenisScroll();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollRef.current ? scrollRef : undefined,
    offset: ['start end', 'end start']
  });

  const ghostX = useTransform(scrollYProgress, [0, 1], ['4%', '-4%']);

  const isCenter = align === 'center';

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col ${
        isCenter ? 'text-center items-center' : 'text-left items-start'
      }`}
    >
      {/* Ghost Watermark */}
      {ghost && (
        <motion.span
          style={{ x: ghostX }}
          aria-hidden="true"
          className={`font-display display-tight pointer-events-none absolute -top-[0.42em] left-0 w-full whitespace-nowrap text-[clamp(2.4rem,11vw,11rem)] font-extrabold uppercase ${
            dark ? 'ghost-word-dark' : 'ghost-word'
          } ${isCenter ? 'text-center' : ''}`}
        >
          {ghost}
        </motion.span>
      )}

      {/* Foreground Header Content */}
      <div className="relative pt-[0.5em]">
        {kicker && (
          <FadeIn y={16}>
            <span
              className={`mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] ${
                dark ? 'text-white/50' : 'text-muted'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  dark ? 'bg-accent' : 'bg-ink'
                }`}
              />
              {kicker}
            </span>
          </FadeIn>
        )}

        <RevealText
          text={label}
          as="h2"
          className={`font-display display-tight text-[clamp(1.7rem,5.5vw,4.2rem)] font-bold uppercase ${
            dark ? 'text-white' : 'text-ink'
          }`}
        />

        {sub && (
          <FadeIn delay={0.15} y={20}>
            <p
              className={`mt-3 max-w-xl text-sm leading-relaxed sm:mt-4 sm:text-[15px] ${
                dark ? 'text-white/60' : 'text-muted'
              } ${isCenter ? 'mx-auto' : ''}`}
            >
              {sub}
            </p>
          </FadeIn>
        )}
      </div>
    </div>
  );
};
