import React from 'react';
import { about, profile } from '../../data/portfolioData';
import { SectionHeader } from '../ui/SectionHeader';
import { FadeIn } from '../ui/FadeIn';
import { RevealText } from '../ui/RevealText';
import { Check } from '../icons/UIIcons';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-16 sm:py-24 lg:py-32">
      <div className="section-container">
        <SectionHeader
          ghost="ABOUT ME"
          label="ABOUT"
          kicker={about.kicker}
          sub={about.intro}
        />

        <div className="mt-10 grid grid-cols-1 gap-10 sm:mt-16 lg:grid-cols-2 lg:gap-20">
          {/* Left Column: Story & Philosophy */}
          <div>
            <FadeIn y={20}>
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
                My Journey
              </span>
            </FadeIn>

            <RevealText
              text={about.heading}
              as="h3"
              className="font-display display-tight mt-2 text-2xl font-bold text-ink sm:mt-3 sm:text-3xl lg:text-4xl"
            />

            <div className="mt-6 space-y-4">
              {about.paragraphs.map((p, idx) => (
                <FadeIn key={idx} delay={0.1 + idx * 0.08} y={24}>
                  <p className="text-sm leading-relaxed text-muted sm:text-[15px]">
                    {p}
                  </p>
                </FadeIn>
              ))}
            </div>

            {/* Core strengths / highlights */}
            <FadeIn delay={0.3} y={24}>
              <div className="mt-8">
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
                  How I Work
                </span>
                <div className="mt-3 flex flex-wrap gap-2">
                  {about.strengths.map((str) => (
                    <span
                      key={str}
                      className="pill-shadow inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-medium text-ink"
                    >
                      <Check className="h-3.5 w-3.5 text-accent" />
                      {str}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right Column: Workspace Showcase Image */}
          <FadeIn delay={0.2} y={32} className="flex flex-col justify-center">
            <div className="frame-shadow group relative overflow-hidden rounded-3xl border border-line bg-white p-3 sm:rounded-[2rem] sm:p-4">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-paper sm:aspect-[16/11]">
                <img
                  src="/about-workspace.png"
                  alt="Workspace"
                  className="h-full w-full object-cover object-center grayscale transition-[filter,transform] duration-1000 ease-out-expo group-hover:scale-105 group-hover:grayscale-0"
                />
              </div>

              <div className="mt-4 flex flex-col gap-1 px-2 pb-2 sm:px-3 sm:pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                    Engineering & Innovation
                  </span>
                  <span className="pill-shadow inline-flex items-center gap-1 rounded-full border border-line bg-white px-2.5 py-0.5 text-[10px] font-semibold text-ink">
                    3+ Years
                  </span>
                </div>
                <p className="font-display text-base font-bold text-ink sm:text-lg">
                  Full Stack & Web3 Engineer
                </p>
                <p className="text-xs text-muted">
                  {profile.location}
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};
