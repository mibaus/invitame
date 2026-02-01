'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface LuxuryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const LuxuryButton = forwardRef<HTMLButtonElement, LuxuryButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary:
        'bg-gradient-to-r from-gold-500 to-gold-600 text-black hover:from-gold-400 hover:to-gold-500 focus:ring-gold-500 shadow-lg hover:shadow-xl',
      secondary:
        'bg-charcoal-800 text-cream-100 hover:bg-charcoal-700 focus:ring-charcoal-500 border border-gold-500/20',
      outline:
        'border-2 border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-black focus:ring-gold-500',
      ghost:
        'text-gold-500 hover:bg-gold-500/10 focus:ring-gold-500',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm rounded-md gap-1.5',
      md: 'px-6 py-3 text-base rounded-lg gap-2',
      lg: 'px-8 py-4 text-lg rounded-xl gap-2.5',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <>
            {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
            {children}
            {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
          </>
        )}
      </button>
    );
  }
);

LuxuryButton.displayName = 'LuxuryButton';
