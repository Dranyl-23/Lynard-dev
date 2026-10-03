import React from 'react';
import { techStack, marqueeTech } from '../../data/portfolioData';
import { SectionHeader } from '../ui/SectionHeader';
import { FadeIn } from '../ui/FadeIn';
import { MarqueeRibbon } from '../ui/MarqueeRibbon';
import { TechIcon } from '../icons/TechIcons';

export const TechStack: React.FC = () => {
  return (
    <section id="stack" className="overflow-hidden py-16 sm:py-24 lg:py-32">
      <div className="section-container">
        <SectionHeader
          ghost="TECH STACK"
          label="TECH STACK"
          sub="The tools I use to build complete websites, apps, and systems, from frontend to hosting."
        />
      </div>

      {/* Marquee Ticker Track */}
      <FadeIn y={24} className="section-container mt-10 sm:mt-14">
        <MarqueeRibbon
          duration="55s"
          className="marquee-mask rounded-2xl border border-line bg-white py-5"
        >
          {marqueeTech.map((item, idx) => (
            <span
              key={`${item.name}-${idx}`}
              className="mx-6 flex items-center gap-3 text-sm font-semibold uppercase tracking-wider text-ink/70"
            >
              <TechIcon icon={item.icon} className="h-5 w-5 shrink-0" />
              <span>{item.name}</span>
              <span className="ml-6 text-line">•</span>
            </span>
          ))}
        </MarqueeRibbon>
      </FadeIn>

      {/* Categorized Tech Grid */}
      <div className="section-container mt-10 sm:mt-16">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {techStack.map((group, gIdx) => (
            <FadeIn
              key={group.group}
              delay={0.06 * gIdx}
              y={24}
              className="group flex flex-col justify-between rounded-2xl border border-line bg-white p-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(20,20,20,0.25)] sm:rounded-3xl sm:p-6"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold text-ink">
                    {group.group}
                  </h3>
                  <span className="pill-shadow rounded-full border border-line bg-paper px-2.5 py-0.5 text-[10px] font-semibold text-muted">
                    {group.items.length} tools
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item.name}
                      className="pill-shadow inline-flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink transition-transform duration-300 hover:scale-105"
                    >
                      <TechIcon icon={item.icon} className="h-4 w-4 shrink-0" />
                      <span>{item.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
