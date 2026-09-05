import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Check, CornerDownLeft, Copy, ExternalLink } from 'lucide-react';
import type { Answer, KbAction, Message } from '../types';
import { KB, RECORD, SUGGESTED, search } from '../lib/knowledge';
import { ConsoleCommand, filterCommands, looksLikeQuestion } from '../lib/commands';
import { useConsole } from '../hooks/useConsole';
import { useTypewriter } from '../hooks/useTypewriter';
import { ModuleHeading } from '../components/ui/Panel';

/* -------------------------------------------------------------------------- */

const ActionChip: React.FC<{ action: KbAction }> = ({ action }) => {
  const { dispatch, select } = useConsole();
  const [copied, setCopied] = useState(false);

  if (action.kind === 'link') {
    return (
      <a
        href={action.href}
        target="_blank"
        rel="noreferrer"
        className="t-micro flex items-center gap-1.5 border border-trace bg-void px-2.5 py-1.5 text-ink-dim transition-colors hover:border-signal/50 hover:text-signal"
      >
        <ExternalLink size={10} aria-hidden />
        {action.label}
      </a>
    );
  }

  const onClick = async () => {
    if (action.kind === 'module') return select(action.module, 'command');
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
    <button
      type="button"
      onClick={onClick}
      className="t-micro flex items-center gap-1.5 border border-trace bg-void px-2.5 py-1.5 text-ink-dim transition-colors hover:border-signal/50 hover:text-signal"
    >
      {action.kind === 'copy' && (copied ? <Check size={10} aria-hidden /> : <Copy size={10} aria-hidden />)}
      {action.kind === 'copy' && copied ? 'Copied' : action.label}
    </button>
  );
};

/* -------------------------------------------------------------------------- */

/** One console reply. The typed text is aria-hidden and a complete copy is
 *  handed to the log's live region once, on completion — streaming into a live
 *  region re-announces a growing string on every frame. */
