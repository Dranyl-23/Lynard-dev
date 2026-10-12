import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';

const COUNTER_NAMESPACE = 'lynard-dev.website';
const COUNTER_KEY = 'views';
const SESSION_KEY = 'lynard_portfolio_session_viewed';
const CACHE_KEY = 'lynard_portfolio_cached_views';

export const ViewCounter: React.FC<{ className?: string; showLabel?: boolean }> = ({
  className = '',
  showLabel = true
}) => {
  const [views, setViews] = useState<number | null>(() => {
    // Initialize with cached view count if available to avoid layout jump
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? parseInt(cached, 10) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const recordOrFetchViews = async () => {
      try {
        const hasViewed = sessionStorage.getItem(SESSION_KEY);
        // If first visit in this browser session, increment (hit). Otherwise, just read (get).
        const endpoint = hasViewed
          ? `https://abacus.jasoncameron.dev/get/${COUNTER_NAMESPACE}/${COUNTER_KEY}`
          : `https://abacus.jasoncameron.dev/hit/${COUNTER_NAMESPACE}/${COUNTER_KEY}`;

        const res = await fetch(endpoint, {
          method: 'GET',
          headers: { Accept: 'application/json' }
        });

        if (!res.ok) throw new Error('Counter API response not OK');

        const data = await res.json();
        const count = typeof data?.value === 'number' ? data.value : parseInt(data?.value, 10);

        if (!isNaN(count) && isMounted) {
          setViews(count);
          localStorage.setItem(CACHE_KEY, count.toString());
          if (!hasViewed) {
            sessionStorage.setItem(SESSION_KEY, 'true');
          }
        }
      } catch (err) {
        // Silently keep cached views if network fails
        console.debug('View counter fetch note:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    recordOrFetchViews();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      title={views !== null ? `Total Portfolio Views: ${views.toLocaleString()}` : 'Live Portfolio Views'}
      className={`group pill-shadow relative flex items-center gap-1.5 rounded-full border border-line bg-card/80 px-2.5 py-1.5 text-xs font-semibold text-ink backdrop-blur-md transition-all duration-300 hover:border-accent/50 ${className}`}
    >
      {/* Eye Icon */}
      <Eye className="h-3.5 w-3.5 text-muted transition-colors duration-300 group-hover:text-ink" />

      {/* Count Display */}
      <span className="tabular-nums font-mono text-[11px] font-bold text-ink sm:text-xs">
        {views !== null ? views.toLocaleString() : (isLoading ? '...' : '1')}
      </span>

      {showLabel && (
        <span className="hidden text-[10px] font-medium text-muted transition-colors duration-300 group-hover:text-ink/80 min-[420px]:inline">
          views
        </span>
      )}
    </motion.div>
  );
};

export default ViewCounter;
