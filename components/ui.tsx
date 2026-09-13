import React from 'react';
import { ArrowUpRight } from 'lucide-react';

type PillProps = {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
} & (
  | ({ href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>)
  | ({ href?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>)
);

/** The white pill with a blue disc on its right edge. Link when given href. */
export const Pill: React.FC<PillProps> = ({ children, icon, className = '', ...rest }) => {
  const cls = `group inline-flex items-center gap-3 rounded-full bg-ink py-1.5 pl-5 pr-1.5 t-small font-semibold text-navy transition-colors hover:bg-sun ${className}`;
  const inner = (
    <>
      {children}
      <span className="grid size-7 place-items-center rounded-full bg-blue text-ink transition-transform group-hover:rotate-45">
        {icon ?? <ArrowUpRight size={15} aria-hidden />}
      </span>
    </>
  );
  if ('href' in rest && rest.href !== undefined) {
    return <a className={cls} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>{inner}</a>;
  }
  return (
    <button type="button" className={cls} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {inner}
    </button>
  );
};

/** Infinite horizontal strip. The second copy exists only for the loop. */
export const Marquee: React.FC<{
  children: React.ReactNode;
  seconds?: number;
  reverse?: boolean;
  gap?: string;
  className?: string;
}> = ({ children, seconds = 40, reverse = false, gap = '1rem', className = '' }) => (
  <div className={`marquee ${className}`}>
    <div
      className="marquee-track"
      style={{
        '--marquee-duration': `${seconds}s`,
        '--marquee-direction': reverse ? 'reverse' : 'normal',
      } as React.CSSProperties}
    >
      <div className="flex shrink-0" style={{ gap, paddingRight: gap }}>{children}</div>
      <div className="marquee-copy flex shrink-0" style={{ gap, paddingRight: gap }} aria-hidden inert>
        {children}
      </div>
    </div>
  </div>
);
