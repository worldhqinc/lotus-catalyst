import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';
import { ComponentPropsWithoutRef } from 'react';

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger' | 'link';
  size?: 'large' | 'medium' | 'small' | 'x-small' | 'link';
  shape?: 'pill' | 'rounded' | 'square' | 'circle' | 'link';
  loading?: boolean;
}

// eslint-disable-next-line valid-jsdoc
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
export function Button({
  variant = 'primary',
  size = 'large',
  shape = 'rounded',
  loading = false,
  type = 'button',
  disabled = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      aria-busy={loading}
      className={clsx(
        'relative z-0 inline-flex h-fit select-none items-center justify-center overflow-hidden border text-center font-[family-name:var(--button-font-family,var(--font-family-body))] leading-normal after:absolute after:inset-0 after:-z-10 after:-translate-x-[110%] after:scale-110 after:transition-[opacity,transform] after:duration-300 after:[animation-timing-function:cubic-bezier(0.25,0.46,0.45,0.94)] focus-visible:outline-none',
        {
          primary:
            'border-[var(--button-primary-border,hsl(var(--primary)))] bg-[var(--button-primary-background,hsl(var(--primary)))] text-[var(--button-primary-text,hsl(var(--background)))] after:bg-primary-highlight focus-visible:border-primary disabled:border-disabled disabled:bg-disabled',
          secondary:
            'border-[var(--button-secondary-border,hsl(var(--foreground)))] bg-[var(--button-secondary-background,hsl(var(--foreground)))] text-[var(--button-secondary-text,hsl(var(--background)))] after:bg-[var(--button-secondary-background-hover,hsl(var(--background)))] hover:text-foreground focus-visible:border-primary disabled:border-disabled-secondary disabled:bg-disabled-secondary disabled:text-white',
          tertiary:
            'border-[var(--button-tertiary-border,hsl(var(--contrast-200)))] bg-[var(--button-tertiary-background,hsl(var(--background)))] text-[var(--button-tertiary-text,hsl(var(--foreground)))] after:bg-[var(--button-tertiary-background-hover,hsl(var(--contrast-100)))] focus-visible:border-primary disabled:border-contrast-100 disabled:text-contrast-200',
          ghost:
            'border-[var(--button-ghost-border,transparent)] bg-[var(--button-ghost-background,transparent)] text-[var(--button-ghost-text,hsl(var(--foreground)))] after:bg-contrast-100 hover:border-contrast-100 focus-visible:border-primary disabled:border-transparent disabled:text-contrast-200',
          danger:
            'border-[var(--button-danger-border,color-mix(in_oklab,hsl(var(--error)),white_30%))] bg-[var(--button-danger-background,color-mix(in_oklab,hsl(var(--error)),white_30%))] text-[var(--button-danger-foreground)] after:bg-[var(--button-danger-background-hover,color-mix(in_oklab,hsl(var(--error)),white_75%))]',
          link: 'border-none bg-transparent transition-colors duration-200 ease-quad after:hidden hover:text-primary',
        }[variant],
        {
          pill: 'rounded-full after:rounded-full',
          rounded: 'rounded-md after:rounded-md',
          square: 'rounded-none after:rounded-none',
          circle: 'rounded-full after:rounded-full',
          link: 'rounded-none after:rounded-none',
        }[shape],
        !loading && !disabled && 'hover:after:translate-x-0',
        disabled && 'cursor-not-allowed',
        variant !== 'link' ? 'font-semibold' : 'font-normal',
        className,
      )}
      disabled={disabled || loading}
      type={type}
    >
      <span
        className={clsx(
          'inline-flex items-center justify-center transition-all duration-300 ease-quad',
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
          'absolute inset-0 grid place-content-center transition-all duration-300 ease-quad',
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
}
