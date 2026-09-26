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
  const { resolvedMode } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  if (!siteKey) {
    return null;
  }

  // Load the Google reCAPTCHA explicit script once
  useEffect(() => {
    if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
      setIsLoaded(true);
      return;
    }

    const existingScript = document.getElementById('google-recaptcha-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'google-recaptcha-script';
      script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.grecaptcha) {
          window.grecaptcha.ready(() => {
            setIsLoaded(true);
          });
        }
      };
      script.onerror = () => {
        console.warn('Google reCAPTCHA script failed to load (possibly blocked by an ad-blocker).');
        setLoadError(true);
      };
      document.body.appendChild(script);
    } else {
      const checkInterval = setInterval(() => {
        if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
          setIsLoaded(true);
          clearInterval(checkInterval);
        }
      }, 150);

      return () => clearInterval(checkInterval);
    }
  }, []);

  // Render or re-render widget when script is loaded or theme changes
  useEffect(() => {
    if (!isLoaded || !containerRef.current || !window.grecaptcha) return;

    // Clear previous rendered widget elements if re-rendering on theme change
    containerRef.current.innerHTML = '';

    try {
      const id = window.grecaptcha.render(containerRef.current, {
        sitekey: siteKey,
        theme: resolvedMode === 'dark' ? 'dark' : 'light',
        size: 'normal',
        callback: (token: string) => {
          onVerify(token);
        },
        'expired-callback': () => {
          if (onExpire) onExpire();
        },
        'error-callback': () => {
          console.warn('Google reCAPTCHA verification error.');
        }
      });
      widgetIdRef.current = id;
    } catch (err) {
      console.warn('Error rendering Google reCAPTCHA widget:', err);
    }

    return () => {
      // Container cleaned up on re-render
    };
  }, [isLoaded, resolvedMode, siteKey, onVerify, onExpire]);

  if (loadError) {
    return (
      <div className="rounded-xl border border-line bg-paper/50 p-3 text-[11px] text-muted">
        🛡️ <span className="font-semibold">Spam Shield Active:</span> ReCAPTCHA script was blocked by client ad-blocker. Honeypot and rate-limiting are guarding this form.
      </div>
    );
  }

  return (
    <div className={`recaptcha-wrapper overflow-hidden py-1 ${className}`}>
      <div className="flex flex-col items-start gap-1.5">
        <div
          ref={containerRef}
          className="recaptcha-box origin-top-left transition-transform duration-300 max-w-full min-h-[78px]"
        />
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
