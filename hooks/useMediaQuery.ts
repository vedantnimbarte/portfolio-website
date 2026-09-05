import { useCallback, useSyncExternalStore } from 'react';

// matchMedia via useSyncExternalStore — tear-free, no useState/useEffect flash
// on first paint, and no dependency.
export const useMediaQuery = (query: string): boolean => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false // SSR/prerender: assume handheld, the safer default
  );
};

// Mirrors --breakpoint-console in index.css. Keep the two in sync.
export const CONSOLE_BREAKPOINT = 900;
export const useIsConsole = () => useMediaQuery(`(min-width: ${CONSOLE_BREAKPOINT}px)`);
