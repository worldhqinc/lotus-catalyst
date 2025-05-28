'use client';

import { SubmissionResult } from '@conform-to/react';
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import * as Popover from '@radix-ui/react-popover';
import { clsx } from 'clsx';
import { ChevronDown, ChevronRight, Search, ShoppingCart, TriangleAlert, User } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, {
  forwardRef,
  Ref,
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { Badge } from '@/vibes/soul/primitives/badge';
import { Price } from '@/vibes/soul/primitives/price-label';
import * as SidePanel from '@/vibes/soul/primitives/side-panel';
import CookiePreferencesCta from '~/components/cookie-preferences-cta';
import CookiePreferencesNotice from '~/components/cookie-preferences-notice';
import { Image } from '~/components/image';
import { Link } from '~/components/link';
import { Minicart } from '~/components/minicart';
import { CartItem } from '~/components/minicart/_actions/minicart';
import { usePathname, useRouter } from '~/i18n/routing';

import { LogoLotus } from '../logo-lotus';
import { Modal } from '../modal';

interface Link {
  label: string;
  href: string;
  groups?: Array<{
    label?: string;
    href?: string;
    comingSoon?: boolean;
    links: Array<{
      label: string;
      href: string;
    }>;
  }>;
}

interface Locale {
  id: string;
  label: string;
}

interface Currency {
  id: string;
  label: string;
}

type Action<State, Payload> = (
  state: Awaited<State>,
  payload: Awaited<Payload>,
) => State | Promise<State>;

export type SearchResult =
  | {
      type: 'products';
      title: string;
      products: Array<{
        id: string;
        title: string;
        href: string;
        price?: Price;
        image?: { src: string; alt: string };
      }>;
    }
  | {
      type: 'links';
      title: string;
      links: Array<{ label: string; href: string }>;
    };

type CurrencyAction = Action<SubmissionResult | null, FormData>;

interface Props {
  className?: string;
  isFloating?: boolean;
  accountHref: string;
  cartCount?: Streamable<number | null>;
  cartItems?: Streamable<CartItem[]>;
  cartHref: string;
  links: Streamable<Link[]>;
  linksPosition?: 'center' | 'left' | 'right';
  locales?: Locale[];
  activeLocaleId?: string;
  currencies?: Currency[];
  activeCurrencyId?: Streamable<string | undefined>;
  currencyAction?: CurrencyAction;
  logoWidth?: number;
  logoHeight?: number;
  cartLabel?: string;
  accountLabel?: string;
  openSearchPopupLabel?: string;
  mobileMenuTriggerLabel?: string;
}

const MobileMenuButton = forwardRef<
  React.ComponentRef<'button'>,
  { open: boolean } & React.ComponentPropsWithoutRef<'button'>
>(({ open, className, ...rest }, ref) => {
  return (
    <button
      {...rest}
      className={clsx(
        'group relative overflow-hidden rounded-lg p-3 ring-[var(--nav-focus,hsl(var(--primary)))] outline-0 transition-colors focus-visible:ring-2',
        className,
      )}
      ref={ref}
    >
      <div className="flex h-4 w-4 origin-center transform flex-col justify-between overflow-hidden transition-all duration-300">
        <div
          className={clsx(
            'h-px origin-left transform bg-[var(--nav-mobile-button-icon,hsl(var(--foreground)))] transition-all duration-300',
            open ? 'translate-x-10' : 'w-7',
          )}
        />
        <div
          className={clsx(
            'h-px transform rounded bg-[var(--nav-mobile-button-icon,hsl(var(--foreground)))] transition-all delay-75 duration-300',
            open ? 'translate-x-10' : 'w-7',
          )}
        />
        <div
          className={clsx(
            'h-px origin-left transform bg-[var(--nav-mobile-button-icon,hsl(var(--foreground)))] transition-all delay-150 duration-300',
            open ? 'translate-x-10' : 'w-7',
          )}
        />

        <div
          className={clsx(
            'absolute top-5 flex transform items-center justify-between bg-[var(--nav-mobile-button-icon,hsl(var(--foreground)))] transition-all duration-500',
            open ? 'w-12 translate-x-0' : 'w-0 -translate-x-10',
          )}
        >
          <div
            className={clsx(
              'absolute h-px w-4 transform bg-[var(--nav-mobile-button-icon,hsl(var(--foreground)))] transition-all delay-300 duration-500',
              open ? 'rotate-45' : 'rotate-0',
            )}
          />
          <div
            className={clsx(
              'absolute h-px w-4 transform bg-[var(--nav-mobile-button-icon,hsl(var(--foreground)))] transition-all delay-300 duration-500',
              open ? '-rotate-45' : 'rotate-0',
            )}
          />
        </div>
      </div>
    </button>
  );
});

MobileMenuButton.displayName = 'MobileMenuButton';

const navGroupClassName =
  'flex items-center gap-2 text-3xl transition-colors duration-200 ease-quad hover:text-primary';
const navLinkClassName =
  'block text-3xl transition-colors duration-200 ease-quad hover:text-primary';
const navButtonClassName =
  'relative p-3 transition-colors duration-200 ease-quad hover:text-primary focus-visible:outline-0 focus-visible:text-primary';

/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --nav-focus: hsl(var(--primary));
 *   --nav-background: hsl(var(--background));
 *   --nav-floating-border: hsl(var(--foreground) / 10%);
 *   --nav-link-text: hsl(var(--foreground));
 *   --nav-link-text-hover: hsl(var(--foreground));
 *   --nav-link-background: transparent;
 *   --nav-link-background-hover: hsl(var(--contrast-100));
 *   --nav-link-font-family: var(--font-family-body);
 *   --nav-group-text: hsl(var(--foreground));
 *   --nav-group-text-hover: hsl(var(--foreground));
 *   --nav-group-background: transparent;
 *   --nav-group-background-hover: hsl(var(--contrast-100));
 *   --nav-group-font-family: var(--font-family-body);
 *   --nav-sub-link-text: hsl(var(--contrast-500));
 *   --nav-sub-link-text-hover: hsl(var(--foreground));
 *   --nav-sub-link-background: transparent;
 *   --nav-sub-link-background-hover: hsl(var(--contrast-100));
 *   --nav-sub-link-font-family: var(--font-family-body);
 *   --nav-button-icon: hsl(var(--foreground));
 *   --nav-button-icon-hover: hsl(var(--foreground));
 *   --nav-button-background: hsl(var(--background));
 *   --nav-button-background-hover: hsl(var(--contrast-100));
 *   --nav-menu-background: hsl(var(--background));
 *   --nav-menu-border: hsl(var(--foreground) / 5%);
 *   --nav-mobile-background: hsl(var(--background));
 *   --nav-mobile-divider: hsl(var(--contrast-100));
 *   --nav-mobile-button-icon: hsl(var(--foreground));
 *   --nav-mobile-link-text: hsl(var(--foreground));
 *   --nav-mobile-link-text-hover: hsl(var(--foreground));
 *   --nav-mobile-link-background: transparent;
 *   --nav-mobile-link-background-hover: hsl(var(--contrast-100));
 *   --nav-mobile-link-font-family: var(--font-family-body);
 *   --nav-mobile-sub-link-text: hsl(var(--contrast-500));
 *   --nav-mobile-sub-link-text-hover: hsl(var(--foreground));
 *   --nav-mobile-sub-link-background: transparent;
 *   --nav-mobile-sub-link-background-hover: hsl(var(--contrast-100));
 *   --nav-mobile-sub-link-font-family: var(--font-family-body);
 *   --nav-search-background: hsl(var(--background));
 *   --nav-search-border: hsl(var(--foreground) / 5%);
 *   --nav-search-divider: hsl(var(--foreground) / 5%);
 *   --nav-search-icon: hsl(var(--contrast-500));
 *   --nav-search-empty-title: hsl(var(--foreground));
 *   --nav-search-empty-subtitle: hsl(var(--contrast-500));
 *   --nav-search-result-title: hsl(var(--foreground));
 *   --nav-search-result-title-font-family: var(--font-family-mono);
 *   --nav-search-result-link-text: hsl(var(--foreground));
 *   --nav-search-result-link-text-hover: hsl(var(--foreground));
 *   --nav-search-result-link-background: hsl(var(--background));
 *   --nav-search-result-link-background-hover: hsl(var(--contrast-100));
 *   --nav-search-result-link-font-family: var(--font-family-body);
 *   --nav-cart-count-text: hsl(var(--background));
 *   --nav-cart-count-background: hsl(var(--foreground));
 *   --nav-locale-background: hsl(var(--background));
 *   --nav-locale-link-text: hsl(var(--contrast-400));
 *   --nav-locale-link-text-hover: hsl(var(--foreground));
 *   --nav-locale-link-text-selected: hsl(var(--foreground));
 *   --nav-locale-link-background: transparent;
 *   --nav-locale-link-background-hover: hsl(var(--contrast-100));
 *   --nav-locale-link-font-family: var(--font-family-body);
 * }
 * ```
 */

const useSwitchLocale = () => {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();

  return useCallback(
    (locale: string) =>
      router.push(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale },
      ),
    [pathname, params, router],
  );
};

export const LocaleSwitcher = ({
  locales,
  activeLocaleId,
}: {
  activeLocaleId?: string;
  locales: [Locale, ...Locale[]];
}) => {
  // const activeLocale = locales.find((locale) => locale.id === activeLocaleId);
  const [isPending, startTransition] = useTransition();
  const switchLocale = useSwitchLocale();

  function getLocaleLabel(localeId: string | undefined) {
    switch (localeId) {
      case 'en':
        return 'English';
        break;

      case 'fr':
        return 'Français';
        break;

      case 'es':
        return 'Español';
        break;

      default:
        return 'English';
    }
  }

  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <div className="msg-to-opt-out-users" style={{ display: 'none' }}>
        <Modal
          className="min-w-64 @lg:w-lg"
          isOpen={isOpen}
          setOpen={setOpen}
          title="Message to cookie opt out users"
          trigger={
            <button
              className="flex items-center gap-1 p-0 text-sm transition-opacity hover:text-white/70 focus-visible:text-white/70 focus-visible:outline-none disabled:opacity-30"
              type="button"
            >
              English
              <TriangleAlert size={16} strokeWidth={1.5} />
            </button>
          }
        >
          <CookiePreferencesNotice
            message={
              <>
                We use cookies to ensure you get the best experience on our website. Please enable
                "Functional cookies" in your <CookiePreferencesCta variant="link" /> to continue
                with site translations.
              </>
            }
          />
        </Modal>
      </div>
      <div className="locale-switcher">
        <div className="hidden @4xl:inline-block">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger
              className="nav-locale-button flex items-center gap-1 p-0 text-sm transition-opacity hover:text-white/70 focus-visible:text-white/70 focus-visible:outline-none disabled:opacity-30"
              disabled={isPending}
            >
              {getLocaleLabel(activeLocaleId)}
              <ChevronDown size={16} strokeWidth={1.5} />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 z-50 max-h-80 overflow-y-scroll rounded-xl bg-[var(--nav-locale-background,hsl(var(--background)))] p-2 shadow-xl @4xl:w-32 @4xl:rounded-2xl @4xl:p-2"
                sideOffset={16}
              >
                {locales.map(({ id }) => (
                  <DropdownMenu.Item
                    className={clsx(
                      'nav-locale-item cursor-default rounded-lg bg-[var(--nav-locale-link-background,transparent)] px-2.5 py-2 text-sm font-medium text-[var(--nav-locale-link-text,hsl(var(--contrast-400)))] ring-[var(--nav-focus,hsl(var(--primary)))] transition-colors outline-none hover:bg-[var(--nav-locale-link-background-hover,hsl(var(--contrast-100)))] hover:text-[var(--nav-locale-link-text-hover,hsl(var(--foreground)))]',
                      {
                        'text-[var(--nav-locale-link-text-selected,hsl(var(--foreground)))]':
                          id === activeLocaleId,
                      },
                    )}
                    key={id}
                    onSelect={() => startTransition(() => switchLocale(id))}
                  >
                    {getLocaleLabel(id)}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
        <div className="flex flex-row items-center gap-2 @4xl:hidden">
          {locales.map(({ id }) => {
            return (
              <button
                className={clsx(
                  'nav-locale-item rounded-full border px-3 py-2 text-base font-medium',
                  id === activeLocaleId
                    ? 'bg-contrast-100 border-contrast-100 text-foreground'
                    : 'border-contrast-200 text-contrast-400 bg-transparent',
                )}
                key={id}
                onClick={() => startTransition(() => switchLocale(id))}
                type="button"
              >
                {getLocaleLabel(id)}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export const Navigation = forwardRef(function Navigation(
  {
    className,
    isFloating = false,
    cartHref,
    cartCount: streamableCartCount,
    cartItems: streamableCartItems,
    accountHref,
    links: streamableLinks,
    logoWidth = 120,
    logoHeight = 40,
    linksPosition = 'center',
    locales,
    activeLocaleId,
    currencies: streamableCurrencies,
    activeCurrencyId: streamableActiveCurrencyId,
    currencyAction,
    cartLabel = 'Cart',
    accountLabel = 'Profile',
    mobileMenuTriggerLabel = 'Toggle navigation',
  }: Props,
  ref: Ref<HTMLDivElement>,
) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMinicartDrawerOpen, setIsMinicartDrawerOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMinicartDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen || isMinicartDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, isMinicartDrawerOpen]);

  useEffect(() => {
    function handleScroll() {
      setIsMobileMenuOpen(false);
    }

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const prevCartCountRef = useRef<number | null | undefined>(undefined);

  useEffect(() => {
    void (async () => {
      const resolvedCartCount = await streamableCartCount;
      const newCount = resolvedCartCount ?? 0;
      const oldCount = prevCartCountRef.current ?? 0;

      if (
        prevCartCountRef.current !== undefined &&
        newCount > oldCount &&
        pathname.replace(/\/$/, '') !== cartHref.replace(/\/$/, '')
      ) {
        setIsMinicartDrawerOpen(true);
      } else if (newCount === 0) {
        setIsMinicartDrawerOpen(false);
      }

      prevCartCountRef.current = resolvedCartCount ?? 0;
    })();
  }, [streamableCartCount, pathname, cartHref]);

  return (
    <NavigationMenu.Root
      className={clsx(
        'font-body border-contrast-100 @container relative w-full border-b bg-white',
        className,
      )}
      delayDuration={0}
      ref={ref}
    >
      <div className="container flex items-center justify-between gap-1 bg-[var(--nav-background,hsl(var(--background)))] py-2">
        {/* Logo */}
        <div
          className={clsx(
            'flex items-center justify-start self-stretch',
            linksPosition === 'center' ? 'flex-1' : 'flex-1 @4xl:flex-none',
          )}
        >
          <LogoLotus height={logoHeight} type="full" width={logoWidth} />
        </div>
        {/* Top Level Nav Links */}
        <ul
          className={clsx(
            'hidden gap-[1.875rem] @4xl:flex @4xl:flex-1',
            {
              left: '@4xl:justify-start',
              center: '@4xl:justify-center',
              right: '@4xl:justify-end',
            }[linksPosition],
          )}
        >
          <Stream
            fallback={
              <ul className="flex animate-pulse flex-row @4xl:gap-6 @4xl:p-2.5">
                <li>
                  <span className="bg-contrast-100 block h-4 w-10 rounded-md" />
                </li>
                <li>
                  <span className="bg-contrast-100 block h-4 w-14 rounded-md" />
                </li>
                <li>
                  <span className="bg-contrast-100 block h-4 w-24 rounded-md" />
                </li>
                <li>
                  <span className="bg-contrast-100 block h-4 w-16 rounded-md" />
                </li>
              </ul>
            }
            value={streamableLinks}
          >
            {(links) =>
              links.map((item, i) => (
                <NavigationMenu.Item key={i} value={i.toString()}>
                  {item.groups != null && item.groups.length > 0 ? (
                    <NavigationMenu.Trigger
                      asChild
                      onPointerEnter={(event) => event.preventDefault()}
                      onPointerLeave={(event) => event.preventDefault()}
                      onPointerMove={(event) => event.preventDefault()}
                    >
                      <button
                        className={clsx(
                          '@4xl:after:ease-quad hover:@4xl:after:bg-border hidden after:hover:scale-x-100 hover:after:scale-x-100 data-[state=open]:after:scale-x-100 @4xl:relative @4xl:inline-flex @4xl:px-0 @4xl:uppercase @4xl:after:absolute @4xl:after:top-full @4xl:after:left-0 @4xl:after:h-0.5 @4xl:after:w-full @4xl:after:origin-left @4xl:after:transition-transform @4xl:after:duration-200',
                          pathname.includes('/shop/')
                            ? '@4xl:after:bg-primary @4xl:after:scale-x-100'
                            : 'after:scale-x-0 @4xl:after:bg-transparent',
                        )}
                      >
                        {item.label}
                      </button>
                    </NavigationMenu.Trigger>
                  ) : (
                    <Link
                      className={clsx(
                        '@4xl:after:ease-quad hover:@4xl:after:bg-border text-nowrap after:hover:scale-x-100 hover:after:scale-x-100 data-[state=open]:after:scale-x-100 @4xl:relative @4xl:inline-flex @4xl:px-0 @4xl:tracking-widest @4xl:uppercase @4xl:after:absolute @4xl:after:top-full @4xl:after:left-0 @4xl:after:h-0.5 @4xl:after:w-full @4xl:after:origin-left @4xl:after:transition-transform @4xl:after:duration-200',
                        pathname === item.href || pathname === `${item.href}/`
                          ? '@4xl:after:bg-primary @4xl:hover:after:!bg-primary @4xl:after:scale-x-100'
                          : 'after:scale-x-0 @4xl:after:bg-transparent',
                      )}
                      href={item.href}
                    >
                      {item.label}
                    </Link>
                  )}
                  {item.groups != null && item.groups.length > 0 && (
                    <NavigationMenu.Content
                      className="bg-[var(--nav-menu-background,hsl(var(--background)))]"
                      onPointerEnter={(event) => event.preventDefault()}
                      onPointerLeave={(event) => event.preventDefault()}
                    >
                      <div className="container m-auto grid grid-cols-2 justify-center gap-8 py-16 xl:grid-cols-3">
                        <div className="flex flex-col items-start gap-6">
                          {item.groups.map((group, columnIndex) => (
                            <ul className="flex flex-col gap-6" key={columnIndex}>
                              {/* Second Level Links */}
                              {group.label != null && group.label !== '' && (
                                <li>
                                  {group.href != null && group.href !== '' && !group.comingSoon ? (
                                    <NavigationMenu.Link
                                      className={navGroupClassName}
                                      href={group.href}
                                    >
                                      {group.label}
                                    </NavigationMenu.Link>
                                  ) : (
                                    <span
                                      className={clsx(
                                        navGroupClassName,
                                        'cursor-not-allowed text-neutral-400 hover:!text-neutral-400',
                                      )}
                                    >
                                      {group.label}
                                      {group.comingSoon && (
                                        <Badge shape="rounded" variant="primary">
                                          Coming Soon
                                        </Badge>
                                      )}
                                    </span>
                                  )}
                                </li>
                              )}
                              {group.links.map((link, idx) => (
                                // Third Level Links
                                <li key={idx}>
                                  <NavigationMenu.Link
                                    className={navLinkClassName}
                                    href={link.href}
                                  >
                                    {link.label}
                                  </NavigationMenu.Link>
                                </li>
                              ))}
                            </ul>
                          ))}
                          <div className="mt-8 flex flex-col items-start">
                            <NavigationMenu.Link className="link text-primary" href="/shop/all">
                              Shop all products
                            </NavigationMenu.Link>
                          </div>
                        </div>
                        <div className="col-start-2 xl:col-start-3">
                          <NavigationMenu.Link
                            className="group w-full"
                            href="/shop/professional-series"
                          >
                            <div className="flex h-full flex-col">
                              <figure className="bg-surface-image aspect-[19/6] h-full min-h-[246px] w-full overflow-hidden rounded-lg">
                                <Image
                                  alt="Explore Lotus Professional Series"
                                  className="h-full w-full object-cover"
                                  height={246}
                                  src="https://images.ctfassets.net/esj3sw7u4uve/6qen7gqAvmEaKF2fusTjCF/9240e8a5fadb8fa961dc221295f49e1d/LTSCM500-LTSTR502-Mixed-Use-Group-Horiontal-Wide-Talent-V2.webp"
                                  width={369}
                                />
                              </figure>
                              <span className="ease-quad group-hover:text-primary py-2 font-medium transition-colors duration-200">
                                Explore the Professional Series
                              </span>
                            </div>
                          </NavigationMenu.Link>
                        </div>
                      </div>
                    </NavigationMenu.Content>
                  )}
                </NavigationMenu.Item>
              ))
            }
          </Stream>
        </ul>
        {/* Icon Buttons */}
        <div
          className={clsx(
            'flex items-center justify-end transition-colors duration-300',
            linksPosition === 'center' ? 'flex-1' : 'flex-1 @4xl:flex-none',
          )}
        >
          <Link aria-label="Search" className={navButtonClassName} href="/search">
            <Search size={24} strokeWidth={1} />
          </Link>
          <Link
            aria-label={accountLabel}
            className={clsx(navButtonClassName, 'hidden @4xl:inline-block')}
            href={accountHref}
          >
            <User size={24} strokeWidth={1} />
          </Link>
          <Link aria-label={cartLabel} className={navButtonClassName} href={cartHref}>
            <ShoppingCart size={24} strokeWidth={1} />
            <Stream
              fallback={
                <span className="bg-contrast-100 text-background absolute top-1 right-1 flex h-4 w-4 animate-pulse items-center justify-center rounded-full text-xs" />
              }
              value={streamableCartCount}
            >
              {(currentDisplayCount) =>
                currentDisplayCount != null &&
                currentDisplayCount > 0 && (
                  <span
                    className={clsx(
                      'bg-primary absolute flex items-center justify-center rounded-full border border-white text-xs text-white',
                      currentDisplayCount > 9 ? 'top-0 right-0 h-6 w-6' : 'top-1 right-1 h-5 w-5',
                    )}
                  >
                    {currentDisplayCount}
                  </span>
                )
              }
            </Stream>
          </Link>
          <Dialog.Root onOpenChange={setIsMinicartDrawerOpen} open={isMinicartDrawerOpen}>
            <Dialog.Portal>
              <Dialog.Overlay
                className="bg-foreground/50 fixed inset-0 z-[1000000]"
                data-lenis-prevent
              />
              <Dialog.Content
                className="fixed inset-y-0 right-0 z-[1000000] w-full max-w-md bg-white shadow-xl"
                data-lenis-prevent
                onCloseAutoFocus={(e) => e.preventDefault()}
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <Dialog.Title className="sr-only">Cart</Dialog.Title>
                <Stream
                  fallback={
                    <Minicart
                      cartHref={cartHref}
                      initialItems={[]}
                      onClose={() => setIsMinicartDrawerOpen(false)}
                    />
                  }
                  value={streamableCartItems}
                >
                  {(cartItems) => (
                    <Minicart
                      cartHref={cartHref}
                      initialItems={cartItems ?? []}
                      onClose={() => setIsMinicartDrawerOpen(false)}
                    />
                  )}
                </Stream>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
          {/* Mobile Menu */}
          <Popover.Root onOpenChange={setIsMobileMenuOpen} open={isMobileMenuOpen}>
            <Popover.Anchor className="absolute top-full right-0 left-0" />
            <Popover.Trigger asChild>
              <MobileMenuButton
                aria-label={mobileMenuTriggerLabel}
                className="-mr-3 @4xl:hidden"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                open={isMobileMenuOpen}
              />
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 @container z-10 h-[calc(100svh-var(--headroom-wrapper-height))] w-[var(--radix-popper-anchor-width)]">
                <div
                  className="flex h-[100svh] flex-col gap-6 divide-y divide-[var(--nav-mobile-divider,hsl(var(--contrast-100)))] overflow-y-auto bg-[var(--nav-mobile-background,hsl(var(--background)))] px-4 py-6"
                  data-lenis-prevent
                >
                  <Stream
                    fallback={
                      <ul className="flex animate-pulse flex-col gap-4 p-5 @4xl:gap-2 @4xl:p-5">
                        <li>
                          <span className="bg-contrast-100 block h-4 w-10 rounded-md" />
                        </li>
                        <li>
                          <span className="bg-contrast-100 block h-4 w-14 rounded-md" />
                        </li>
                        <li>
                          <span className="bg-contrast-100 block h-4 w-24 rounded-md" />
                        </li>
                        <li>
                          <span className="bg-contrast-100 block h-4 w-16 rounded-md" />
                        </li>
                      </ul>
                    }
                    value={streamableLinks}
                  >
                    {(links) => (
                      <ul className="flex flex-col gap-4 pb-6">
                        {links.map((item, i) => (
                          <li className="w-full transform-none" key={i}>
                            {item.groups?.length && item.groups.length > 1 ? (
                              <SidePanel.Root>
                                <SidePanel.Trigger asChild>
                                  <button
                                    className={clsx(
                                      'flex w-full items-center justify-between gap-2 tracking-[1.28px] uppercase',
                                    )}
                                  >
                                    {item.label}
                                    <ChevronRight size={24} strokeWidth={1.5} />
                                  </button>
                                </SidePanel.Trigger>
                                <SidePanel.Content
                                  isFloating={isFloating}
                                  isMobileSidePanel
                                  title="Back"
                                >
                                  {links.map((innerItem, innerIndex) => {
                                    if (!innerItem.groups?.length) return null;

                                    return (
                                      <ul
                                        className="flex flex-col gap-4 pt-2 pb-6"
                                        key={innerIndex}
                                      >
                                        {innerItem.groups.map((group, groupIndex) => {
                                          if (!group.label) return null;

                                          return (
                                            <li key={groupIndex}>
                                              {group.href != null &&
                                              group.href !== '' &&
                                              !group.comingSoon ? (
                                                <Link
                                                  className={clsx(
                                                    'flex items-center gap-2 text-xl',
                                                  )}
                                                  href={group.href}
                                                >
                                                  {group.label}
                                                </Link>
                                              ) : (
                                                <span className="flex cursor-not-allowed items-center gap-2 text-xl text-neutral-400 hover:!text-neutral-400">
                                                  {group.label}
                                                  {group.comingSoon && (
                                                    <Badge shape="rounded" variant="primary">
                                                      Coming Soon
                                                    </Badge>
                                                  )}
                                                </span>
                                              )}
                                            </li>
                                          );
                                        })}
                                        <li>
                                          <Link className="text-xl" href="/shop/all">
                                            Shop all products
                                          </Link>
                                        </li>
                                      </ul>
                                    );
                                  })}
                                  <div className="border-border col-start-3 border-t pt-6">
                                    <NavigationMenu.Link
                                      className="w-full"
                                      href="/professional-series"
                                    >
                                      <div className="flex h-full flex-col">
                                        <figure className="bg-surface-image aspect-[19/6] h-full min-h-[246px] w-full overflow-hidden rounded-lg">
                                          <Image
                                            alt="Explore Lotus Professional Series"
                                            className="h-full w-full object-cover"
                                            height={246}
                                            src="https://images.ctfassets.net/esj3sw7u4uve/6qen7gqAvmEaKF2fusTjCF/9240e8a5fadb8fa961dc221295f49e1d/LTSCM500-LTSTR502-Mixed-Use-Group-Horiontal-Wide-Talent-V2.webp"
                                            width={369}
                                          />
                                        </figure>
                                        <span className="py-2 text-sm font-medium">
                                          Explore the Professional Series
                                        </span>
                                      </div>
                                    </NavigationMenu.Link>
                                  </div>
                                </SidePanel.Content>
                              </SidePanel.Root>
                            ) : (
                              <Link
                                className={clsx('tracking-[1.28px] uppercase')}
                                href={item.href}
                              >
                                {item.label}
                              </Link>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </Stream>
                  <ul className="flex flex-col gap-4">
                    <li>
                      <Link className="text-xl tracking-[1.28px]" href="/where-to-buy">
                        Where to buy
                      </Link>
                    </li>
                    <li>
                      <Link
                        aria-label={accountLabel}
                        className="text-xl tracking-[1.28px]"
                        href={accountHref}
                      >
                        Sign in/Account
                      </Link>
                    </li>
                    <li>
                      {/* Locale / Language Dropdown */}
                      {locales && locales.length > 1 ? (
                        <LocaleSwitcher
                          activeLocaleId={activeLocaleId}
                          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                          locales={locales as [Locale, Locale, ...Locale[]]}
                        />
                      ) : null}
                    </li>
                  </ul>
                </div>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
          {/* Currency Dropdown */}
          <Stream
            fallback={null}
            value={Streamable.all([streamableCurrencies, streamableActiveCurrencyId])}
          >
            {([currencies, activeCurrencyId]) =>
              currencies && currencies.length > 1 && currencyAction ? (
                <CurrencyForm
                  action={currencyAction}
                  activeCurrencyId={activeCurrencyId}
                  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                  currencies={currencies as [Currency, ...Currency[]]}
                />
              ) : null
            }
          </Stream>
        </div>
      </div>
      <div
        className="absolute top-full right-0 left-0 z-50 flex w-full justify-center perspective-[2000px]"
        data-lenis-prevent
      >
        <NavigationMenu.Viewport className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 relative w-full shadow-md" />
      </div>
    </NavigationMenu.Root>
  );
});

Navigation.displayName = 'Navigation';

function CurrencyForm({
  action,
  currencies,
  activeCurrencyId,
}: {
  activeCurrencyId?: string;
  action: CurrencyAction;
  currencies: [Currency, ...Currency[]];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [lastResult, formAction] = useActionState(action, null);
  const activeCurrency = currencies.find((currency) => currency.id === activeCurrencyId);

  useEffect(() => {
    // eslint-disable-next-line no-console
    if (lastResult?.error) console.log(lastResult.error);
  }, [lastResult?.error]);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className={clsx(
          'flex items-center gap-1 text-xs uppercase transition-opacity disabled:opacity-30',
          navButtonClassName,
        )}
        disabled={isPending}
      >
        {activeCurrency?.label ?? currencies[0].label}
        <ChevronDown size={16} strokeWidth={1.5} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 z-50 max-h-80 overflow-y-scroll rounded-xl bg-[var(--nav-locale-background,hsl(var(--background)))] p-2 shadow-xl @4xl:w-32 @4xl:rounded-2xl @4xl:p-2"
          sideOffset={16}
        >
          {currencies.map((currency) => (
            <DropdownMenu.Item
              className={clsx(
                'cursor-default rounded-lg bg-[var(--nav-locale-link-background,transparent)] px-2.5 py-2 text-sm font-medium text-[var(--nav-locale-link-text,hsl(var(--contrast-400)))] ring-[var(--nav-focus,hsl(var(--primary)))] transition-colors outline-none hover:bg-[var(--nav-locale-link-background-hover,hsl(var(--contrast-100)))] hover:text-[var(--nav-locale-link-text-hover,hsl(var(--foreground)))]',
                {
                  'text-[var(--nav-locale-link-text-selected,hsl(var(--foreground)))]':
                    currency.id === activeCurrencyId,
                },
              )}
              key={currency.id}
              onSelect={() => {
                // eslint-disable-next-line @typescript-eslint/require-await
                startTransition(async () => {
                  const formData = new FormData();

                  formData.append('id', currency.id);
                  formAction(formData);

                  // This is needed to refresh the Data Cache after the product has been added to the cart.
                  // The cart id is not picked up after the first time the cart is created/updated.
                  router.refresh();
                });
              }}
            >
              {currency.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
