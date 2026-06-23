import { FC } from 'react';

interface ErrorMessageProps {
  title: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: FC<ErrorMessageProps> = ({ title, message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-[var(--ds-px)] py-24">
      <div className="w-full max-w-lg border border-[var(--ds-border)] bg-[oklch(8.5%_0.005_27_/_0.6)] backdrop-blur-xl relative">

        {/* Corner accents */}
        <span className="absolute top-0 left-0 w-5 h-5 border-t border-l border-[var(--ds-accent)] -translate-x-px -translate-y-px" />
        <span className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-[var(--ds-accent)] translate-x-px translate-y-px" />

        <div className="p-8">
          {/* Eyebrow */}
          <p className="ds-eyebrow mb-6">System error</p>

          {/* Title */}
          <h2
            style={{ fontFamily: "var(--font-widock, sans-serif)" }}
            className="font-extrabold text-4xl tracking-tight uppercase leading-none text-[var(--ds-text)] mb-4"
          >
            {title}
          </h2>

          {/* Message */}
          <p
            style={{ fontFamily: "var(--font-jetbrains-mono, 'JetBrains Mono', monospace)" }}
            className="text-xs leading-relaxed tracking-wide text-[var(--ds-text-2)] mb-8"
          >
            {message}
          </p>

          {onRetry && (
            <button
              onClick={onRetry}
              className="group relative inline-flex items-center gap-3 border border-[var(--ds-accent)] px-5 py-2.5 text-[var(--ds-text)] transition-colors duration-200 hover:bg-[var(--ds-accent-dim)]"
              style={{ fontFamily: "var(--font-jetbrains-mono, 'JetBrains Mono', monospace)" }}
            >
              <span className="text-[0.6rem] tracking-[0.18em] uppercase">Попробовать снова</span>
              <span className="text-[var(--ds-accent)] transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
