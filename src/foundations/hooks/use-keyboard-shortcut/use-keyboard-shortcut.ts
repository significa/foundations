import { useEffect, useRef } from 'react';
import { useStableCallback } from '@/foundations/hooks/use-stable-callback/use-stable-callback';

export interface SingleKeyboardShortcut {
  key: string;
  meta?: boolean;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  /**
   * Cross-platform modifier. When true, matches `meta` (⌘) on macOS and
   * `ctrl` everywhere else. Overrides `meta` and `ctrl` when set.
   */
  mod?: boolean;
}

export interface SequenceKeyboardShortcut {
  /**
   * Type these keys in order to fire the callback (e.g. `['g', 'i']` for
   * "go to inbox"). Resets on a non-matching key, on any modifier, when
   * focus is in an input, or after `sequenceTimeout` ms of inactivity.
   */
  sequence: string[];
}

export type KeyboardShortcut =
  | SingleKeyboardShortcut
  | SequenceKeyboardShortcut;

export interface UseKeyboardShortcutOptions {
  enabled?: boolean;
  preventDefault?: boolean;
  target?: EventTarget | null;
  /**
   * For sequence shortcuts only — how long to wait between keys before
   * resetting. Defaults to 1000ms.
   */
  sequenceTimeout?: number;
}

const DEFAULT_SEQUENCE_TIMEOUT = 1000;

const isMac = () =>
  typeof navigator !== 'undefined' &&
  /Mac|iPad|iPhone|iPod/.test(navigator.userAgent);

const isTypingTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable;
};

const isSequence = (s: KeyboardShortcut): s is SequenceKeyboardShortcut =>
  'sequence' in s;

const matches = (event: KeyboardEvent, shortcut: SingleKeyboardShortcut) => {
  if (event.key.toLowerCase() !== shortcut.key.toLowerCase()) return false;
  const expectMeta =
    shortcut.mod !== undefined
      ? shortcut.mod
        ? isMac()
        : false
      : Boolean(shortcut.meta);
  const expectCtrl =
    shortcut.mod !== undefined
      ? shortcut.mod
        ? !isMac()
        : false
      : Boolean(shortcut.ctrl);
  if (event.metaKey !== expectMeta) return false;
  if (event.ctrlKey !== expectCtrl) return false;
  if (event.shiftKey !== Boolean(shortcut.shift)) return false;
  if (event.altKey !== Boolean(shortcut.alt)) return false;
  return true;
};

/**
 * Listen for a keyboard shortcut and invoke a callback when it fires. Use the
 * `mod` field for cross-platform shortcuts: `mod: true` matches ⌘ on macOS and
 * Ctrl elsewhere — the conventional pairing for app-level commands.
 *
 * Pass a `sequence` instead of `key` for Vim/Linear-style multi-key shortcuts
 * like `g i` to "go to inbox".
 *
 * @example
 * ```
 * useKeyboardShortcut({ key: 'k', mod: true }, () => setOpen(true));
 * useKeyboardShortcut({ sequence: ['g', 'i'] }, () => navigate('/inbox'));
 * ```
 */
export const useKeyboardShortcut = (
  shortcut: KeyboardShortcut,
  callback: (event: KeyboardEvent) => void,
  options: UseKeyboardShortcutOptions = {}
) => {
  const {
    enabled = true,
    preventDefault = true,
    target,
    sequenceTimeout = DEFAULT_SEQUENCE_TIMEOUT,
  } = options;
  const shortcutRef = useRef(shortcut);
  shortcutRef.current = shortcut;
  const stableCallback = useStableCallback(callback);

  useEffect(() => {
    if (!enabled) return;
    const element: EventTarget | null =
      target ?? (typeof document !== 'undefined' ? document : null);
    if (!element) return;

    let position = 0;
    let resetTimer: ReturnType<typeof setTimeout> | null = null;

    const reset = () => {
      position = 0;
      if (resetTimer) {
        clearTimeout(resetTimer);
        resetTimer = null;
      }
    };

    const handler = (event: Event) => {
      const keyEvent = event as KeyboardEvent;
      const current = shortcutRef.current;

      if (isSequence(current)) {
        // Sequences shouldn't fire while the user is typing or holding any
        // modifier — almost always something else is intended.
        if (isTypingTarget(keyEvent.target)) return;
        if (keyEvent.metaKey || keyEvent.ctrlKey || keyEvent.altKey) {
          reset();
          return;
        }

        const expected = current.sequence[position];
        if (keyEvent.key.toLowerCase() !== expected.toLowerCase()) {
          reset();
          return;
        }

        position++;
        if (resetTimer) clearTimeout(resetTimer);

        if (position === current.sequence.length) {
          if (preventDefault) keyEvent.preventDefault();
          stableCallback(keyEvent);
          reset();
        } else {
          resetTimer = setTimeout(reset, sequenceTimeout);
        }
        return;
      }

      if (!matches(keyEvent, current)) return;
      if (preventDefault) keyEvent.preventDefault();
      stableCallback(keyEvent);
    };

    element.addEventListener('keydown', handler);
    return () => {
      element.removeEventListener('keydown', handler);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [enabled, preventDefault, target, sequenceTimeout, stableCallback]);
};
