import React, { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  suffix = '',
  decimals = 0,
  className = ''
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, {
    duration: 2400,
    bounce: 0,
    restDelta: 0.001
  });

  useEffect(() => {
    if (isInView) {
      motionVal.set(value);
    }
  }, [isInView, value, motionVal]);

  useEffect(() => {
    return spring.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = latest.toFixed(decimals) + suffix;
      }
    });
  }, [spring, decimals, suffix]);

  return (
    <span ref={ref} className={className}>
      {(0).toFixed(decimals) + suffix}
    </span>
  );
};
