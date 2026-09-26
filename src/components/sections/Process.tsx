import React from 'react';
import { process } from '../../data/portfolioData';
import { SectionHeader } from '../ui/SectionHeader';
import { FadeIn } from '../ui/FadeIn';

export const Process: React.FC = () => {
  return (
    <section id="process" className="py-16 sm:py-24 lg:py-32">
      <div className="section-container">
        <SectionHeader
          ghost="PROCESS"
          label="PROCESS"
          kicker="How I work"
          sub="Four simple steps from idea to launch."
        />

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {process.map((p, idx) => (
            <FadeIn key={p.step} delay={0.08 * idx} y={30} className="h-full">
              <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-line bg-white p-6 transition-all duration-700 ease-out-expo hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(20,20,20,0.25)] sm:rounded-3xl sm:p-8">
                <div>
                  <span className="font-display block text-3xl font-black text-ink/20 transition-colors duration-500 group-hover:text-ink/40 sm:text-4xl">
                    {p.step}
                  </span>

                  <h3 className="font-display mt-4 text-lg font-bold text-ink sm:text-xl">
                    {p.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {p.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-line/60 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                    Step 0{idx + 1}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
