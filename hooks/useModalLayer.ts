import { useEffect } from 'react';

/**
 * While `open`, everything at the top of #root that isn't marked
 * `data-layer` goes `inert` (no focus, no clicks, hidden from screen
 * readers) and the page stops scrolling. Native `inert` does the focus trap,
 * so Tab can't leave the open layer.
 *
 * ponytail: one layer at a time; closing one while another is open would
 * release the page early. Add a counter if layers ever need to stack.
 */
export const useModalLayer = (open: boolean) => {
  useEffect(() => {
    if (!open) return;
    const others = [...(document.getElementById('root')?.children ?? [])].filter(
      (el): el is HTMLElement => el instanceof HTMLElement && !el.hasAttribute('data-layer')
    );
    others.forEach((el) => (el.inert = true));
    document.documentElement.style.overflow = 'hidden';
    return () => {
      others.forEach((el) => (el.inert = false));
      document.documentElement.style.overflow = '';
    };
  }, [open]);
};
