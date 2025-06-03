'use client';

import { clsx } from 'clsx';
import { ForwardedRef, forwardRef, ReactNode } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { Image } from '~/components/image';
import { Link } from '~/components/link';
import BannerBackground from '~/public/images/Lotus-Pattern.svg';

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
      <div
        className={clsx(
          'bg-primary relative isolate overflow-hidden py-2 text-sm text-white',
          className,
        )}
        ref={ref}
      >
        <Image
          alt="Lotus Pattern"
          className="absolute inset-0 top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2"
          height={807}
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          src={BannerBackground}
          width={2560}
        />
        <div className="[&_*::selection]:text-primary @container container flex flex-row items-center justify-between [&_*::selection]:bg-white">
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
                <Link href="/where-to-buy">Where to buy</Link>
              </li>
              <li>
                <div className="flex items-center gap-2">
                  <div className="relative isolate after:absolute after:top-1/2 after:left-1/2 after:z-10 after:h-6 after:w-6 after:-translate-x-1/2 after:-translate-y-1/2">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      height="24"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M12 7C12.5523 7 13 6.55228 13 6C13 5.44772 12.5523 5 12 5C11.4477 5 11 5.44772 11 6C11 6.55228 11.4477 7 12 7Z"
                        fill="#131313"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M9 18L12 12L15 18"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M7 8L12 10L17 8"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M12 10V12"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </svg>
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
