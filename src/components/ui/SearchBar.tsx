"use client";
import { InputHTMLAttributes } from "react";

interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  onClear?: () => void;
}

export default function SearchBar({ value, onClear, className = "", ...props }: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="search"
        value={value}
        className="w-full pl-10 pr-8 py-2.5 rounded-lg border border-surface-tertiary bg-surface-secondary text-charcoal placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-charcoal/10 focus:border-charcoal focus:bg-surface text-sm font-body transition-all"
        {...props}
      />
      {value && onClear && (
        <button
          onClick={onClear}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-charcoal"
          aria-label="Limpar pesquisa"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
