import React from 'react';
import { motion, useInView } from 'framer-motion';
import { EXPO_OUT } from './FadeIn';

interface RevealTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p';
  once?: boolean;
}

export const RevealText: React.FC<RevealTextProps> = ({
  text,
  className = '',
  delay = 0,
  stagger = 0.04,
  as = 'span',
  once = true
}) => {
  const ref = React.useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once, margin: '-8% 0px' });
  const Component = motion[as] as any;

  // Split into words or characters
  const characters = Array.from(text);

  return (
    <Component ref={ref} className={`inline-block ${className}`}>
      {characters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{
            duration: 0.9,
            delay: delay + index * stagger,
            ease: EXPO_OUT
          }}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </Component>
  );
};
