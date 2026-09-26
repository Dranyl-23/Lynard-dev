import React, { useRef, useState, useEffect } from 'react';
import { testimonials } from '../../data/portfolioData';
import { SectionHeader } from '../ui/SectionHeader';
import { FadeIn } from '../ui/FadeIn';
import { ChevronLeft, ChevronRight, Quote } from '../icons/UIIcons';

export const Testimonials: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const scrollBy = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    const itemWidth = containerRef.current.children[0]?.clientWidth || 340;
    const scrollAmount = direction === 'left' ? -itemWidth : itemWidth;
    containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section id="testimonials" className="py-16 sm:py-24 lg:py-32">
      <div className="section-container">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeader
            ghost="FEEDBACK"
            label="TESTIMONIALS"
            kicker="Kind words"
            sub="What clients say about working with me."
          />

          {/* Navigation Controls */}
          <FadeIn y={16} className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollBy('left')}
              disabled={!canScrollLeft}
              aria-label="Previous testimonials"
              className={`pill-shadow flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-line bg-white text-ink transition-all duration-300 hover:bg-ink hover:text-white disabled:opacity-40 disabled:pointer-events-none`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy('right')}
              disabled={!canScrollRight}
              aria-label="Next testimonials"
              className={`pill-shadow flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-line bg-white text-ink transition-all duration-300 hover:bg-ink hover:text-white disabled:opacity-40 disabled:pointer-events-none`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </FadeIn>
        </div>

        {/* Carousel Viewport */}
        <div className="relative mt-10 sm:mt-14">
          <div
            ref={containerRef}
            className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6 pt-2 scrollbar-none sm:mx-0 sm:gap-6 sm:px-0"
          >
            {testimonials.map((t, idx) => (
              <figure
                key={t.name + idx}
                className="flex w-[85%] shrink-0 snap-start flex-col justify-between rounded-2xl border border-line bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(20,20,20,0.25)] sm:w-[calc(50%-12px)] sm:rounded-3xl sm:p-8 lg:w-[calc(33.333%-16px)]"
              >
                <div>
                  <Quote className="h-7 w-7 text-ink/15" />
                  <blockquote className="mt-4 text-sm leading-relaxed text-ink/80 sm:mt-5 sm:text-[15px]">
                    “{t.quote}”
                  </blockquote>
                </div>

                <figcaption className="mt-6 flex items-center gap-3.5 border-t border-line/60 pt-4 sm:mt-8">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink font-display text-xs font-bold text-white">
                    {t.initials}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{t.name}</p>
                    <p className="text-xs text-muted">{t.org}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* Mobile Navigation Controls */}
          <div className="mt-4 flex items-center justify-center gap-3 sm:hidden">
            <button
              type="button"
              onClick={() => scrollBy('left')}
              disabled={!canScrollLeft}
              aria-label="Previous testimonials"
              className="pill-shadow flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink transition-colors hover:bg-ink hover:text-white disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy('right')}
              disabled={!canScrollRight}
              aria-label="Next testimonials"
              className="pill-shadow flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink transition-colors hover:bg-ink hover:text-white disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
