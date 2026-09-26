import React, { createContext, useContext, useEffect, useRef } from 'react';
import Lenis from 'lenis';

interface LenisContextType {
  lenis: Lenis | null;
  scrollTo: (target: string | HTMLElement) => void;
  lockScroll: (lock: boolean) => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

const LenisContext = createContext<LenisContextType>({
  lenis: null,
  scrollTo: () => {},
  lockScroll: () => {},
  scrollRef: { current: null },
  contentRef: { current: null }
});

export const useLenisScroll = () => useContext(LenisContext);

export const LenisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!scrollRef.current || !contentRef.current) return;

    const lenis = new Lenis({
      wrapper: scrollRef.current,
      content: contentRef.current,
      lerp: 0.068,
      smoothWheel: true,
      wheelMultiplier: 0.88,
      touchMultiplier: 1.05
    });

    lenisRef.current = lenis;

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = (target: string | HTMLElement) => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target, {
        offset: 0,
        duration: 1.8,
        easing: (t: number) => 1 - Math.pow(1 - t, 4)
      });
    } else {
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const lockScroll = (lock: boolean) => {
    const lenis = lenisRef.current;
    if (lenis) {
      if (lock) {
        lenis.stop();
      } else {
        lenis.start();
      }
    }
    if (scrollRef.current) {
      scrollRef.current.style.overflow = lock ? 'hidden' : '';
    }
  };

  return (
    <LenisContext.Provider
      value={{
        lenis: lenisRef.current,
        scrollTo,
        lockScroll,
        scrollRef,
        contentRef
      }}
    >
      {children}
    </LenisContext.Provider>
  );
};
