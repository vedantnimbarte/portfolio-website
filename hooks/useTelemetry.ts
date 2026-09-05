import { useSyncExternalStore } from 'react';

// One interval for the whole console. Nothing else polls.
//
// This deliberately does NOT live in the console context: a 1Hz value in a
// top-level provider re-renders the entire shell — including the three.js host
// — once per second, forever. It presents as "the 3D is stuttering" and you
// waste a day on WebGL. Only components that call useTelemetry() re-render.
const T0 = Date.now();

interface Snapshot {
  now: number;
  sessionMs: number;
}

// Must be a cached object, not a fresh literal — React 19 loops otherwise.
let snapshot: Snapshot = { now: T0, sessionMs: 0 };
const subs = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;

const tick = () => {
  const now = Date.now();
  snapshot = { now, sessionMs: now - T0 };
  subs.forEach((f) => f());
};

const start = () => {
  if (timer !== null) return;
  timer = setInterval(tick, 1000);
  document.addEventListener('visibilitychange', onVisibility);
};

const stop = () => {
  if (timer !== null) clearInterval(timer);
  timer = null;
  document.removeEventListener('visibilitychange', onVisibility);
};

// A tab left open for twenty minutes should do nothing at all.
function onVisibility() {
  if (document.hidden) {
    if (timer !== null) clearInterval(timer);
    timer = null;
  } else if (subs.size) {
    tick();
    timer = setInterval(tick, 1000);
  }
}

export const useTelemetry = (): Snapshot =>
  useSyncExternalStore(
    (onChange) => {
      subs.add(onChange);
      if (subs.size === 1) start();
      return () => {
        subs.delete(onChange);
        if (!subs.size) stop();
      };
    },
    () => snapshot,
    () => snapshot
  );

// Intl handles the UTC+5:30 offset. Never hand-roll it.
const istFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false,
});
const localFormat = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit', minute: '2-digit', hour12: false,
});

export const istTime = (now: number) => istFormat.format(now);
export const localTime = (now: number) => localFormat.format(now);
export const localZone = () =>
  Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'local';
