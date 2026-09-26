import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface RecaptchaWidgetProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  className?: string;
}

export const RecaptchaWidget: React.FC<RecaptchaWidgetProps> = ({
  onVerify,
  onExpire,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const isRenderedRef = useRef(false);
  const onVerifyRef = useRef(onVerify);
  onVerifyRef.current = onVerify;
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  const { resolvedMode } = useTheme();
  const [loadError, setLoadError] = useState(false);

  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    if (!siteKey || !containerRef.current || isRenderedRef.current) return;

    let isMounted = true;

    const renderWidget = () => {
      if (!isMounted || isRenderedRef.current || !containerRef.current) return;
      if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
        try {
          // Clear only on initial render before rendering
          if (!isRenderedRef.current) {
            containerRef.current.innerHTML = '';
            const id = window.grecaptcha.render(containerRef.current, {
              sitekey: siteKey,
              theme: resolvedMode === 'dark' ? 'dark' : 'light',
              size: 'normal',
              callback: (token: string) => {
                onVerifyRef.current(token);
              },
              'expired-callback': () => {
                if (onExpireRef.current) onExpireRef.current();
              },
              'error-callback': () => {
                console.warn('Google reCAPTCHA verification error.');
              }
            });
            widgetIdRef.current = id;
            isRenderedRef.current = true;
          }
        } catch (err) {
          console.warn('Error rendering Google reCAPTCHA widget:', err);
        }
      }
    };

    // If grecaptcha is already available and ready
    if (window.grecaptcha && typeof window.grecaptcha.ready === 'function') {
      window.grecaptcha.ready(renderWidget);
    } else {
      // Poll until grecaptcha script is ready
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
          clearInterval(interval);
          renderWidget();
        } else if (attempts > 60) {
          // If not loaded after 6 seconds, likely blocked by client ad-blocker
          clearInterval(interval);
          if (!isRenderedRef.current && isMounted) {
            setLoadError(true);
          }
        }
      }, 100);

      return () => {
        isMounted = false;
        clearInterval(interval);
      };
    }

    return () => {
      isMounted = false;
    };
  }, [siteKey]); // Strictly dependent only on siteKey

  if (!siteKey) {
    return null;
  }

  return (
    <div className={`recaptcha-wrapper overflow-hidden py-1 ${className}`}>
      <div className="flex flex-col items-start gap-1.5">
        <div
          ref={containerRef}
          className="recaptcha-box origin-top-left transition-transform duration-300 max-w-full min-h-[78px]"
        />

        {loadError && (
          <div className="rounded-xl border border-line bg-paper/50 p-2 text-[11px] text-muted">
            🛡️ <span className="font-semibold">Notice:</span> Google reCAPTCHA was blocked by your browser/ad-blocker. Honeypot protection is active.
          </div>
        )}

        <div className="flex items-center gap-1.5 text-[11px] text-muted">
          <svg className="h-3 w-3 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>Anti-spam & bot protection enabled</span>
        </div>
      </div>
    </div>
  );
};
