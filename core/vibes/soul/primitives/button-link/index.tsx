import { clsx } from 'clsx';

import { Link } from '~/components/link';

export type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'link';
  size?: 'large' | 'medium' | 'small' | 'x-small' | 'link';
  shape?: 'pill' | 'rounded' | 'square' | 'circle' | 'link';
  href: string;
};

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
 *   --button-primary-foreground: hsl(var(--foreground));
 *   --button-primary-border: hsl(var(--primary));
 *   --button-secondary-background: hsl(var(--foreground));
 *   --button-secondary-background-hover: hsl(var(--background));
 *   --button-secondary-foreground: hsl(var(--background));
 *   --button-secondary-border: hsl(var(--foreground));
 *   --button-tertiary-background: hsl(var(--background));
 *   --button-tertiary-background-hover: hsl(var(--contrast-100));
 *   --button-tertiary-foreground: hsl(var(--foreground));
 *   --button-tertiary-border: hsl(var(--contrast-200));
 *   --button-ghost-background: transparent;
 *   --button-ghost-background-hover: hsl(var(--foreground) / 5%);
 *   --button-ghost-foreground: hsl(var(--foreground));
 *   --button-ghost-border: transparent;
 * }
 * ```
 */
export function ButtonLink({
  variant = 'primary',
  size = 'large',
  shape = 'rounded',
  href,
  className,
  children,
  ...props
}: Props) {
  return (
    <Link
      {...props}
      className={clsx(
        'relative z-0 inline-flex h-fit items-center justify-center overflow-hidden border text-center font-[family-name:var(--button-font-family,var(--font-family-body))] leading-normal font-medium transition-all duration-200 select-none focus-visible:outline-none',
        {
          primary:
            'hover:bg-primary-highlight focus-visible:ring-primary disabled:border-disabled disabled:bg-disabled border-[var(--button-primary-border,hsl(var(--primary)))] bg-[var(--button-primary-background,hsl(var(--primary)))] text-[var(--button-primary-text,hsl(var(--background)))] focus-visible:ring-2 focus-visible:ring-offset-2',
          secondary:
            'hover:text-foreground focus-visible:ring-primary disabled:border-disabled-secondary disabled:bg-disabled-secondary border-[var(--button-secondary-border,hsl(var(--foreground)))] bg-[var(--button-secondary-background,hsl(var(--foreground)))] text-[var(--button-secondary-text,hsl(var(--background)))] hover:bg-[var(--button-secondary-background-hover,hsl(var(--background)))] focus-visible:ring-2 focus-visible:ring-offset-2 disabled:text-white',
          tertiary:
            'focus-visible:ring-primary disabled:border-contrast-100 disabled:text-contrast-200 border-[var(--button-tertiary-border,hsl(var(--contrast-200)))] bg-[var(--button-tertiary-background,hsl(var(--background)))] text-[var(--button-tertiary-text,hsl(var(--foreground)))] hover:bg-[var(--button-tertiary-background-hover,hsl(var(--contrast-100)))] focus-visible:ring-2 focus-visible:ring-offset-2',
          ghost:
            'hover:border-contrast-100 focus-visible:ring-primary disabled:text-contrast-200 border-[var(--button-ghost-border,transparent)] bg-[var(--button-ghost-background,transparent)] text-[var(--button-ghost-text,hsl(var(--foreground)))] hover:bg-[var(--button-ghost-background-hover,hsl(var(--foreground)/5%))] focus-visible:ring-2 focus-visible:ring-offset-2 disabled:border-transparent',
          link: 'hover:text-primary border-none bg-transparent transition-colors duration-200 focus-visible:underline',
        }[variant],
        {
          'x-small': 'min-h-8 text-xs',
          small: 'min-h-10 text-sm',
          medium: 'min-h-12 text-base',
          large: 'min-h-14 text-base',
          link: 'rounded-none',
        }[size],
        shape !== 'circle' &&
          {
            'x-small': 'gap-x-2 px-3 py-1.5',
            small: 'gap-x-2 px-4 py-2.5',
            medium: 'gap-x-2.5 px-5 py-3',
            large: 'gap-x-3 px-6 py-4',
            link: 'min-h-0 text-base',
          }[size],
        {
          pill: 'rounded-full',
          rounded: 'rounded-md',
          square: 'rounded-none',
          circle: 'aspect-square rounded-full',
          link: 'min-h-0 text-base',
        }[shape],
        variant !== 'link' ? 'font-medium' : 'font-normal',
        className,
      )}
      href={href}
    >
      <span>{children}</span>
    </Link>
  );
}
