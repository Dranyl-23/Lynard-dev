import React from 'react';
import { achievements } from '../../data/portfolioData';
import { SectionHeader } from '../ui/SectionHeader';
import { FadeIn } from '../ui/FadeIn';

export const Achievements: React.FC = () => {
  return (
    <section id="achievements" className="py-16 sm:py-24 lg:py-32">
      <div className="section-container">
        <SectionHeader
          ghost="AWARDS"
          label="ACHIEVEMENTS"
          sub="Awards, certifications, and academic honors."
        />

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {achievements.map((item, idx) => (
            <FadeIn
              key={item.title + item.year}
              delay={0.06 * idx}
              y={30}
              className="h-full"
            >
              <div className="group flex h-full flex-col justify-between rounded-2xl border border-line bg-white p-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(20,20,20,0.25)] sm:rounded-3xl sm:p-6">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                      {item.org}
                    </span>
                    <span className="pill-shadow rounded-full border border-line bg-paper px-2.5 py-0.5 text-[10px] font-semibold text-ink">
                      {item.year}
                    </span>
                  </div>

                  <h3 className="font-display mt-3 text-lg font-bold text-ink sm:text-xl">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {item.detail}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
