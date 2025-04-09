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
        'after:ease-quad relative z-0 inline-flex h-fit items-center justify-center overflow-hidden border text-center font-[family-name:var(--button-font-family,var(--font-family-body))] leading-normal font-semibold select-none after:absolute after:inset-0 after:-z-10 after:-translate-x-[110%] after:scale-110 after:transition-transform after:duration-300 hover:after:translate-x-0 focus-visible:outline-none',
        {
          primary:
            'after:bg-primary-highlight focus-visible:border-primary disabled:border-disabled disabled:bg-disabled border-[var(--button-primary-border,hsl(var(--primary)))] bg-[var(--button-primary-background,hsl(var(--primary)))] text-[var(--button-primary-text,hsl(var(--background)))]',
          secondary:
            'hover:text-foreground focus-visible:border-primary disabled:border-disabled-secondary disabled:bg-disabled-secondary border-[var(--button-secondary-border,hsl(var(--foreground)))] bg-[var(--button-secondary-background,hsl(var(--foreground)))] text-[var(--button-secondary-text,hsl(var(--background)))] after:bg-[var(--button-secondary-background-hover,hsl(var(--background)))] disabled:text-white',
          tertiary:
            'focus-visible:border-primary disabled:border-contrast-100 disabled:text-contrast-200 border-[var(--button-tertiary-border,hsl(var(--contrast-200)))] bg-[var(--button-tertiary-background,hsl(var(--background)))] text-[var(--button-tertiary-text,hsl(var(--foreground)))] after:bg-[var(--button-tertiary-background-hover,hsl(var(--contrast-100)))]',
          ghost:
            'after:bg-contrast-100 hover:border-contrast-100 focus-visible:border-primary disabled:text-contrast-200 border-[var(--button-ghost-border,transparent)] bg-[var(--button-ghost-background,transparent)] text-[var(--button-ghost-text,hsl(var(--foreground)))] disabled:border-transparent',
          link: 'ease-quad hover:text-primary border-none bg-transparent transition-colors duration-200 after:hidden',
        }[variant],
        {
          'x-small': 'min-h-8 text-xs',
          small: 'min-h-10 text-sm',
          medium: 'min-h-12 text-base',
          large: 'min-h-14 text-base',
          link: 'rounded-none after:rounded-none',
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
          pill: 'rounded-full after:rounded-full',
          rounded: 'rounded-md after:rounded-md',
          square: 'rounded-none after:rounded-none',
          circle: 'aspect-square rounded-full after:rounded-full',
          link: 'min-h-0 text-base',
        }[shape],
        variant !== 'link' ? 'font-semibold' : 'font-normal',
        className,
      )}
      href={href}
    >
      <span>{children}</span>
    </Link>
  );
}
