import React, {
  createContext, useContext, useEffect, useMemo, useReducer, useRef,
} from 'react';
import type { Answer, Message, ModuleId } from '../types';

const MODULE_IDS: ModuleId[] = ['identity', 'ops', 'work', 'stack', 'query'];
const BOOT_KEY = 'vnos.boot.v1';

export interface EventRow {
  t: string;   // HH:MM:SS, the moment it actually happened
  text: string;
}

interface State {
  active: ModuleId;
  /** Where the last SELECT came from — decides whether focus moves into the
   *  panel. Rail selections keep focus in the rail (the tabs pattern). */
  origin: 'rail' | 'command' | 'init';
  booted: boolean;
  palette: boolean;
  log: Message[];
  project: string | null;   // Project.name, for the shared ProjectModal
  events: EventRow[];       // real console actions only — never fabricated
}

type Action =
  | { type: 'SELECT'; id: ModuleId; origin?: State['origin'] }
  | { type: 'BOOT_DONE' }
  | { type: 'BOOT_REPLAY' }
  | { type: 'PALETTE'; open: boolean }
  | { type: 'ASK'; text: string }
  | { type: 'REPLY'; text: string; answer: Answer }
  | { type: 'OPEN_PROJECT'; name: string }
  | { type: 'CLOSE_PROJECT' };

const stamp = () =>
  new Date().toLocaleTimeString('en-GB', { hour12: false });

const note = (s: State, text: string): EventRow[] =>
  [{ t: stamp(), text }, ...s.events].slice(0, 5);

const fromHash = (): ModuleId | null => {
  const h = window.location.hash.replace('#', '') as ModuleId;
  return MODULE_IDS.includes(h) ? h : null;
};

const init = (): State => {
  const hashed = fromHash();
  let stored = false;
  try {
    stored = sessionStorage.getItem(BOOT_KEY) === '1';
  } catch {
    /* Safari private mode throws on storage access. Boot simply replays. */
  }
  const reduced =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return {
    active: hashed ?? 'identity',
    origin: 'init',
    // A hash means someone deep-linked here — don't make them sit through boot.
    booted: Boolean(hashed) || stored || reduced,
    palette: false,
    log: [],
    project: null,
    events: [],
  };
};

let messageId = 0;

const reducer = (s: State, a: Action): State => {
  switch (a.type) {
    case 'SELECT':
      if (a.id === s.active) return { ...s, palette: false };
      return {
        ...s,
        active: a.id,
        origin: a.origin ?? 'rail',
        palette: false,
        events: note(s, `module → ${a.id}`),
      };

    case 'BOOT_DONE':
      if (s.booted) return s; // rAF and the bail timeout can both land
      return { ...s, booted: true, events: note(s, 'console online') };

    case 'BOOT_REPLAY':
      return { ...s, booted: false, palette: false };

    case 'PALETTE':
      // Opening the prompt means going to the module that owns it.
      return a.open
        ? { ...s, palette: true, active: 'query', origin: 'command' }
        : { ...s, palette: false };

    case 'ASK':
      return {
        ...s,
        palette: false,
        active: 'query',
        origin: 'command',
        log: [...s.log, { id: ++messageId, role: 'visitor', text: a.text }],
        events: note(s, `query "${a.text.slice(0, 22)}"`),
      };

    case 'REPLY':
      return {
        ...s,
        log: [
          ...s.log,
          { id: ++messageId, role: 'console', text: a.text, answer: a.answer },
        ],
      };

    case 'OPEN_PROJECT':
      return { ...s, palette: false, project: a.name, events: note(s, `open ${a.name}`) };

    case 'CLOSE_PROJECT':
      return { ...s, project: null };

    default:
      return s;
  }
};

interface Ctx extends State {
  dispatch: React.Dispatch<Action>;
  select: (id: ModuleId, origin?: State['origin']) => void;
}

const ConsoleCtx = createContext<Ctx | null>(null);

export const ConsoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, undefined, init);

  // Hash ↔ module. Deep-linkable (#work in a job application) and the back
  // button leaves a module instead of the whole site. Ten lines, no router.
  const first = useRef(true);
  useEffect(() => {
    const url = `#${state.active}`;
    if (window.location.hash === url) return;
    if (first.current) {
      first.current = false;
      window.history.replaceState(null, '', url); // don't leave a junk entry
    } else {
      window.history.pushState(null, '', url);
    }
  }, [state.active]);

  useEffect(() => {
    const onPop = () => {
      const id = fromHash();
      // An unrecognised hash is somebody else's anchor, not a module. Ignore
      // it instead of yanking the visitor back to Identity.
      if (id) dispatch({ type: 'SELECT', id, origin: 'command' });
      else if (!window.location.hash) dispatch({ type: 'SELECT', id: 'identity', origin: 'command' });
    };
    window.addEventListener('hashchange', onPop);
    window.addEventListener('popstate', onPop);
    return () => {
      window.removeEventListener('hashchange', onPop);
      window.removeEventListener('popstate', onPop);
    };
  }, []);

  useEffect(() => {
    if (!state.booted) return;
    try {
      sessionStorage.setItem(BOOT_KEY, '1');
    } catch {
      /* private mode — the sequence just replays next load */
    }
  }, [state.booted]);

  const value = useMemo<Ctx>(
    () => ({
      ...state,
      dispatch,
      select: (id, origin) => dispatch({ type: 'SELECT', id, origin }),
    }),
    [state]
  );

  return <ConsoleCtx.Provider value={value}>{children}</ConsoleCtx.Provider>;
};

export const useConsole = (): Ctx => {
  const ctx = useContext(ConsoleCtx);
  if (!ctx) throw new Error('useConsole must be used inside <ConsoleProvider>');
  return ctx;
};

export { MODULE_IDS, BOOT_KEY };
