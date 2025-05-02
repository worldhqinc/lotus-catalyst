import { clsx } from 'clsx';
import { CircleAlert } from 'lucide-react';

// eslint-disable-next-line valid-jsdoc
/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 *  :root {
 *    --field-error: hsl(var(--error));
 *  }
 * ```
 */
export function FieldError({
  className,
  children,
  ...rest
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...rest}
      className={clsx(
        'text-error-shadow flex items-center gap-1 rounded-xl bg-[var(--form-status-light-background-error,color-mix(in_oklab,hsl(var(--error)),white_75%))] px-4 py-3 text-xs',
        className,
      )}
    >
      <CircleAlert size={20} strokeWidth={1.5} />

      {children}
    </div>
  );
}
