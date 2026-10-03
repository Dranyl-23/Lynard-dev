import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { experiences } from '../../data/portfolioData';
import { Experience as ExperienceType } from '../../types/portfolio';
import { SectionHeader } from '../ui/SectionHeader';
import { FadeIn, EXPO_OUT } from '../ui/FadeIn';
import { ChevronDown, Check } from '../icons/UIIcons';

export const Experience: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const toggleItem = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? -1 : idx));
  };

  return (
    <section id="experience" className="section-container py-16 sm:py-24 lg:py-32">
      <FadeIn y={48} duration={1.1}>
        <div className="frame-shadow relative overflow-hidden rounded-3xl bg-[#161616] px-5 py-10 sm:rounded-[2.5rem] sm:px-12 sm:py-20">
          {/* Subtle Ambient Glow */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

          <SectionHeader
            ghost="EXPERIENCE"
            label="EXPERIENCE"
            sub="Where I've worked and what I've built."
            dark
          />

          <div className="mt-10 divide-y divide-white/10 sm:mt-14">
            {experiences.map((item: ExperienceType, idx: number) => {
              const isOpen = openIndex === idx;
              return (
                <div key={item.index} className="py-6 sm:py-8 first:pt-0 last:pb-0">
                  <button
                    type="button"
                    onClick={() => toggleItem(idx)}
                    className="flex w-full items-start justify-between gap-4 text-left cursor-pointer group"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
                      <span className="font-display text-xs font-bold text-white/40 sm:text-sm">
                        {item.index}
                      </span>
                      <span className="inline-flex w-fit items-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/80">
                        {item.years}
                      </span>
                      <div>
                        <h3 className="font-display text-lg font-bold text-white transition-colors duration-300 group-hover:text-accent sm:text-xl">
                          {item.role}
                        </h3>
                        <p className="text-sm text-white/60">
                          {item.company}
                        </p>
                      </div>
                    </div>

                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors duration-300 group-hover:bg-white/15">
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-500 ease-out-expo ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.6, ease: EXPO_OUT }}
                        className="overflow-hidden"
                      >
                        <ul className="mt-6 space-y-3 pl-2 sm:pl-16">
                          {item.bullets.map((bullet, bIdx) => (
                            <li
                              key={bIdx}
                              className="flex items-start gap-3 text-sm leading-relaxed text-white/70"
                            >
                              <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-accent" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </FadeIn>
    </section>
  );
};
