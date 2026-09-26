import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { services } from '../../data/portfolioData';
import { SectionHeader } from '../ui/SectionHeader';
import { FadeIn, EXPO_OUT } from '../ui/FadeIn';
import { useLenisScroll } from '../LenisProvider';
import { ArrowUpRight } from '../icons/UIIcons';

export const Services: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollTo } = useLenisScroll();

  const currentService = services[activeIndex];

  return (
    <section id="services" className="py-16 sm:py-24 lg:py-32">
      <div className="section-container">
        <SectionHeader
          ghost="SERVICES"
          label="SERVICES"
          kicker="What I offer"
          sub="Everything you need to launch: planning, design, development, and support."
        />

        <div className="mt-10 grid grid-cols-1 gap-8 sm:mt-14 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Interactive Service Selectors */}
          <div className="flex flex-col gap-2.5 lg:col-span-5">
            {services.map((svc, idx) => {
              const isActive = activeIndex === idx;
              return (
                <FadeIn key={svc.title} delay={0.04 * idx} y={20}>
                  <button
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={`group flex w-full cursor-pointer items-center justify-between rounded-2xl border p-4 text-left transition-all duration-300 sm:p-5 ${
                      isActive
                        ? 'border-ink bg-white shadow-[0_16px_32px_-16px_rgba(20,20,20,0.15)] ring-1 ring-ink'
                        : 'border-line bg-white/60 hover:bg-white hover:border-ink/30'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span
                        className={`flex h-9 w-9 shrink-0 aspect-square items-center justify-center rounded-full font-display text-xs font-bold transition-colors ${
                          isActive
                            ? 'bg-ink text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                            : 'bg-paper text-muted group-hover:text-ink'
                        }`}
                      >
                        0{idx + 1}
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-display text-base font-bold text-ink">
                          {svc.title}
                        </h3>
                        <p className="line-clamp-1 text-xs text-muted">
                          {svc.description}
                        </p>
                      </div>
                    </div>

                    <ArrowUpRight
                      className={`h-4 w-4 transition-transform duration-300 ${
                        isActive
                          ? 'text-ink translate-x-0.5 -translate-y-0.5'
                          : 'text-muted/40 group-hover:text-ink'
                      }`}
                    />
                  </button>
                </FadeIn>
              );
            })}
          </div>

          {/* Right Column: Featured Service Showcase Display */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentService.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: EXPO_OUT }}
                className="flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-line bg-white p-6 shadow-[0_30px_60px_-30px_rgba(20,20,20,0.15)] sm:rounded-[2rem] sm:p-10"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
                      Featured Capability
                    </span>
                    <span className="pill-shadow inline-flex items-center gap-1 rounded-full border border-line bg-paper px-3 py-1 text-xs font-bold text-ink">
                      0{activeIndex + 1} / 0{services.length}
                    </span>
                  </div>

                  <h3 className="font-display mt-4 text-2xl font-bold text-ink sm:text-3xl">
                    {currentService.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                    {currentService.description}
                  </p>

                  <div className="mt-6 flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-2xl bg-paper p-4">
                    <img
                      src={currentService.image}
                      alt={currentService.title}
                      className="max-h-full max-w-full object-contain transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                </div>

                <div className="mt-6 sm:mt-8 flex items-center justify-between gap-3 border-t border-line pt-4 sm:pt-6">
                  <p className="text-[11px] sm:text-xs text-muted leading-relaxed max-w-[200px] sm:max-w-none">
                    Custom tailored for your specific business requirements.
                  </p>
                  <button
                    type="button"
                    onClick={() => scrollTo('#contact')}
                    className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white whitespace-nowrap transition-transform duration-300 hover:scale-105 sm:gap-2 sm:px-5 sm:py-2.5"
                  >
                    <span className="whitespace-nowrap">Start a Project</span>
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
