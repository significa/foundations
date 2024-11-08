import { useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/tailwind';

type CopyToClipboardProps = React.HTMLAttributes<HTMLButtonElement> & {
  value: string;
};

// Taken from nextra:
// https://github.com/shuding/nextra/blob/main/packages/nextra/src/client/components/copy-to-clipboard.tsx
export function CopyToClipboard({ value, className }: CopyToClipboardProps) {
  const [isCopied, setIsCopied] = useState(false);

  const onClick = useCallback(async () => {
    setIsCopied(true);

    if (!navigator?.clipboard) {
      console.error('Access to clipboard rejected!');
    }
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      console.error('Failed to copy!');
    }
  }, [value]);

  useEffect(() => {
    if (!isCopied) return;

    const timerId = setTimeout(() => {
      setIsCopied(false);
    }, 2000);

    return () => {
      clearTimeout(timerId);
    };
  }, [isCopied]);

  return (
    <button
      onClick={onClick}
      className={cn(
        'nextra-button nx-transition-all active:nx-opacity-50 nx-bg-primary-700/5 nx-border nx-border-black/5 nx-text-gray-600 hover:nx-text-gray-900 nx-rounded-md nx-p-1.5 dark:nx-bg-primary-300/10 dark:nx-border-white/10 dark:nx-text-gray-400 dark:hover:nx-text-gray-50',
        className
      )}
      title="Copy code"
      tabIndex={0}
    >
      {isCopied && (
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          className="nextra-copy-icon nx-pointer-events-none nx-h-4 nx-w-4"
        >
          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
        </svg>
      )}
      {!isCopied && (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          stroke="currentColor"
          className="nextra-copy-icon nx-pointer-events-none nx-h-4 nx-w-4"
        >
          <rect
            x="9"
            y="9"
            width="13"
            height="13"
            rx="2"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></rect>
          <path
            d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      )}
    </button>
  );
}
