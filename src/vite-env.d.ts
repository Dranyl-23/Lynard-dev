/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WEB3FORMS_ACCESS_KEY?: string;
  readonly VITE_RECAPTCHA_SITE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  grecaptcha?: {
    render: (
      container: string | HTMLElement,
      parameters: {
        sitekey: string;
        theme?: 'dark' | 'light';
        size?: 'normal' | 'compact';
        callback?: (token: string) => void;
        'expired-callback'?: () => void;
        'error-callback'?: () => void;
      }
    ) => number;
    reset: (widgetId?: number) => void;
    getResponse: (widgetId?: number) => string;
    ready: (callback: () => void) => void;
  };
}
