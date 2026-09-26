import React from 'react';
import { profile, footerLinks } from '../../data/portfolioData';
import { useLenisScroll } from '../LenisProvider';
import { FadeIn } from '../ui/FadeIn';
import { ArrowUpRight, Mail, Phone } from '../icons/UIIcons';

export const Footer: React.FC = () => {
  const { scrollTo } = useLenisScroll();

  return (
    <footer className="border-t border-line bg-paper">
      <div className="section-container py-12 sm:py-16 lg:py-20">
        <FadeIn
          y={24}
          className="flex flex-col items-center gap-6 border-b border-line pb-10 text-center sm:flex-row sm:items-end sm:justify-between sm:pb-12 sm:text-left"
        >
          <div>
            <p className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              {profile.name}
            </p>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted sm:mx-0">
              {profile.role} based in {profile.location}. Open for new work.
            </p>
          </div>

          <button
            type="button"
            onClick={() => scrollTo('#contact')}
            className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition-transform duration-500 hover:scale-[1.03] dark:bg-white dark:text-neutral-950 dark:hover:bg-accent dark:hover:text-neutral-950"
          >
            <span>Let's Talk</span>
            <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </FadeIn>

        {/* Links and Socials */}
        <div className="flex flex-col items-center justify-between gap-6 py-8 sm:flex-row sm:py-10">
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-semibold uppercase tracking-wider text-muted sm:justify-start">
            {footerLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => scrollTo(link.href)}
                className="cursor-pointer transition-colors hover:text-ink"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="pill-shadow inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-semibold text-ink transition-all duration-300 hover:bg-ink hover:text-white"
            >
              <svg role="img" viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </a>

            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="pill-shadow inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-semibold text-ink transition-all duration-300 hover:bg-ink hover:text-white"
              >
                <svg role="img" viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span>LinkedIn</span>
              </a>
            )}

            <a
              href={`mailto:${profile.email}`}
              className="pill-shadow inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-semibold text-ink transition-all duration-300 hover:bg-ink hover:text-white"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>Email</span>
            </a>

            <a
              href={`tel:${profile.phone.replace(/\s/g, '')}`}
              className="pill-shadow inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-semibold text-ink transition-all duration-300 hover:bg-ink hover:text-white"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Call</span>
            </a>
          </div>
        </div>

        {/* Bottom Copyright & Back to Top */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-line/60 pt-8 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>

          <button
            type="button"
            onClick={() => scrollTo('#home')}
            className="cursor-pointer font-semibold uppercase tracking-wider text-ink transition-opacity hover:opacity-70"
          >
            Back to Top ↑
          </button>
        </div>
      </div>
    </footer>
  );
};
