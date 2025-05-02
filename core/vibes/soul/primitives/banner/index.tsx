'use client';

import { clsx } from 'clsx';
import { PersonStandingIcon } from 'lucide-react';
import { ForwardedRef, forwardRef, ReactNode } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { Link } from '~/components/link';

import { LocaleSwitcher } from '../navigation';

/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --banner-focus: hsl(var(--primary));
 *   --banner-background: hsl(var(--primary));
 *   --banner-text: hdl(var(--foreground));
 *   --banner-close-icon: hdl(var(--foreground));
 *   --banner-close-icon-hover: hdl(var(--foreground));
 *   --banner-close-background: hdl(var(--foreground));
 *   --banner-close-background-hover: hdl(var(--foreground));
 * }
 * ```
 */

interface Locale {
  id: string;
  label: string;
}

export const Banner = forwardRef(
  (
    {
      activeLocaleId = '',
      children: streamableChildren,
      className,
      locales = [],
    }: {
      activeLocaleId?: string;
      children: Streamable<ReactNode>;
      className?: string;
      locales?: Locale[];
    },
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    return (
      <div className={clsx('bg-primary py-4 text-white', className)} ref={ref}>
        <div className="@container container flex flex-row items-center justify-between">
          <div>
            <Stream
              fallback={<p className="bg-contrast-100 block h-4 w-20 animate-pulse rounded-md" />}
              value={streamableChildren}
            >
              {(children) => children}
            </Stream>
          </div>
          <div>
            <ul className="flex flex-row items-center justify-between gap-6">
              <li className="hidden @4xl:block">
                <Link href="/shop-in-store">Shop In-Store</Link>
              </li>
              <li>
                <div className="flex items-center gap-2">
                  <div className="rounded-full border-2 border-white">
                    <PersonStandingIcon size={22} strokeWidth={2} />
                  </div>
                  <p className="hidden @4xl:block">Accessibility</p>
                </div>
              </li>
              <li className="hidden @4xl:block">
                {locales.length > 1 ? (
                  <LocaleSwitcher
                    activeLocaleId={activeLocaleId}
                    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                    locales={locales as [Locale, ...Locale[]]}
                  />
                ) : null}
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  },
);

Banner.displayName = 'Banner';
