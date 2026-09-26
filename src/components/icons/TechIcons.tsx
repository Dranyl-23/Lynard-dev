import React from 'react';

// Tech SVG paths for logos
export const TechIcon: React.FC<{ icon: string; className?: string }> = ({
  icon,
  className = 'h-5 w-5'
}) => {
  const iconLower = icon.toLowerCase();

  switch (iconLower) {
    case 'react':
      return (
        <svg role="img" viewBox="-11.5 -10.23174 23 20.46348" className={className} fill="currentColor">
          <circle cx="0" cy="0" r="2.05" />
          <g stroke="currentColor" strokeWidth="1" fill="none">
            <ellipse rx="11" ry="4.2" />
            <ellipse rx="11" ry="4.2" transform="rotate(60)" />
            <ellipse rx="11" ry="4.2" transform="rotate(120)" />
          </g>
        </svg>
      );
    case 'nextjs':
      return (
        <svg role="img" viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M18.665 21.978C16.808 23.255 14.502 24 12 24 5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12c0 3.584-1.574 6.801-4.067 9.001L9.22 7.556H7.112v8.887h1.777v-6.38l8.97 11.458a11.954 11.954 0 0 0 .806-.543zM15.112 7.556h1.777v5.556h-1.777z" />
        </svg>
      );
    case 'flutter':
      return (
        <svg role="img" viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M14.314 0L2.3 12 6 15.7 21.684.013h-7.37zm.014 11.072L7.857 17.53l6.47 6.47H21.7l-6.46-6.468 6.46-6.46h-7.372z" />
        </svg>
      );
    case 'html5':
      return (
        <svg role="img" viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.864 4.41l.716 8.053h9.997l-.36 4.025-4.24.978-4.24-.978-.232-2.72H5.166l.462 5.165 6.349 1.602 6.353-1.602.83-9.188H8.531z" />
        </svg>
      );
    case 'css3':
      return (
        <svg role="img" viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.864 4.41l.716 8.053h9.997l-.36 4.025-4.24.978-4.24-.978-.232-2.72H5.166l.462 5.165 6.349 1.602 6.353-1.602.83-9.188H8.531z" />
        </svg>
      );
    case 'javascript':
      return (
        <svg role="img" viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034-1.216.015-2.191.45-2.79 1.23-.974 1.155-.72 3.12.555 3.99 1.216.87 3.016 1.065 3.331 1.83.21.585.045 1.035-.555 1.245-.75.255-1.74.12-2.31-.495-.27-.285-.45-.615-.66-.99l-1.77.99c.33.645.72 1.11 1.2 1.44.885.63 2.145.855 3.39.69 1.53-.225 2.58-.93 2.925-2.085.075-.24.12-.66.075-.9zm-8.868-.21c0-1.2-.18-2.055-.54-2.58-.69-1.005-1.89-1.05-2.475-.96-.405.075-.72.24-.96.48v6.78c.36.165.75.255 1.17.255 1.08 0 1.845-.375 2.295-1.125.345-.585.51-1.545.51-2.85zm-2.205-1.92c.315 0 .555.15.705.45.18.36.27.915.27 1.68s-.09 1.305-.27 1.65c-.15.315-.39.465-.705.465v-4.245z" />
        </svg>
      );
    case 'typescript':
      return (
        <svg role="img" viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm10.74 17.55h2.25v-8.1h3.15V7.2h-8.55v2.25h3.15v8.1zm-4.95-6.3v1.8h2.7v1.8h-2.7v2.7h-2.25v-8.1h5.4v1.8h-3.15z" />
        </svg>
      );
    case 'dart':
      return (
        <svg role="img" viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M4.125 0L0 4.125l13.125 13.125 2.25-2.25L4.125 0zm15.75 4.125l-2.25-2.25L4.5 15l2.25 2.25 13.125-13.125zM12 24l7.875-7.875L24 20.25 19.875 24H12z" />
        </svg>
      );
    case 'tailwind':
      return (
        <svg role="img" viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" />
        </svg>
      );
    case 'bootstrap':
      return (
        <svg role="img" viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M18.847 4.148C17.067 2.378 14.502 1.4 11.758 1.4H3.693v21.2h8.563c2.695 0 5.148-.962 6.828-2.658 1.625-1.642 2.508-3.905 2.508-6.425-.001-2.906-1.077-5.186-2.745-6.369zm-10.42 2.653h3.331c1.395 0 2.539.422 3.238 1.191.637.7 1.002 1.693 1.002 2.723 0 1.082-.365 2.052-1.028 2.73-.722.74-1.866 1.15-3.212 1.15H8.427V6.801zm6.91 11.233c-.767.755-1.977 1.173-3.411 1.173H8.427v-5.275h3.585c1.474 0 2.67.425 3.376 1.199.643.705.996 1.691.996 2.78 0 1.036-.353 2.008-.996 2.723-.016.017-.033.033-.051.049v-.049z" />
        </svg>
      );
    case 'nodejs':
      return (
        <svg role="img" viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M12 0L1.5 6v12L12 24l10.5-6V6L12 0zm0 2.215l8.5 4.858v9.715L12 21.645 3.5 16.788V7.073L12 2.215z" />
        </svg>
      );
    case 'express':
      return (
        <svg role="img" viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M0 0h24v24H0V0zm19.387 18.256l-3.232-4.48 3.12-4.225h-2.316l-2.022 2.87-2.043-2.87h-2.35l3.15 4.257-3.327 4.448h2.36l2.18-3.05 2.16 3.05h2.46z" />
        </svg>
      );
    case 'laravel':
      return (
        <svg role="img" viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M21.72 6.577L14.07 2.16a2.124 2.124 0 0 0-2.14 0L4.28 6.577A2.124 2.124 0 0 0 3.21 8.42v8.835a2.124 2.124 0 0 0 1.07 1.843l7.65 4.417a2.124 2.124 0 0 0 2.14 0l7.65-4.417a2.124 2.124 0 0 0 1.07-1.843V8.42a2.124 2.124 0 0 0-1.07-1.843z" />
        </svg>
      );
    case 'php':
      return (
        <svg role="img" viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-5.4 7.2h2.7c1.35 0 2.25.9 2.25 2.25 0 1.35-.9 2.25-2.25 2.25H8.4v3.15H6.6V7.2zm9.9 0h2.7c1.35 0 2.25.9 2.25 2.25 0 1.35-.9 2.25-2.25 2.25h-1.8v3.15h-1.8V7.2zm-4.95 0h1.8v7.65h-1.8V7.2zm-3.15 3.15h.9c.45 0 .9-.45.9-.9s-.45-.9-.9-.9h-.9v1.8zm9.9 0h.9c.45 0 .9-.45.9-.9s-.45-.9-.9-.9h-.9v1.8z" />
        </svg>
      );
    case 'api':
      return (
        <svg role="img" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      );
    case 'mysql':
      return (
        <svg role="img" viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M16.5 7.5a4.5 4.5 0 0 0-4.5 4.5v6a4.5 4.5 0 0 0 4.5 4.5 4.5 4.5 0 0 0 4.5-4.5v-6a4.5 4.5 0 0 0-4.5-4.5zm-9 0A4.5 4.5 0 0 0 3 12v6a4.5 4.5 0 0 0 4.5 4.5A4.5 4.5 0 0 0 12 18v-6a4.5 4.5 0 0 0-4.5-4.5z" />
        </svg>
      );
    case 'mongodb':
      return (
        <svg role="img" viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M12 0C11.5 2.5 7 8 7 14c0 3.5 2 6.5 5 7.8 3-1.3 5-4.3 5-7.8 0-6-4.5-11.5-5-14zm0 2.2c2.5 4.8 3.5 8.5 3.5 11.8 0 2.8-1.5 5.2-3.5 6.5-2-1.3-3.5-3.7-3.5-6.5C8.5 10.7 9.5 7 12 2.2z" />
        </svg>
      );
    case 'firebase':
      return (
        <svg role="img" viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M3.89 15.672L6.255.461A.54.54 0 0 1 7.27.288l2.543 4.771zm16.791 3.545L18.42 5.09a.54.54 0 0 0-.964-.176L3.11 19.217l8.28 4.673a1.45 1.45 0 0 0 1.418 0l7.873-4.673z" />
        </svg>
      );
    case 'wordpress':
      return (
        <svg role="img" viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174L2.83 8.35C2.296 9.475 2 10.707 2 12c0 4.14 2.52 7.69 6.12 9.21L4.35 9.87c.99-2.91 3.75-5.01 7.02-5.01 2.37 0 4.47 1.11 5.82 2.85l-1.89 5.46-2.61-7.8c.24-.03.48-.06.75-.06.39 0 .75.06 1.08.15L12 0z" />
        </svg>
      );
    case 'git':
      return (
        <svg role="img" viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M23.546 10.93L13.067.452a1.498 1.498 0 0 0-2.122 0L8.87 2.527l2.673 2.674a1.782 1.782 0 0 1 2.259 2.259l2.569 2.569a1.777 1.777 0 0 1 1.748 1.748 1.78 1.78 0 0 1-3.056 1.258l-2.392-2.393v5.626a1.783 1.783 0 1 1-1.78-1.78v-5.91a1.78 1.78 0 0 1-.954-2.327L7.15 3.633.454 10.33a1.498 1.498 0 0 0 0 2.122l10.48 10.478a1.5 1.5 0 0 0 2.122 0l10.49-10.48a1.5 1.5 0 0 0 0-2.12z" />
        </svg>
      );
    case 'github':
      return (
        <svg role="img" viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
      );
    case 'vscode':
      return (
        <svg role="img" viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.23a1 1 0 0 0 0 1.465l3.87 3.54-3.87 3.54a1 1 0 0 0 0 1.465l1.322 1.173a1 1 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.94-2.377A1.5 1.5 0 0 0 24 20.485V3.963a1.5 1.5 0 0 0-.85-1.376zM18 17.5l-6-5.5 6-5.5v11z" />
        </svg>
      );
    case 'figma':
      return (
        <svg role="img" viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M12 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0zm-8 4a4 4 0 0 1 4-4h4v4a4 4 0 0 1-4 4 4 4 0 0 1-4-4zm0-8a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4zm8-8h4a4 4 0 1 1 0 8h-4V0zm-4 16a4 4 0 0 1 4 4v4H8a4 4 0 0 1-4-4 4 4 0 0 1 4-4z" />
        </svg>
      );
    case 'postman':
      return (
        <svg role="img" viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.82 8.44l-5.74 3.32a.75.75 0 0 1-.76 0L5.58 8.44a.75.75 0 1 1 .74-1.3l5.37 3.1 5.39-3.1a.75.75 0 0 1 .74 1.3z" />
        </svg>
      );
    case 'composer':
      return (
        <svg role="img" viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5 17h-2v-4h-6v4H7V7h2v4h6V7h2v10z" />
        </svg>
      );
    case 'npm':
      return (
        <svg role="img" viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M0 0v24h24V0H0zm18.3 18.3h-4.6V9.2h-3.1v9.1H4.6V5.7h13.7v12.6z" />
        </svg>
      );
    case 'vite':
      return (
        <svg role="img" viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M22.5 3.35L12.75 22.5 1.5 3.35l9.75 1.5 1.5-3.35 1.5 3.35 8.25-1.5z" />
        </svg>
      );
    case 'linux':
      return (
        <svg role="img" viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M12 0c-3.1 0-5.4 2.2-5.4 5.4 0 1.2.4 2.3 1 3.2C6 10.3 5 12.8 5 16c0 4.4 3.1 8 7 8s7-3.6 7-8c0-3.2-1-5.7-2.6-7.4.6-.9 1-2 1-3.2C17.4 2.2 15.1 0 12 0z" />
        </svg>
      );
    case 'cloudflare':
      return (
        <svg role="img" viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M18.2 9.4A6.5 6.5 0 0 0 6 12a5 5 0 0 0 .2 9.9h12.3A4.5 4.5 0 0 0 18.2 9.4z" />
        </svg>
      );
    case 'vercel':
      return (
        <svg role="img" viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M24 22.525H0l12-21.05 12 21.05z" />
        </svg>
      );
    case 'netlify':
      return (
        <svg role="img" viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M16.5 4.5L12 0 7.5 4.5 0 12l7.5 7.5L12 24l4.5-4.5 7.5-7.5-7.5-7.5z" />
        </svg>
      );
    default:
      // Monogram tag for tools without icon
      return (
        <span
          className={`inline-flex items-center justify-center rounded-[5px] border border-line bg-paper text-[10px] font-bold text-ink ${className}`}
        >
          {icon}
        </span>
      );
  }
};
