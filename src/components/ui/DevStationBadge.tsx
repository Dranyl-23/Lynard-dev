import React from 'react';

export const DevStationBadge: React.FC = () => {
  return (
    <a
      href="https://www.dev-station.dev/portfolio/7133c0a0-46ed-4a41-a2c5-3fa74d7b7563"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="View my portfolio on DEV/STATION"
      className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex min-h-11 min-w-11 items-center justify-end print:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-transform duration-300 hover:-translate-x-1"
    >
      <img
        src="https://www.dev-station.dev/badge-vertical.svg"
        alt="DEV/STATION"
        width={36}
        height={130}
        loading="lazy"
        className="block w-[30px] h-auto sm:w-[36px]"
      />
    </a>
  );
};

export default DevStationBadge;
