import React, { useEffect, useState } from 'react';
import { STATS } from '../constants';
import { KB, RECORD } from '../lib/knowledge';
import { clockDuration, relativeTime } from '../lib/format';
import { istTime, localTime, localZone, useTelemetry } from '../hooks/useTelemetry';
import { useConsole } from '../hooks/useConsole';
import { CircuitTraces } from './CircuitTraces';

/*
 * Honesty rule, enforced by the two-column split below:
 * every readout must name the object it measures — this session, this browser,
 * this repo snapshot, or the employer production systems. If it cannot, it does
 * not ship. That is why there is no CPU gauge, no request rate, no latency, no
 * fake syslog: there is no backend, so all four would be fabricated.
 *
 * LIVE   (cyan)  = measured here, now.
 * RECORD (amber) = measured elsewhere, historical. Never animated, never
 *                  next to a pulsing dot, so 99.9% cannot read as this page.
 */

const Row: React.FC<{ label: string; value: React.ReactNode; tone?: 'signal' | 'record' }> = ({
  label,
  value,
  tone,
}) => (
  <div className="flex items-baseline justify-between gap-3">
    <span className="t-micro text-ink-dim">{label}</span>
    <span
      className={`t-micro tabular-nums ${
        tone === 'signal' ? 'text-signal' : tone === 'record' ? 'text-record' : 'text-ink'
      }`}
    >
      {value}
    </span>
  </div>
);

const useViewport = () => {
  const [size, setSize] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  useEffect(() => {
    const on = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return size;
};

export const Telemetry: React.FC = () => {
  const { now, sessionMs } = useTelemetry();
  const { active } = useConsole();
  const { w, h } = useViewport();

  return (
    <aside
      className="relative hidden w-[260px] shrink-0 flex-col gap-6 overflow-hidden border-l border-trace bg-bezel p-4 console:flex"
      aria-label="Console readouts"
    >
      {/* One static sentence carries the whole column for a screen reader.
          A live region here would re-announce every second and make the page
          unusable. */}
      <p className="sr-only">
        Operator metrics, measured on {RECORD.employer} production systems:{' '}
        {STATS.map((s) => `${s.value} ${s.label}`).join(', ')}. Public code:{' '}
        {RECORD.repos} repositories, {RECORD.stars} stars.
      </p>

      <div aria-hidden>
        <div className="mb-3 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-signal motion-safe:animate-pulse" />
          <span className="t-label text-signal">Live</span>
          <span className="h-px flex-1 bg-trace" />
        </div>
        <div className="space-y-1.5">
          <Row label="operator" value={`${istTime(now)} IST`} tone="signal" />
          <Row label="local" value={localTime(now)} />
          <Row label="zone" value={localZone()} />
          <Row label="session" value={clockDuration(sessionMs)} tone="signal" />
          <Row label="module" value={active} />
          <Row label="viewport" value={`${w}x${h}`} />
          <Row label="index" value={`${KB.length} entries`} />
          <Row label="external" value="0 calls" tone="signal" />
        </div>
      </div>

      <div aria-hidden>
        <div className="mb-1 flex items-center gap-2">
          <span className="t-label text-record">Record</span>
          <span className="h-px flex-1 bg-trace" />
        </div>
        <p className="t-micro mb-3 text-ink-dim">
          {RECORD.employer.toLowerCase()} production · snapshot
        </p>
        <div className="space-y-1.5">
          {STATS.map((s) => (
            <Row key={s.label} label={s.label.toLowerCase()} value={s.value} tone="record" />
          ))}
          <Row label="repos" value={`${RECORD.repos} · ${RECORD.stars} stars`} tone="record" />
          <Row
            label="last push"
            value={`${RECORD.lastPush.name} ${relativeTime(RECORD.lastPush.updatedAt)}`}
            tone="record"
          />
        </div>
      </div>

      <CircuitTraces className="pointer-events-none mt-auto h-40 w-full text-signal/25" />
    </aside>
  );
};
