import React, { createContext, useContext, useMemo, useReducer } from 'react';
import type { Answer, Message, SectionId } from '../types';
import { KB, search } from '../lib/knowledge';

interface State {
  chat: boolean;
  palette: boolean;
  log: Message[];
  project: string | null;   // Project.name, for the shared ProjectModal
}

type Action =
  | { type: 'CHAT'; open: boolean }
  | { type: 'PALETTE'; open: boolean }
  | { type: 'ASK'; text: string; answer: Answer }
  | { type: 'OPEN_PROJECT'; name: string }
  | { type: 'CLOSE_PROJECT' };

let messageId = 0;
const reply = (answer: Answer): Message => ({
  id: ++messageId,
  role: 'console',
  text: answer.entries.map((e) => e.body).join(' '),
  answer,
});

const reducer = (s: State, a: Action): State => {
  switch (a.type) {
    case 'CHAT': {
      // Greet on the first open. Done here, not in an effect, so StrictMode's
      // double-invoked effects can't greet twice.
      const greeting = KB.find((e) => e.id === 'intent/greeting');
      const log = a.open && !s.log.length && greeting
        ? [reply({ query: '', entries: [greeting], hit: true })]
        : s.log;
      return { ...s, chat: a.open, palette: false, log };
    }
    case 'PALETTE':
      return { ...s, palette: a.open };
    case 'ASK':
      return {
        ...s,
        chat: true,
        palette: false,
        log: [...s.log, { id: ++messageId, role: 'visitor', text: a.text }, reply(a.answer)],
      };
    case 'OPEN_PROJECT':
      return { ...s, palette: false, project: a.name };
    case 'CLOSE_PROJECT':
      return { ...s, project: null };
    default:
      return s;
  }
};

interface Ctx extends State {
  dispatch: React.Dispatch<Action>;
  ask: (text: string) => void;
}

const SiteCtx = createContext<Ctx | null>(null);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    chat: false, palette: false, log: [], project: null,
  });

  const value = useMemo<Ctx>(
    () => ({
      ...state,
      dispatch,
      ask: (text) => {
        const q = text.trim();
        if (q) dispatch({ type: 'ASK', text: q, answer: search(q) });
      },
    }),
    [state]
  );

  return <SiteCtx.Provider value={value}>{children}</SiteCtx.Provider>;
};

export const useSite = (): Ctx => {
  const ctx = useContext(SiteCtx);
  if (!ctx) throw new Error('useSite must be used inside <SiteProvider>');
  return ctx;
};

/** Scroll to a section. `scroll-behavior` in index.css decides smooth vs jump,
 *  so reduced motion is honoured without a second code path. */
export const goTo = (id: SectionId) => {
  document.getElementById(id)?.scrollIntoView();
  window.history.replaceState(null, '', id === 'home' ? window.location.pathname : `#${id}`);
};
