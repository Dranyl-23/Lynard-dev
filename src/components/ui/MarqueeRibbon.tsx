import React from 'react';

interface MarqueeRibbonProps {
  children: React.ReactNode;
  reverse?: boolean;
  duration?: string;
  className?: string;
}

export const MarqueeRibbon: React.FC<MarqueeRibbonProps> = ({
  children,
  reverse = false,
  duration = '45s',
  className = ''
}) => {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className={reverse ? 'marquee-track-reverse' : 'marquee-track'}
        style={{ '--marquee-duration': duration } as React.CSSProperties}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
};
