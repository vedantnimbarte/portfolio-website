import React from 'react';
import type { Project } from '../types';

// GitHub's linguist colours (beige Rust, olive CUDA) fight the site palette,
// so languages take site colours instead. The legend always names them.
const SWATCH: Record<string, string> = {
  TypeScript: '#146ef5',
  JavaScript: '#6aa5ff',
  Rust: '#ffd84a',
  Python: '#8b7bff',
  Cuda: '#1f8a5b',
};
export const swatch = (name: string) => SWATCH[name] ?? '#5b6780';

/** Share of code by language, one segment per language. Decorative; pair it
 *  with a text breakdown. */
export const LanguageBar: React.FC<{ languages: Project['languages']; className?: string }> = ({
  languages, className = '',
}) => (
  <span aria-hidden className={`flex w-full ${className}`}>
    {languages.map((l) => (
      <span
        key={l.name}
        className="h-full min-w-[3px] [border-radius:inherit]"
        style={{ flex: `${l.percent} 1 0`, backgroundColor: swatch(l.name) }}
      />
    ))}
  </span>
);
