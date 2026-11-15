import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUp, Check, Copy, CornerDownLeft, ExternalLink, MessageCircle, Search, X,
} from 'lucide-react';
import type { Answer, KbAction } from '../types';
import { SUGGESTED } from '../lib/knowledge';
import { SiteCommand, filterCommands, looksLikeQuestion } from '../lib/commands';
import { goTo, useSite } from '../hooks/useSite';
import { useTypewriter } from '../hooks/useTypewriter';
import { useModalLayer } from '../hooks/useModalLayer';
import portrait from '../assets/profile.jpg';

const chip =
  'flex items-center gap-1.5 rounded-full border border-line bg-deep/60 px-3 py-1.5 text-xs text-mute transition-colors hover:border-ink hover:text-ink';

// Shared surface for the floating panels: glass over the page, one radius.
const glass =
  'rounded-[1.5rem] border border-white/10 bg-navy/85 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl';

const SPRING = { type: 'spring', stiffness: 420, damping: 34 } as const;

/* -------------------------------------------------------------------------- */

const ActionChip: React.FC<{ action: KbAction }> = ({ action }) => {
  const { dispatch } = useSite();
  const [copied, setCopied] = useState(false);

  if (action.kind === 'link') {
    return (
      <a href={action.href} target="_blank" rel="noreferrer" className={chip}>
        <ExternalLink size={11} aria-hidden />
        {action.label}
      </a>
    );
  }

  const onClick = async () => {
    if (action.kind === 'section') {
      dispatch({ type: 'CHAT', open: false });
      return goTo(action.section);
    }
    if (action.kind === 'project') return dispatch({ type: 'OPEN_PROJECT', name: action.name });
    try {
      await navigator.clipboard.writeText(action.value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Non-secure context or denied permission — fall back to the mail client.
      window.location.href = `mailto:${action.value}`;
    }
  };

  return (
    <button type="button" onClick={onClick} className={chip}>
      {action.kind === 'copy' && (copied ? <Check size={11} aria-hidden /> : <Copy size={11} aria-hidden />)}
      {action.kind === 'copy' && copied ? 'Copied' : action.label}
    </button>
  );
};

/** One reply. The typed text is aria-hidden and a complete copy is handed to
 *  the log's live region once, on completion — streaming into a live region
 *  re-announces a growing string on every frame. */
const Reply: React.FC<{ answer: Answer; skip: boolean }> = ({ answer, skip }) => {
  const full = answer.entries.map((e) => e.body).join('\n\n');
  const { shown, done } = useTypewriter(full, skip);
  const parts = shown.split('\n\n');

  return (
    <div aria-busy={!done} className="max-w-[92%] rounded-2xl rounded-bl-md border border-line/70 bg-panel/80 px-4 py-3">
      <div aria-hidden className="space-y-3">
        {answer.entries.map((entry, i) => {
          const text = parts[i];
          if (text === undefined) return null;
          const complete = i < parts.length - 1 || done;
          return (
            <div key={entry.id}>
              <p className="t-small">{text}</p>
              {complete && entry.actions && entry.actions.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {entry.actions.map((a) => <ActionChip key={a.label} action={a} />)}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {done && <p className="sr-only">{full}</p>}
    </div>
  );
};

/* -------------------------------------------------------------------------- */

export const ChatWidget: React.FC = () => {
  const { chat, log, dispatch, ask } = useSite();
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputId = useId();

  useEffect(() => {
    if (chat) inputRef.current?.focus();
  }, [chat]);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log.length]);

  const close = () => {
    dispatch({ type: 'CHAT', open: false });
    launcherRef.current?.focus();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    ask(text);
    setText('');
  };

  return (
    <>
      <AnimatePresence>
        {chat && (
          <motion.div
            role="dialog"
            aria-label="Ask about Vedant"
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95, transition: { duration: 0.15 } }}
            transition={SPRING}
            onKeyDown={(e) => e.key === 'Escape' && close()}
            className={`fixed bottom-24 right-4 z-[150] flex h-[min(560px,calc(100dvh-8rem))] w-[min(390px,calc(100vw-2rem))] origin-bottom-right flex-col overflow-hidden sm:right-6 ${glass}`}
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
              <img src={portrait} alt="" className="size-10 rounded-full object-cover ring-2 ring-sun/80" />
              <div className="min-w-0 flex-1">
                <p className="t-small font-semibold">Ask about Vedant</p>
                <p className="text-[11px] text-mute">Answers from this site only, no AI model</p>
              </div>
              <button type="button" onClick={close} aria-label="Close chat" className="grid size-9 place-items-center rounded-full border border-white/10 text-mute transition-[color,transform] duration-300 hover:rotate-90 hover:text-ink">
                <X size={16} aria-hidden />
              </button>
            </div>

            <div ref={logRef} role="log" aria-live="polite" className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-5 py-4">
              {log.map((m, i) => (
                // Each message settles up from the input, the way it was sent.
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className={m.role === 'visitor' ? 'flex justify-end' : undefined}
                >
                  {m.role === 'visitor' ? (
                    <p className="w-fit max-w-[85%] rounded-2xl rounded-br-md bg-blue px-4 py-2.5 t-small">{m.text}</p>
                  ) : (
                    <Reply answer={m.answer!} skip={i < log.length - 1} />
                  )}
                </motion.div>
              ))}
              {log.length <= 1 && (
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.25 } } }}
                  className="flex flex-wrap gap-1.5 pt-1"
                >
                  {SUGGESTED.map((s) => (
                    <motion.button
                      key={s}
                      type="button"
                      variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
                      onClick={() => ask(s)}
                      className={chip}
                    >
                      {s}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>

            <form onSubmit={submit} className="border-t border-white/10 p-3">
              <div className="flex items-center gap-2 rounded-full border border-line bg-deep/70 py-1.5 pl-4 pr-1.5 transition-colors focus-within:border-blue">
              <label htmlFor={inputId} className="sr-only">Your question</label>
              <input
                id={inputId}
                ref={inputRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ask about his work, stack or availability"
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent py-1.5 t-small placeholder:text-mute focus:outline-none"
              />
              <button type="submit" aria-label="Send" disabled={!text.trim()} className="grid size-9 shrink-0 place-items-center rounded-full bg-blue transition-[opacity,transform] duration-200 enabled:hover:-translate-y-0.5 disabled:opacity-35">
                <ArrowUp size={16} aria-hidden />
              </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        ref={launcherRef}
        type="button"
        aria-expanded={chat}
        onClick={() => dispatch({ type: 'CHAT', open: !chat })}
        className="fixed bottom-5 right-4 z-[150] flex items-center gap-2 rounded-full bg-blue py-3 pl-3.5 pr-3.5 font-semibold shadow-[0_12px_30px_-8px_rgba(20,110,245,0.8)] transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-[#2a7dff] sm:right-6 sm:pr-5"
      >
        <span className="relative grid size-5 place-items-center">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={chat ? 'x' : 'chat'}
              initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
              transition={{ duration: 0.2 }}
              className="grid place-items-center"
            >
              {chat ? <X size={20} aria-hidden /> : <MessageCircle size={20} aria-hidden />}
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="t-small max-sm:sr-only">{chat ? 'Close' : 'Ask about me'}</span>
      </button>
    </>
  );
};

/* -------------------------------------------------------------------------- */

const Kbd: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <kbd className="grid min-w-5 place-items-center rounded-md border border-white/10 bg-deep px-1 py-0.5 font-sans text-[10px] text-ink">{children}</kbd>
);

/** A palette option. The highlight behind the active row is one shared
 *  element that glides from row to row as the selection moves. */
const Row: React.FC<{ id: string; on: boolean; onHover: () => void; onPick: () => void; children: React.ReactNode }> = ({
  id, on, onHover, onPick, children,
}) => (
  <li
    id={id}
    role="option"
    aria-selected={on}
    onMouseMove={onHover}
    onClick={onPick}
    className={`relative flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 t-small transition-colors ${on ? 'text-ink' : 'text-mute'}`}
  >
    {on && (
      <motion.span
        layoutId="palette-active"
        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
        className="absolute inset-0 rounded-xl border border-blue/50 bg-blue/15"
      />
    )}
    <span className="relative flex min-w-0 flex-1 items-center gap-3">{children}</span>
  </li>
);

export const CommandPalette: React.FC = () => {
  const { palette, dispatch, ask } = useSite();
  const [text, setText] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const listId = useId();
  useModalLayer(palette);

  const results = useMemo(() => filterCommands(text), [text]);
  const asking = text.trim().length > 0 && (results.length === 0 || looksLikeQuestion(text));
  const total = results.length + (asking ? 1 : 0);

  useEffect(() => {
    if (!palette) return;
    opener.current = document.activeElement as HTMLElement | null;
    setText('');
    setActive(0);
    inputRef.current?.focus();
    return () => opener.current?.focus?.();
  }, [palette]);

  const close = () => dispatch({ type: 'PALETTE', open: false });

  const run = (cmd: SiteCommand) => {
    close();
    if (cmd.run.kind === 'section') {
      const id = cmd.run.section;
      // Let focus return to the opener first, or it scrolls the page back.
      window.setTimeout(() => goTo(id), 0);
    } else if (cmd.run.kind === 'project') {
      dispatch({ type: 'OPEN_PROJECT', name: cmd.run.name });
    } else {
      ask(cmd.run.text);
    }
  };

  const choose = (i: number) => (i < results.length ? run(results[i]) : ask(text));

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (total) choose(active);
    } else if (e.key === 'ArrowDown' && total) {
      e.preventDefault();
      setActive((i) => (i + 1) % total);
    } else if (e.key === 'ArrowUp' && total) {
      e.preventDefault();
      setActive((i) => (i - 1 + total) % total);
    }
  };

  return (
    <AnimatePresence>
      {palette && (
        <motion.div
          data-layer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[250] flex items-start justify-center bg-deep/75 p-4 pt-[14vh] backdrop-blur-md"
          onMouseDown={(e) => e.target === e.currentTarget && close()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search the site"
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97, transition: { duration: 0.12 } }}
            transition={SPRING}
            className={`w-full max-w-xl overflow-hidden ${glass}`}
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-5">
              <Search size={17} className="text-mute" aria-hidden />
              <input
                ref={inputRef}
                role="combobox"
                aria-expanded
                aria-controls={listId}
                aria-activedescendant={total ? `${listId}-${active}` : undefined}
                aria-label="Jump to a section or project, or ask a question"
                autoComplete="off"
                value={text}
                onChange={(e) => { setText(e.target.value); setActive(0); }}
                onKeyDown={onKeyDown}
                placeholder="Jump to a section or project, or ask a question"
                className="w-full bg-transparent py-5 t-body placeholder:text-mute focus:outline-none"
              />
            </div>

            <ul id={listId} role="listbox" className="max-h-[50vh] overflow-y-auto overscroll-contain p-2">
              {results.map((c, i) => (
                <Row key={c.id} id={`${listId}-${i}`} on={i === active} onHover={() => setActive(i)} onPick={() => run(c)}>
                  <c.icon size={15} aria-hidden />
                  <span className="truncate text-ink">{c.label}</span>
                  {c.hint && <span className="ml-auto shrink-0 text-xs text-mute">{c.hint}</span>}
                </Row>
              ))}
              {asking && (
                <Row id={`${listId}-${results.length}`} on={active === results.length} onHover={() => setActive(results.length)} onPick={() => ask(text)}>
                  <MessageCircle size={15} aria-hidden />
                  <span className="truncate text-ink">Ask: &ldquo;{text}&rdquo;</span>
                  <CornerDownLeft size={13} className="ml-auto shrink-0 text-mute" aria-hidden />
                </Row>
              )}
              {total === 0 && (
                <li className="px-3 py-6 text-center t-small text-mute">Type a section, a project or a question.</li>
              )}
            </ul>

            <div aria-hidden className="flex items-center gap-4 border-t border-white/10 px-5 py-3 text-[11px] text-mute">
              <span className="flex items-center gap-1.5"><Kbd>↑</Kbd><Kbd>↓</Kbd> move</span>
              <span className="flex items-center gap-1.5"><Kbd>↵</Kbd> open</span>
              <span className="flex items-center gap-1.5"><Kbd>esc</Kbd> close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
