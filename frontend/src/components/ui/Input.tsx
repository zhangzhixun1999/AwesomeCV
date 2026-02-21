import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, hint, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-primary mb-1"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          className={cn(
            'w-full px-3 py-2 text-sm bg-background-body border border-border-medium rounded-md',
            'text-text-primary placeholder-text-tertiary',
            'transition-all duration-150',
            'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-danger focus:border-danger focus:ring-danger/10',
            className
          )}
          ref={ref}
          {...props}
        />
        {hint && !error && (
          <p className="mt-1 text-xs text-text-tertiary">{hint}</p>
        )}
        {error && (
          <p className="mt-1 text-xs text-danger">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