const Reply: React.FC<{ answer: Answer; skip: boolean }> = ({ answer, skip }) => {
  const full = answer.entries.map((e) => e.body).join('\n\n');
  const { shown, done } = useTypewriter(full, skip);
  const shownParts = shown.split('\n\n');

  return (
    <div aria-busy={!done}>
      <div aria-hidden>
        {answer.entries.map((entry, i) => {
          const text = shownParts[i];
          if (text === undefined) return null;
          const complete = i < shownParts.length - 1 || done;
          return (
            <div key={entry.id} className="mb-4">
              <p className="t-prose text-ink">{text}</p>
              {complete && (
                <>
                  <p className="t-micro mt-2 text-ink-dim">{entry.cite}</p>
                  {entry.actions && entry.actions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {entry.actions.map((a) => (
                        <ActionChip key={a.label} action={a} />
                      ))}
                    </div>
                  )}
                </>
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

let greeted = false; // module-scoped: StrictMode mounts effects twice in dev

export const Query: React.FC = () => {
  const { log, palette, dispatch, select } = useConsole();
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const results = useMemo(() => (open ? filterCommands(text) : []), [open, text]);
  const asking = text.trim().length > 0 && (results.length === 0 || looksLikeQuestion(text));
  const askIndex = results.length; // the ask row sits after every command row

  /* Greeting. Fires once per page load, not once per module visit. */
  useEffect(() => {
    if (greeted || log.length) return;
    greeted = true;
    const greeting = KB.find((e) => e.id === 'intent/greeting');
    if (greeting) {
      dispatch({
        type: 'REPLY',
        text: greeting.body,
        answer: { query: '', entries: [greeting], hit: true },
      });
    }
  }, [dispatch, log.length]);

  /* Cmd-K asked for the prompt. Focus it and clear the request. */
  useEffect(() => {
    if (!palette) return;
    inputRef.current?.focus();
    inputRef.current?.select();
    setOpen(true);
    dispatch({ type: 'PALETTE', open: false });
  }, [palette, dispatch]);

  /* Keep the newest reply in view. */
  useEffect(() => {
    const el = transcriptRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log.length]);

  const ask = (question: string) => {
    const q = question.trim();
    if (!q) return;
    dispatch({ type: 'ASK', text: q });
    const answer = search(q);
    dispatch({ type: 'REPLY', text: answer.entries.map((e) => e.body).join(' '), answer });
    setText('');
    setOpen(false);
    setActive(0);
  };

  const runCommand = (cmd: ConsoleCommand) => {
    setText('');
    setOpen(false);
    setActive(0);
    switch (cmd.run.kind) {
      case 'module':
        return select(cmd.run.module, 'command');
      case 'project':
        return dispatch({ type: 'OPEN_PROJECT', name: cmd.run.name });
      case 'boot':
        return dispatch({ type: 'BOOT_REPLAY' });
      case 'ask':
        return ask(cmd.run.text);
    }
  };

  const submit = () => {
    if (open && results.length && active < results.length) return runCommand(results[active]);
    ask(text);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const total = results.length + (asking ? 1 : 0);
    if (e.key === 'Enter') {
      e.preventDefault();
      return submit();
    }
    if (e.key === 'ArrowDown' && total) {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (i + 1) % total);
    } else if (e.key === 'ArrowUp' && total) {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (i - 1 + total) % total);
    } else if (e.key === 'Home' && open) {
      e.preventDefault();
      setActive(0);
    } else if (e.key === 'End' && open && total) {
      e.preventDefault();
      setActive(total - 1);
    } else if (e.key === 'Escape') {
      // First press clears a query; second closes the list.
      if (text) setText('');
      else setOpen(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  return (
    <div className="flex h-full flex-col">
      <ModuleHeading title="QUERY" hint={`${KB.length} entries · 0 external calls`} />

      {/* Transcript. The one live region in the module. */}
      <div
        ref={transcriptRef}
        role="log"
        aria-live="polite"
        aria-atomic="false"
        aria-label="Console transcript"
        className="custom-scrollbar min-h-0 flex-1 overflow-y-auto pr-2"
      >
        {log.map((m: Message, i) => (
          <div key={m.id} className="mb-6">
            {m.role === 'visitor' ? (
              <p className="t-readout text-signal">
                <span aria-hidden>&gt; </span>
                {m.text}
              </p>
            ) : (
              <Reply answer={m.answer!} skip={i < log.length - 1} />
            )}
          </div>
        ))}
      </div>

      {/* Suggested prompts — how a visitor learns what is answerable. */}
      {log.length <= 1 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {SUGGESTED.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => ask(s)}
              className="t-micro border border-trace bg-void px-2.5 py-1.5 text-ink-dim transition-colors hover:border-signal/50 hover:text-signal"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* One input: commands and questions share it, so there is never a second
          search box six inches away doing something different. */}
      <form onSubmit={onSubmit} className="relative mt-4 shrink-0">
        {open && (results.length > 0 || asking) && (
          <ul
            id={listId}
            role="listbox"
            aria-label="Commands"
            className="custom-scrollbar absolute bottom-full left-0 right-0 mb-px max-h-64 overflow-y-auto border border-trace bg-hull"
          >
            {results.map((c, i) => (
              <li
                key={c.id}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseMove={() => setActive(i)}
                onClick={() => runCommand(c)}
                className={`t-micro flex cursor-pointer items-center gap-2.5 px-3 py-2 ${
                  i === active ? 'bg-signal/10 text-signal' : 'text-ink-dim'
                }`}
              >
                <c.icon size={12} aria-hidden />
                <span className="text-ink">{c.label}</span>
                {c.hint && <span className="ml-auto opacity-60">{c.hint}</span>}
              </li>
            ))}
            {asking && (
              <li
                id={`${listId}-${askIndex}`}
                role="option"
                aria-selected={active === askIndex}
                onMouseMove={() => setActive(askIndex)}
                onClick={() => ask(text)}
                className={`t-micro flex cursor-pointer items-center gap-2.5 border-t border-trace px-3 py-2 ${
                  active === askIndex ? 'bg-signal/10 text-signal' : 'text-ink-dim'
                }`}
              >
                <span aria-hidden>&rang;</span>
                Ask VN-OS: <span className="text-ink">&ldquo;{text}&rdquo;</span>
                <CornerDownLeft size={11} className="ml-auto" aria-hidden />
              </li>
            )}
          </ul>
        )}

        <label htmlFor={`${listId}-input`} className="sr-only">
          Ask about the operator, or run a command
        </label>
        <div className="flex items-center gap-2 border border-trace bg-hull px-3 py-2.5 focus-within:border-signal/50">
          <span aria-hidden className="t-readout text-signal">
            &gt;
          </span>
          <input
            id={`${listId}-input`}
            ref={inputRef}
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
            aria-autocomplete="list"
            autoComplete="off"
            value={text}
            placeholder={`ask about the operator — try "rust", or Cmd-K for ${RECORD.repos} repos`}
            onChange={(e) => {
              setText(e.target.value);
              setOpen(true);
              setActive(0);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            className="t-readout w-full bg-transparent text-ink placeholder:text-ink-dim/60 focus:outline-none"
          />
        </div>
      </form>
    </div>
  );
};
