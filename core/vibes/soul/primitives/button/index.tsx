import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';
import { ComponentPropsWithoutRef, forwardRef } from 'react';

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger' | 'link';
  size?: 'large' | 'medium' | 'small' | 'x-small' | 'link';
  shape?: 'pill' | 'rounded' | 'square' | 'circle' | 'link';
  loading?: boolean;
}

/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --button-focus: hsl(var(--primary));
 *   --button-font-family: var(--font-family-body);
 *   --button-primary-background: hsl(var(--primary));
 *   --button-primary-background-hover: color-mix(in oklab, hsl(var(--primary)), white 75%);
 *   --button-primary-text: hsl(var(--foreground));
 *   --button-primary-border: hsl(var(--primary));
 *   --button-secondary-background: hsl(var(--foreground));
 *   --button-secondary-background-hover: hsl(var(--background));
 *   --button-secondary-text: hsl(var(--background));
 *   --button-secondary-border: hsl(var(--foreground));
 *   --button-tertiary-background: hsl(var(--background));
 *   --button-tertiary-background-hover: hsl(var(--contrast-100));
 *   --button-tertiary-text: hsl(var(--foreground));
 *   --button-tertiary-border: hsl(var(--contrast-200));
 *   --button-ghost-background: transparent;
 *   --button-ghost-background-hover: hsl(var(--foreground) / 5%);
 *   --button-ghost-text: hsl(var(--foreground));
 *   --button-ghost-border: transparent;
 *   --button-loader-icon: hsl(var(--foreground));
 *   --button-danger-background: color-mix(in oklab, hsl(var(--error)), white 30%);
 *   --button-danger-background-hover: color-mix(in oklab, hsl(var(--error)), white 75%);
 *   --button-danger-foreground: hsl(var(--foreground));
 *   --button-danger-border: color-mix(in oklab, hsl(var(--error)), white 30%);
 * }
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'large',
      shape = 'rounded',
      loading = false,
      type = 'button',
      disabled = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        {...props}
        aria-busy={loading}
        className={clsx(
          'relative z-0 inline-flex h-fit items-center justify-center overflow-hidden border text-center font-[family-name:var(--button-font-family,var(--font-family-body))] leading-normal transition-all duration-200 select-none focus-visible:outline-none',
          {
            primary:
              'hover:bg-primary-highlight focus-visible:ring-primary disabled:border-disabled disabled:bg-disabled border-[var(--button-primary-border,hsl(var(--primary)))] bg-[var(--button-primary-background,hsl(var(--primary)))] text-[var(--button-primary-text,hsl(var(--background)))] focus-visible:ring-2 focus-visible:ring-offset-2',
            secondary:
              'hover:text-foreground focus-visible:ring-primary disabled:border-disabled-secondary disabled:bg-disabled-secondary border-[var(--button-secondary-border,hsl(var(--foreground)))] bg-[var(--button-secondary-background,hsl(var(--foreground)))] text-[var(--button-secondary-text,hsl(var(--background)))] hover:bg-[var(--button-secondary-background-hover,hsl(var(--background)))] focus-visible:ring-2 focus-visible:ring-offset-2 disabled:text-white',
            tertiary:
              'focus-visible:ring-primary disabled:border-contrast-100 disabled:text-contrast-200 border-[var(--button-tertiary-border,hsl(var(--contrast-200)))] bg-[var(--button-tertiary-background,hsl(var(--background)))] text-[var(--button-tertiary-text,hsl(var(--foreground)))] hover:bg-[var(--button-tertiary-background-hover,hsl(var(--contrast-100)))] focus-visible:ring-2 focus-visible:ring-offset-2',
            ghost:
              'hover:border-contrast-100 focus-visible:ring-primary disabled:text-contrast-200 border-[var(--button-ghost-border,transparent)] bg-[var(--button-ghost-background,transparent)] text-[var(--button-ghost-text,hsl(var(--foreground)))] hover:bg-[var(--button-ghost-background-hover,hsl(var(--foreground)/5%))] focus-visible:ring-2 focus-visible:ring-offset-2 disabled:border-transparent',
            danger:
              'focus-visible:ring-error border-[var(--button-danger-border,color-mix(in_oklab,hsl(var(--error)),white_30%))] bg-[var(--button-danger-background,color-mix(in_oklab,hsl(var(--error)),white_30%))] text-[var(--button-danger-foreground)] hover:bg-[var(--button-danger-background-hover,color-mix(in_oklab,hsl(var(--error)),white_75%))] focus-visible:ring-2 focus-visible:ring-offset-2',
            link: 'hover:text-primary border-none bg-transparent transition-colors duration-200 focus-visible:underline',
          }[variant],
          {
            pill: 'rounded-full',
            rounded: 'rounded-md',
            square: 'rounded-none',
            circle: 'rounded-full',
            link: 'rounded-none',
          }[shape],
          disabled && 'cursor-not-allowed',
          variant !== 'link' ? 'font-medium' : 'font-normal',
          className,
        )}
        disabled={disabled || loading}
        ref={ref}
        type={type}
      >
        <span
          className={clsx(
            'ease-quad inline-flex items-center justify-center transition-all duration-300',
            loading ? '-translate-y-10 opacity-0' : 'translate-y-0 opacity-100',
            shape === 'circle' && 'aspect-square',
            {
              'x-small': 'min-h-8 text-xs',
              small: 'min-h-10 text-sm',
              medium: 'min-h-12 text-base',
              large: 'min-h-14 text-base',
              link: 'min-h-0 text-base',
            }[size],
            shape !== 'circle' &&
              {
                'x-small': 'gap-x-2 px-3 py-1.5',
                small: 'gap-x-2 px-4 py-2.5',
                medium: 'gap-x-2.5 px-5 py-3',
                large: 'gap-x-3 px-6 py-4',
                link: 'gap-x-2 px-0 py-0',
              }[size],
          )}
        >
          {children}
        </span>
        <span
          className={clsx(
            'ease-quad absolute inset-0 grid place-content-center transition-all duration-300',
            loading ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0',
          )}
        >
          <Loader2
            className={clsx(
              'animate-spin',
              variant === 'tertiary' && 'text-[var(--button-loader-icon,hsl(var(--foreground)))]',
            )}
          />
        </span>
      </button>
    );
  },
);
