import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { navLinks, profile } from '../../data/portfolioData';
import { useLenisScroll } from '../LenisProvider';
import { ArrowUpRight, Menu, X } from '../icons/UIIcons';
import { EXPO_OUT } from '../ui/FadeIn';
import { ThemeToggle } from '../ui/ThemeToggle';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollTo } = useLenisScroll();

  const handleNav = (href: string) => {
    setMobileMenuOpen(false);
    scrollTo(href);
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 0.2, ease: EXPO_OUT }}
      className="absolute inset-x-0 top-0 z-40 pt-4 sm:pt-6"
    >
      <div className="section-container flex items-center justify-between gap-3">
        {/* Left: Brand Avatar */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => handleNav('#home')}
            aria-label={profile.name}
            className="pill-shadow flex h-9.5 w-9.5 items-center justify-center rounded-full bg-ink font-display text-sm font-bold text-white transition-transform duration-500 hover:scale-105 cursor-pointer"
          >
            {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
          </button>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNav(link.href)}
              className="group relative rounded-full px-4 py-2 text-[13px] font-medium text-ink/80 transition-colors hover:text-ink cursor-pointer"
            >
              {link.label}
              {link.sup && (
                <sup className="ml-0.5 text-[9px] font-normal text-muted">
                  {link.sup}
                </sup>
              )}
              <span className="absolute inset-x-4 -bottom-px h-px origin-left scale-x-0 bg-ink transition-transform duration-500 group-hover:scale-x-100" />
            </button>
          ))}
        </nav>

        {/* Right: Theme Toggle, Desktop CTA & Mobile Menu Toggle */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <button
            type="button"
            onClick={() => handleNav('#contact')}
            className="group hidden items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-xs font-semibold text-white transition-transform duration-500 hover:scale-[1.03] dark:bg-white dark:text-neutral-950 lg:flex cursor-pointer"
          >
            <span>Let's Talk</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Menu"
            className="pill-shadow flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink lg:hidden cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.55, ease: EXPO_OUT }}
            className="pill-shadow mx-5 mt-2 rounded-3xl border border-line bg-white/95 p-3 backdrop-blur-xl sm:mx-6 lg:hidden"
          >
            {navLinks.map((link, idx) => (
              <motion.button
                key={link.label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 * idx, duration: 0.5, ease: EXPO_OUT }}
                onClick={() => handleNav(link.href)}
                className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium text-ink transition-colors duration-500 hover:bg-paper cursor-pointer"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="h-4 w-4 text-muted" />
              </motion.button>
            ))}
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.5, ease: EXPO_OUT }}
              onClick={() => handleNav('#contact')}
              className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white dark:bg-white dark:text-neutral-950 cursor-pointer"
            >
              <span>Let's Talk</span>
              <ArrowUpRight className="h-4 w-4" />
            </motion.button>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
