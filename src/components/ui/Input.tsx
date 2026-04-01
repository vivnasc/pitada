"use client";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-charcoal mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full px-3.5 py-2.5 rounded-lg border border-surface-tertiary bg-surface text-charcoal placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-charcoal/10 focus:border-charcoal transition-colors font-body text-sm ${error ? "border-rose focus:ring-rose/20 focus:border-rose" : ""} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-rose">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
export default Input;
