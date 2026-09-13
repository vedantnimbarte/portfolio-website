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

const chip =
  'flex items-center gap-1.5 rounded-full border border-line bg-deep px-3 py-1.5 text-xs text-mute transition-colors hover:border-blue hover:text-ink';

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
    <div aria-busy={!done} className="max-w-[92%] rounded-2xl rounded-bl-md bg-panel px-4 py-3">
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
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            onKeyDown={(e) => e.key === 'Escape' && close()}
            className="card fixed bottom-24 right-4 z-[150] flex h-[min(540px,calc(100dvh-8rem))] w-[min(380px,calc(100vw-2rem))] origin-bottom-right flex-col overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] sm:right-6"
          >
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-blue to-plum text-xs font-bold">VN</span>
              <div className="min-w-0 flex-1">
                <p className="t-small font-semibold">Ask about Vedant</p>
                <p className="text-[11px] text-mute">Answers from this site only, no AI model</p>
              </div>
              <button type="button" onClick={close} aria-label="Close chat" className="grid size-8 place-items-center rounded-full text-mute hover:bg-deep hover:text-ink">
                <X size={16} aria-hidden />
              </button>
            </div>

            <div ref={logRef} role="log" aria-live="polite" className="flex-1 space-y-3 overflow-y-auto p-4">
              {log.map((m, i) =>
                m.role === 'visitor' ? (
                  <p key={m.id} className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-blue px-4 py-2.5 t-small">
                    {m.text}
                  </p>
                ) : (
                  <Reply key={m.id} answer={m.answer!} skip={i < log.length - 1} />
                )
              )}
              {log.length <= 1 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {SUGGESTED.map((s) => (
                    <button key={s} type="button" onClick={() => ask(s)} className={chip}>{s}</button>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={submit} className="flex items-center gap-2 border-t border-line p-3">
              <label htmlFor={inputId} className="sr-only">Your question</label>
              <input
                id={inputId}
                ref={inputRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ask about his work, stack or availability"
                autoComplete="off"
                className="min-w-0 flex-1 rounded-full bg-deep px-4 py-2.5 t-small placeholder:text-mute focus:outline-none focus-visible:ring-2 focus-visible:ring-blue"
              />
              <button type="submit" aria-label="Send" disabled={!text.trim()} className="grid size-10 shrink-0 place-items-center rounded-full bg-blue transition-opacity disabled:opacity-40">
                <ArrowUp size={17} aria-hidden />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        ref={launcherRef}
        type="button"
        aria-expanded={chat}
        onClick={() => dispatch({ type: 'CHAT', open: !chat })}
        className="fixed bottom-5 right-4 z-[150] flex items-center gap-2 rounded-full bg-blue py-3 pl-3.5 pr-3.5 font-semibold shadow-[0_12px_30px_-8px_rgba(20,110,245,0.8)] transition-colors hover:bg-[#2a7dff] sm:right-6 sm:pr-5"
      >
        {chat ? <X size={20} aria-hidden /> : <MessageCircle size={20} aria-hidden />}
        <span className="t-small max-sm:sr-only">{chat ? 'Close' : 'Ask about me'}</span>
      </button>
    </>
  );
};

/* -------------------------------------------------------------------------- */

export const CommandPalette: React.FC = () => {
  const { palette, dispatch, ask } = useSite();
  const [text, setText] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const listId = useId();

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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="fixed inset-0 z-[250] flex items-start justify-center bg-deep/80 p-4 pt-[14vh] backdrop-blur-sm"
          onMouseDown={(e) => e.target === e.currentTarget && close()}
        >
          <div role="dialog" aria-modal="true" aria-label="Search the site" className="card w-full max-w-lg overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-3 border-b border-line px-4">
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
                className="w-full bg-transparent py-4 t-body placeholder:text-mute focus:outline-none"
              />
              <kbd className="rounded bg-deep px-1.5 py-0.5 font-sans text-[11px] text-mute">Esc</kbd>
            </div>

            <ul id={listId} role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
              {results.map((c, i) => (
                <li
                  key={c.id}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseMove={() => setActive(i)}
                  onClick={() => run(c)}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 t-small ${i === active ? 'bg-blue text-ink' : 'text-mute'}`}
                >
                  <c.icon size={15} aria-hidden />
                  <span className={i === active ? '' : 'text-ink'}>{c.label}</span>
                  {c.hint && <span className="ml-auto text-xs opacity-70">{c.hint}</span>}
                </li>
              ))}
              {asking && (
                <li
                  id={`${listId}-${results.length}`}
                  role="option"
                  aria-selected={active === results.length}
                  onMouseMove={() => setActive(results.length)}
                  onClick={() => ask(text)}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 t-small ${active === results.length ? 'bg-blue text-ink' : 'text-mute'}`}
                >
                  <MessageCircle size={15} aria-hidden />
                  <span className="truncate">Ask: &ldquo;{text}&rdquo;</span>
                  <CornerDownLeft size={13} className="ml-auto shrink-0" aria-hidden />
                </li>
              )}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
