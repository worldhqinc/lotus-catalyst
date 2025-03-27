'use client';

import { SubmissionResult } from '@conform-to/react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import * as Popover from '@radix-ui/react-popover';
import { clsx } from 'clsx';
import { ChevronDown, Search, ShoppingBag, User } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, {
  forwardRef,
  Ref,
  useActionState,
  useCallback,
  useEffect,
  useState,
  useTransition,
} from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { Logo } from '@/vibes/soul/primitives/logo';
import { Price } from '@/vibes/soul/primitives/price-label';
import { Link } from '~/components/link';
import { usePathname, useRouter } from '~/i18n/routing';

import AlgoliaSearch from '../../../../components/header/algolia-search';

interface Link {
  label: string;
  href: string;
  groups?: Array<{
    label?: string;
    href?: string;
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
type SearchAction<S extends SearchResult> = Action<
  {
    searchResults: S[] | null;
    lastResult: SubmissionResult | null;
    emptyStateTitle?: string;
    emptyStateSubtitle?: string;
  },
  FormData
>;

interface Props<S extends SearchResult> {
  className?: string;
  isFloating?: boolean;
  accountHref: string;
  cartCount?: Streamable<number | null>;
  cartHref: string;
  links: Streamable<Link[]>;
  linksPosition?: 'center' | 'left' | 'right';
  locales?: Locale[];
  activeLocaleId?: string;
  currencies?: Currency[];
  activeCurrencyId?: string;
  currencyAction?: CurrencyAction;
  logo?: Streamable<string | { src: string; alt: string } | null>;
  logoWidth?: number;
  logoHeight?: number;
  logoHref?: string;
  logoLabel?: string;
  mobileLogo?: Streamable<string | { src: string; alt: string } | null>;
  mobileLogoWidth?: number;
  mobileLogoHeight?: number;
  searchAction?: SearchAction<S>;
  searchCtaLabel?: string;
  searchInputPlaceholder?: string;
  cartLabel?: string;
  accountLabel?: string;
  openSearchPopupLabel?: string;
  searchLabel?: string;
  mobileMenuTriggerLabel?: string;
  triggerMode?: 'hover' | 'click';
}

const MobileMenuButton = forwardRef<
  React.ComponentRef<'button'>,
  { open: boolean } & React.ComponentPropsWithoutRef<'button'>
>(({ open, className, ...rest }, ref) => {
  return (
    <button
      {...rest}
      className={clsx(
        'group relative rounded-lg p-2 outline-0 ring-[var(--nav-focus,hsl(var(--primary)))] transition-colors focus-visible:ring-2',
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
            'absolute top-2 flex transform items-center justify-between bg-[var(--nav-mobile-button-icon,hsl(var(--foreground)))] transition-all duration-500',
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
  'block text-3xl transition-colors duration-200 ease-quad hover:text-primary';
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
export const Navigation = forwardRef(function Navigation<S extends SearchResult>(
  {
    className,
    isFloating = false,
    cartHref,
    cartCount: streamableCartCount,
    accountHref,
    links: streamableLinks,
    logo: streamableLogo,
    logoHref = '/',
    logoLabel = 'Home',
    logoWidth = 200,
    logoHeight = 40,
    mobileLogo: streamableMobileLogo,
    mobileLogoWidth = 100,
    mobileLogoHeight = 40,
    linksPosition = 'center',
    activeLocaleId,
    locales,
    currencies,
    activeCurrencyId,
    currencyAction,
    cartLabel = 'Cart',
    accountLabel = 'Profile',
    openSearchPopupLabel = 'Open search popup',
    mobileMenuTriggerLabel = 'Toggle navigation',
    triggerMode = 'click',
  }: Props<S>,
  ref: Ref<HTMLDivElement>,
) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleScroll() {
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
    }

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
  };

  return (
    <NavigationMenu.Root
      className={clsx(
        'relative w-full bg-white font-body @container',
        className,
        isFloating ? 'shadow-md' : 'shadow-none',
      )}
      delayDuration={0}
      onValueChange={() => setIsSearchOpen(false)}
      ref={ref}
    >
      <div className="container flex items-center justify-between gap-1 bg-[var(--nav-background,hsl(var(--background)))] py-2 @4xl:py-4">
        {/* Logo */}
        <div
          className={clsx(
            'flex items-center justify-start self-stretch',
            linksPosition === 'center' ? 'flex-1' : 'flex-1 @4xl:flex-none',
          )}
        >
          <Logo
            className={clsx(streamableMobileLogo != null ? 'hidden @4xl:flex' : 'flex')}
            height={logoHeight}
            href={logoHref}
            label={logoLabel}
            logo={streamableLogo}
            width={logoWidth}
          />
          {streamableMobileLogo != null && (
            <Logo
              className="flex @4xl:hidden"
              height={mobileLogoHeight}
              href={logoHref}
              label={logoLabel}
              logo={streamableMobileLogo}
              width={mobileLogoWidth}
            />
          )}
        </div>

        {/* Top Level Nav Links */}
        <ul
          className={clsx(
            'hidden gap-1 @4xl:flex @4xl:flex-1',
            {
              left: '@4xl:justify-start',
              center: '@4xl:justify-center',
              right: '@4xl:justify-end',
            }[linksPosition],
          )}
        >
          <Stream
            fallback={
              <ul className="flex animate-pulse flex-row p-2 @4xl:gap-2 @4xl:p-5">
                <li>
                  <span className="block h-4 w-10 rounded-md bg-contrast-100" />
                </li>
                <li>
                  <span className="block h-4 w-14 rounded-md bg-contrast-100" />
                </li>
                <li>
                  <span className="block h-4 w-24 rounded-md bg-contrast-100" />
                </li>
                <li>
                  <span className="block h-4 w-16 rounded-md bg-contrast-100" />
                </li>
              </ul>
            }
            value={streamableLinks}
          >
            {(links) =>
              links.map((item, i) => (
                <NavigationMenu.Item key={i} value={i.toString()}>
                  <NavigationMenu.Trigger
                    asChild
                    {...(triggerMode === 'click' && {
                      onPointerEnter: (event) => event.preventDefault(),
                      onPointerMove: (event) => event.preventDefault(),
                      onPointerLeave: (event) => event.preventDefault(),
                    })}
                  >
                    {item.groups != null && item.groups.length > 0 ? (
                      <button
                        className={clsx(
                          'hidden after:hover:scale-x-100 data-[state=open]:after:scale-x-100 @4xl:relative @4xl:inline-flex @4xl:p-3 @4xl:uppercase @4xl:after:absolute @4xl:after:left-0 @4xl:after:top-full @4xl:after:h-0.5 @4xl:after:w-full @4xl:after:origin-left @4xl:after:scale-x-0 @4xl:after:bg-border @4xl:after:transition-transform @4xl:after:duration-200 @4xl:after:ease-quad',
                        )}
                      >
                        {item.label}
                      </button>
                    ) : (
                      <Link
                        className={clsx(
                          'hidden after:hover:scale-x-100 data-[state=open]:after:scale-x-100 @4xl:relative @4xl:inline-flex @4xl:p-3 @4xl:uppercase @4xl:after:absolute @4xl:after:left-0 @4xl:after:top-full @4xl:after:h-0.5 @4xl:after:w-full @4xl:after:origin-left @4xl:after:scale-x-0 @4xl:after:bg-border @4xl:after:transition-transform @4xl:after:duration-200 @4xl:after:ease-quad',
                        )}
                        href={item.href}
                      >
                        {item.label}
                      </Link>
                    )}
                  </NavigationMenu.Trigger>
                  {item.groups != null && item.groups.length > 0 && (
                    <NavigationMenu.Content
                      className="bg-[var(--nav-menu-background,hsl(var(--background)))]"
                      onPointerEnter={(e) => e.preventDefault()}
                      onPointerLeave={(e) => e.preventDefault()}
                    >
                      <div className="container m-auto grid grid-cols-3 justify-center gap-5 py-16">
                        <div className="flex flex-col items-start gap-6">
                          {item.groups.map((group, columnIndex) => (
                            <ul className="flex flex-col gap-6" key={columnIndex}>
                              {/* Second Level Links */}
                              {group.label != null && group.label !== '' && (
                                <li>
                                  {group.href != null && group.href !== '' ? (
                                    <Link className={navGroupClassName} href={group.href}>
                                      {group.label}
                                    </Link>
                                  ) : (
                                    <span className={navGroupClassName}>{group.label}</span>
                                  )}
                                </li>
                              )}
                              {group.links.map((link, idx) => (
                                // Third Level Links
                                <li key={idx}>
                                  <Link className={navLinkClassName} href={link.href}>
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          ))}
                          <div className="mt-8 flex flex-col items-start">
                            <Link
                              className={clsx(navLinkClassName, 'text-medium text-base')}
                              href="/shop-all"
                            >
                              Shop all products
                            </Link>
                          </div>
                        </div>
                        {/* TODO: Add dynamic content */}
                        <div className="col-start-3 grid grid-cols-2 gap-5">
                          <div className="flex flex-col">
                            <figure className="aspect-square h-auto w-full rounded-lg bg-surface-image" />
                            <span className="text-medium py-2">Shop The Perfectionist™</span>
                          </div>
                          <div className="flex flex-col">
                            <figure className="aspect-square h-auto w-full rounded-lg bg-surface-image" />
                            <span className="text-medium py-2">Shop The Sous</span>
                          </div>
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
          <Popover.Root onOpenChange={setIsSearchOpen} open={isSearchOpen}>
            <Popover.Anchor className="absolute left-0 right-0 top-full" />
            <Popover.Trigger asChild>
              <button
                aria-label={openSearchPopupLabel}
                className={navButtonClassName}
                onPointerEnter={(e) => e.preventDefault()}
                onPointerLeave={(e) => e.preventDefault()}
                onPointerMove={(e) => e.preventDefault()}
              >
                <Search size={20} strokeWidth={1} />
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content className="h-[calc(100vh-var(--headroom-wrapper-height))] w-[var(--radix-popper-anchor-width)] @container data-[state=closed]:animate-clipOut data-[state=open]:animate-clipIn">
                <div className="flex h-[inherit] flex-col bg-[var(--nav-search-background,hsl(var(--background)))] shadow-xl ring-1 ring-[var(--nav-search-border,hsl(var(--foreground)/5%))] transition-all duration-200 ease-in-out @4xl:inset-x-0">
                  <AlgoliaSearch closeSearch={handleCloseSearch} />
                </div>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
          <Link
            aria-label={accountLabel}
            className={clsx(navButtonClassName, 'hidden @4xl:inline-block')}
            href={accountHref}
          >
            <User size={24} strokeWidth={1} />
          </Link>
          <Link aria-label={cartLabel} className={navButtonClassName} href={cartHref}>
            <ShoppingBag size={24} strokeWidth={1} />
            <Stream
              fallback={
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 animate-pulse items-center justify-center rounded-full bg-contrast-100 text-xs text-background" />
              }
              value={streamableCartCount}
            >
              {(cartCount) =>
                cartCount != null &&
                cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--nav-cart-count-background,hsl(var(--foreground)))] text-xs text-[var(--nav-cart-count-text,hsl(var(--background)))]">
                    {cartCount}
                  </span>
                )
              }
            </Stream>
          </Link>

          {/* Mobile Menu */}
          <Popover.Root onOpenChange={setIsMobileMenuOpen} open={isMobileMenuOpen}>
            <Popover.Anchor className="absolute left-0 right-0 top-full" />
            <Popover.Trigger asChild>
              <MobileMenuButton
                aria-label={mobileMenuTriggerLabel}
                className="mr-1 @4xl:hidden"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                open={isMobileMenuOpen}
              />
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content className="z-10 h-[calc(100vh-var(--headroom-wrapper-height))] w-[var(--radix-popper-anchor-width)] @container data-[state=closed]:animate-clipOut data-[state=open]:animate-clipIn">
                <div className="flex h-[inherit] flex-col gap-4 divide-y divide-[var(--nav-mobile-divider,hsl(var(--contrast-100)))] overflow-y-auto bg-white px-4 py-36">
                  <Stream
                    fallback={
                      <ul className="flex animate-pulse flex-col gap-4 p-5 @4xl:gap-2 @4xl:p-5">
                        <li>
                          <span className="block h-4 w-10 rounded-md bg-contrast-100" />
                        </li>
                        <li>
                          <span className="block h-4 w-14 rounded-md bg-contrast-100" />
                        </li>
                        <li>
                          <span className="block h-4 w-24 rounded-md bg-contrast-100" />
                        </li>
                        <li>
                          <span className="block h-4 w-16 rounded-md bg-contrast-100" />
                        </li>
                      </ul>
                    }
                    value={streamableLinks}
                  >
                    {(links) =>
                      links.map((item, i) => (
                        <ul className="flex flex-col gap-4 [&:not(:first-of-type)]:pt-4" key={i}>
                          {item.label !== '' && (
                            <li>
                              <Link className="block" href={item.href}>
                                {item.label}
                              </Link>
                            </li>
                          )}
                          {item.groups
                            ?.flatMap((group) => group.links)
                            .map((link, j) => (
                              <li key={j}>
                                <Link className="block" href={link.href}>
                                  {link.label}
                                </Link>
                              </li>
                            ))}
                        </ul>
                      ))
                    }
                  </Stream>
                </div>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>

          {/* Locale / Language Dropdown */}
          {locales && locales.length > 1 ? (
            <LocaleSwitcher
              activeLocaleId={activeLocaleId}
              // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
              locales={locales as [Locale, Locale, ...Locale[]]}
            />
          ) : null}

          {/* Currency Dropdown */}
          {currencies && currencies.length > 1 && currencyAction ? (
            <CurrencyForm
              action={currencyAction}
              activeCurrencyId={activeCurrencyId}
              // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
              currencies={currencies as [Currency, ...Currency[]]}
            />
          ) : null}
        </div>
      </div>

      <div className="perspective-[2000px] absolute left-0 right-0 top-full z-50 flex w-full justify-center">
        <NavigationMenu.Viewport className="relative w-full shadow-md data-[state=closed]:animate-clipOut data-[state=open]:animate-clipIn" />
      </div>
    </NavigationMenu.Root>
  );
});

Navigation.displayName = 'Navigation';

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

function LocaleSwitcher({
  locales,
  activeLocaleId,
}: {
  activeLocaleId?: string;
  locales: [Locale, ...Locale[]];
}) {
  const activeLocale = locales.find((locale) => locale.id === activeLocaleId);
  const [isPending, startTransition] = useTransition();
  const switchLocale = useSwitchLocale();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className={clsx(
          'flex items-center gap-1 text-xs uppercase transition-opacity [&:disabled]:opacity-30',
          navButtonClassName,
        )}
        disabled={isPending}
      >
        {activeLocale?.id ?? locales[0].id}
        <ChevronDown size={16} strokeWidth={1.5} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          className="z-50 max-h-80 overflow-y-scroll rounded-xl bg-[var(--nav-locale-background,hsl(var(--background)))] p-2 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 @4xl:w-32 @4xl:rounded-2xl @4xl:p-2"
          sideOffset={16}
        >
          {locales.map(({ id, label }) => (
            <DropdownMenu.Item
              className={clsx(
                'cursor-default rounded-lg bg-[var(--nav-locale-link-background,transparent)] px-2.5 py-2 text-sm font-medium text-[var(--nav-locale-link-text,hsl(var(--contrast-400)))] outline-none ring-[var(--nav-focus,hsl(var(--primary)))] transition-colors hover:bg-[var(--nav-locale-link-background-hover,hsl(var(--contrast-100)))] hover:text-[var(--nav-locale-link-text-hover,hsl(var(--foreground)))]',
                {
                  'text-[var(--nav-locale-link-text-selected,hsl(var(--foreground)))]':
                    id === activeLocaleId,
                },
              )}
              key={id}
              onSelect={() => startTransition(() => switchLocale(id))}
            >
              {label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

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
          'flex items-center gap-1 text-xs uppercase transition-opacity [&:disabled]:opacity-30',
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
          className="z-50 max-h-80 overflow-y-scroll rounded-xl bg-[var(--nav-locale-background,hsl(var(--background)))] p-2 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 @4xl:w-32 @4xl:rounded-2xl @4xl:p-2"
          sideOffset={16}
        >
          {currencies.map((currency) => (
            <DropdownMenu.Item
              className={clsx(
                'cursor-default rounded-lg bg-[var(--nav-locale-link-background,transparent)] px-2.5 py-2 text-sm font-medium text-[var(--nav-locale-link-text,hsl(var(--contrast-400)))] outline-none ring-[var(--nav-focus,hsl(var(--primary)))] transition-colors hover:bg-[var(--nav-locale-link-background-hover,hsl(var(--contrast-100)))] hover:text-[var(--nav-locale-link-text-hover,hsl(var(--foreground)))]',
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
