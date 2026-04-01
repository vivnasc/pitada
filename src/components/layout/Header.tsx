"use client";
import { useRouter } from "next/navigation";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export default function Header({ title, showBack, rightAction }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur-md border-b border-surface-tertiary">
      <div className="max-w-app mx-auto flex items-center h-14 px-5">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="mr-3 p-1.5 -ml-1.5 rounded-lg text-charcoal hover:bg-surface-secondary active:scale-95 transition-all"
            aria-label="Voltar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <h1 className="flex-1 text-lg font-semibold text-charcoal truncate">{title}</h1>
        {rightAction && <div className="ml-2">{rightAction}</div>}
      </div>
    </header>
  );
}
