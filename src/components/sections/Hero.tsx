import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { profile, stats } from '../../data/portfolioData';
import { useLenisScroll } from '../LenisProvider';
import { FadeIn, EXPO_OUT } from '../ui/FadeIn';
import { RevealText } from '../ui/RevealText';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { ArrowUpRight, Mail, Phone, MapPin } from '../icons/UIIcons';

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);
  const { scrollTo, scrollRef } = useLenisScroll();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    container: scrollRef.current ? scrollRef : undefined,
    offset: ['start start', 'end start']
  });

  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const portraitY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const introOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const heroContacts = [
    {
      label: 'GitHub',
      href: profile.github,
      icon: (
        <svg role="img" viewBox="0 0 24 24" className="h-3 w-3 shrink-0 fill-current sm:h-3.5 sm:w-3.5">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
      )
    },
    {
      label: 'Email',
      href: `mailto:${profile.email}`,
      icon: <Mail className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
    },
    {
      label: 'Phone',
      href: `tel:${profile.phone.replace(/\s/g, '')}`,
      icon: <Phone className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
    },
    {
      label: 'Location',
      href: '#contact',
      icon: <MapPin className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
    }
  ];

  return (
    <section id="home" className="relative">
      <div
        ref={heroRef}
        className="relative flex min-h-[var(--frame-h,100dvh)] flex-col justify-start overflow-hidden pt-16 min-[380px]:pt-20 sm:pt-28 lg:justify-end lg:pt-0"
      >
        {/* Parallax Hero Name / Title */}
        <motion.div
          style={{ y: titleY }}
          className="pointer-events-none z-0 px-4 text-center lg:absolute lg:inset-x-0 lg:top-[13vh]"
        >
          <p className="mb-1 text-sm font-medium text-muted sm:text-base">
            <motion.span
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.45, ease: EXPO_OUT }}
              className="inline-block"
            >
              Hi, I'm
            </motion.span>
          </p>

          <h1 className="font-display display-tight font-black uppercase">
            <span className="text-outline block text-[clamp(2.65rem,11.5vw,9.5rem)] leading-[0.94]">
              <RevealText text={profile.firstName} delay={0.55} />
            </span>
            <span className="block text-[clamp(2.65rem,11.5vw,9.5rem)] leading-[0.94] text-ink">
              <RevealText text={profile.lastName} delay={0.85} />
            </span>
          </h1>
        </motion.div>

        {/* Parallax Portrait Cutout */}
        <motion.div
          style={{ y: portraitY }}
          className="relative z-10 mx-auto -mt-[4.5rem] flex justify-center sm:-mt-[7rem] lg:mt-0"
        >
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 1.15, ease: EXPO_OUT }}
            className="relative"
          >
            {!imageError ? (
              <img
                src="/Profile.png"
                alt={profile.name}
                onError={() => setImageError(true)}
                className="hero-portrait h-[32vh] min-[380px]:h-[35vh] w-auto max-h-[340px] sm:max-h-none sm:h-[46vh] lg:h-[70vh] object-contain object-bottom grayscale transition-[filter] duration-1000 ease-out-expo hover:grayscale-0 cursor-pointer"
                draggable={false}
              />
            ) : (
              <div className="hero-portrait flex h-[32vh] min-[380px]:h-[35vh] w-[70vw] max-w-[420px] items-end justify-center rounded-t-[10rem] bg-gradient-to-b from-ink/5 to-ink/15 sm:h-[46vh] lg:h-[66vh]">
                <span className="font-display mb-8 text-7xl font-black text-ink/20">
                  {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                </span>
              </div>
            )}

            {/* Scroll Mouse Prompt */}
            <button
              type="button"
              onClick={() => scrollTo('#about')}
              aria-label="Scroll to about"
              className="absolute inset-x-0 bottom-[2%] z-10 flex items-center justify-center gap-2.5 text-ink transition-opacity hover:opacity-70 cursor-pointer"
            >
              <span className="h-px w-8 bg-ink/30 sm:w-12" />
              <span className="flex flex-col items-center gap-1.5">
                <span className="scroll-mouse" aria-hidden="true">
                  <span className="scroll-mouse-wheel" />
                </span>
                <span className="text-[9px] font-medium uppercase tracking-[0.28em] text-ink/55">
                  Scroll
                </span>
              </span>
              <span className="h-px w-8 bg-ink/30 sm:w-12" />
            </button>
          </motion.div>
        </motion.div>

        {/* Floating Side Info & Contact Badges */}
        <div className="relative z-20 lg:absolute lg:inset-x-0 lg:bottom-14">
          <div className="section-container flex flex-col items-center gap-4 sm:gap-6 pb-5 sm:pb-8 pt-2 sm:pt-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10 lg:pb-0 lg:pt-0">
            {/* Left Tagline & CTA */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 1.35, ease: EXPO_OUT }}
              style={{ opacity: introOpacity }}
              className="w-full text-center lg:w-[16rem] lg:shrink-0 lg:text-left"
            >
              <h2 className="font-display text-[1.15rem] leading-snug font-bold text-ink sm:text-[1.7rem] lg:text-[1.45rem] lg:leading-tight">
                {profile.role}
              </h2>
              <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-muted sm:mt-2 sm:text-sm lg:mx-0 lg:max-w-none">
                I build websites and mobile apps that are simple, reliable, and easy to use.
              </p>
              <div className="mt-3.5 flex flex-wrap items-center justify-center gap-3 sm:mt-5 lg:justify-start">
                <button
                  type="button"
                  onClick={() => scrollTo('#work')}
                  className="group flex shrink-0 items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-xs font-semibold text-white whitespace-nowrap transition-transform duration-500 hover:scale-[1.03] dark:bg-white dark:text-neutral-950 sm:px-6 sm:py-3 sm:text-sm cursor-pointer"
                >
                  <span className="whitespace-nowrap">View Projects</span>
                  <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </motion.div>

            {/* Right Contact Pills - Auto-adjusts cleanly on 1 row across all mobile screen sizes */}
            <div className="flex w-full max-w-full flex-wrap items-center justify-center gap-1.5 min-[380px]:gap-2 sm:gap-2.5 lg:w-auto lg:flex-col lg:items-end lg:gap-3">
              {heroContacts.map((c, i) => (
                <motion.a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  onClick={(e) => {
                    if (c.href === '#contact') {
                      e.preventDefault();
                      scrollTo('#contact');
                    }
                  }}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.95, delay: 1.45 + i * 0.12, ease: EXPO_OUT }}
                  className="pill-shadow group flex shrink-0 items-center gap-1 rounded-full border border-line bg-white px-2.5 py-1.5 text-[10px] font-semibold text-ink transition-all duration-500 hover:scale-[1.03] hover:bg-ink hover:text-white min-[360px]:gap-1.5 min-[380px]:px-3 min-[390px]:px-3.5 min-[390px]:text-[11px] sm:gap-2 sm:px-5 sm:py-2.5 sm:text-xs cursor-pointer whitespace-nowrap"
                >
                  {c.icon}
                  <span>{c.label}</span>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="section-container border-t border-line">
        <div className="grid grid-cols-3 divide-x divide-line">
          {stats.map((s, idx) => (
            <FadeIn
              key={s.label}
              delay={0.08 * idx}
              y={24}
              className="flex flex-col items-center gap-0.5 px-1 py-4 text-center sm:gap-1 sm:px-2 sm:py-8 lg:py-10"
            >
              <AnimatedCounter
                value={s.value}
                suffix={s.suffix}
                decimals={s.decimals || 0}
                className="font-display display-tight text-xl font-black text-ink min-[380px]:text-2xl sm:text-4xl lg:text-5xl"
              />
              <span className="text-[9.5px] font-medium uppercase tracking-[0.14em] text-muted min-[380px]:text-[10.5px] sm:text-xs sm:tracking-[0.18em]">
                {s.label}
              </span>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
