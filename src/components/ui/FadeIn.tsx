import React from 'react';
import { motion, useInView } from 'framer-motion';

export const EXPO_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  y = 28,
  duration = 1.15,
  className = '',
  once = true
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: '-8% 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration, delay, ease: EXPO_OUT }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
