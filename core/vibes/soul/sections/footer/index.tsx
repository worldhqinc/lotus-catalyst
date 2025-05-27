import { SubmissionResult } from '@conform-to/react';
import { clsx } from 'clsx';
import { forwardRef, ReactNode, type Ref } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { InlineEmailForm } from '@/vibes/soul/primitives/inline-email-form';
import { auth } from '~/auth';
import CookiePreferencesCta from '~/components/cookie-preferences-cta';
import CookiePreferencesNotice from '~/components/cookie-preferences-notice';
import { Link } from '~/components/link';

import { LogoLotus } from '../../primitives/logo-lotus';

type Action<State, Payload> = (state: Awaited<State>, payload: Payload) => State | Promise<State>;

interface Image {
  src: string;
  alt: string;
}

interface Link {
  href: string;
  label: string;
}

export interface Section {
  title?: string;
  links: Link[];
}

interface SocialMediaLink {
  href: string;
  icon: ReactNode;
  label: string;
}

interface ContactInformation {
  address?: string;
  phone?: string;
}

interface Props {
  action: Action<
    {
      lastResult: SubmissionResult | null;
      successMessage?: string | null;
      errorMessage?: string | null;
    },
    FormData
  >;
  logo?: Streamable<string | Image | null>;
  sections: Streamable<Section[]>;
  copyright?: Streamable<string | null>;
  contactInformation?: Streamable<ContactInformation | null>;
  socialMediaLinks?: Streamable<SocialMediaLink[] | null>;
  contactTitle?: string;
  className?: string;
  logoHref?: string;
  logoLabel?: string;
  logoWidth?: number;
  logoHeight?: number;
}

/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --footer-focus: hsl(var(--primary));
 *   --footer-background: hsl(var(--background));
 *   --footer-border-top: hsl(var(--contrast-100));
 *   --footer-border-bottom: hsl(var(--primary));
 *   --footer-contact-title: hsl(var(--contrast-300));
 *   --footer-contact-text: hsl(var(--foreground));
 *   --footer-social-icon: hsl(var(--contrast-400));
 *   --footer-social-icon-hover: hsl(var(--foreground));
 *   --footer-section-title: hsl(var(--foreground));
 *   --footer-link: hsl(var(--contrast-400));
 *   --footer-link-hover: hsl(var(--foreground));
 *   --footer-copyright: hsl(var(--contrast-400));
 * }
 * ```
 */
export const Footer = forwardRef(async function Footer(
  {
    action,
    contactInformation: streamableContactInformation,
    socialMediaLinks: streamableSocialMediaLinks,
    copyright: streamableCopyright,
    className,
  }: Props,
  ref: Ref<HTMLDivElement>,
) {
  const session = await auth();

  return (
    <footer
      className={clsx(
        '@container border-t border-t-[var(--footer-border-top,hsl(var(--contrast-100)))] bg-[var(--footer-background,hsl(var(--background)))]',
        className,
      )}
      ref={ref}
    >
      <div className="container py-6 @xl:py-10 @4xl:py-12">
        <div className="flex flex-col justify-between gap-x-8 gap-y-12 @3xl:grid @3xl:grid-cols-2 @4xl:gap-x-16 @6xl:gap-x-34 @7xl:grid-cols-[437px_1fr]">
          <div className="flex flex-1 flex-col gap-4 @3xl:gap-6 @4xl:flex-none">
            {/* Logo Information */}
            <LogoLotus height={40} type="icon" width={80} />

            {/* Contact Information */}
            <Stream
              fallback={
                <div className="mb-4 animate-pulse text-lg @lg:text-xl">
                  <div className="flex h-[1lh] items-center">
                    <span className="bg-contrast-100 h-[1ex] w-[10ch] rounded-sm" />
                  </div>
                  <div className="flex h-[1lh] items-center">
                    <span className="bg-contrast-100 h-[1ex] w-[15ch] rounded-sm" />
                  </div>
                  <div className="flex h-[1lh] items-center">
                    <span className="bg-contrast-100 h-[1ex] w-[12ch] rounded-sm" />
                  </div>
                </div>
              }
              value={streamableContactInformation}
            >
              {(contactInformation) => {
                if (contactInformation?.address != null || contactInformation?.phone != null) {
                  return (
                    <div>
                      <p className="text-lg">
                        Join our mailing list for insider updates, exclusive offers, and cooking
                        inspiration.
                      </p>
                      <div className="mt-8">
                        <InlineEmailForm action={action} />
                        <CookiePreferencesNotice />
                      </div>
                    </div>
                  );
                }
              }}
            </Stream>

            {/* Social Media Links */}
            <Stream
              fallback={
                <div className="flex animate-pulse items-center gap-3">
                  <div className="bg-contrast-100 h-8 w-8 rounded-full" />
                  <div className="bg-contrast-100 h-8 w-8 rounded-full" />
                  <div className="bg-contrast-100 h-8 w-8 rounded-full" />
                  <div className="bg-contrast-100 h-8 w-8 rounded-full" />
                </div>
              }
              value={streamableSocialMediaLinks}
            >
              {(socialMediaLinks) => {
                if (socialMediaLinks != null) {
                  return (
                    <div className="flex items-center gap-3">
                      {socialMediaLinks.map(({ href, icon, label }, i) => {
                        return (
                          <Link
                            aria-label={`Follow us on ${label}`}
                            className="ease-quad hover:text-primary flex items-center justify-center rounded-lg fill-[var(--footer-social-icon,hsl(var(--contrast-400)))] p-1 ring-[var(--footer-focus,hsl(var(--primary)))] transition-colors duration-200 hover:fill-[var(--footer-social-icon-hover,hsl(var(--foreground)))] focus-visible:ring-2 focus-visible:outline-0"
                            href={href}
                            key={i}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            {icon}
                          </Link>
                        );
                      })}
                    </div>
                  );
                }
              }}
            </Stream>
          </div>

          {/* Footer Columns of Links */}
          <div className="divide-contrast-200 grid w-full flex-1 grid-cols-1 justify-end divide-y @xl:gap-y-10 @3xl:grid-cols-2 @3xl:divide-y-0 @4xl:grid-cols-4 @4xl:gap-x-4">
            <div className="py-6 @3xl:py-0">
              <span className="text-foreground mb-3 block text-lg font-medium">Products</span>
              <ul className="flex flex-col items-start gap-4">
                <li>
                  <Link
                    className="text-contrast-400 ease-quad hover:text-primary focus-visible:text-primary block transition-colors duration-200"
                    href="/shop/all"
                  >
                    Shop All
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-contrast-400 ease-quad hover:text-primary focus-visible:text-primary block transition-colors duration-200"
                    href="/shop/professional-series"
                  >
                    Professional Series
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-contrast-400 ease-quad hover:text-primary focus-visible:text-primary block transition-colors duration-200"
                    href="/shop/accessories"
                  >
                    Accessories
                  </Link>
                </li>
              </ul>
            </div>

            <div className="py-6 @3xl:py-0">
              <span className="text-foreground mb-3 block text-lg font-medium">About Us</span>
              <ul className="flex flex-col items-start gap-4">
                <li>
                  <Link
                    className="text-contrast-400 ease-quad hover:text-primary focus-visible:text-primary block transition-colors duration-200"
                    href="/our-story"
                  >
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-contrast-400 ease-quad hover:text-primary focus-visible:text-primary block transition-colors duration-200"
                    href="/press-and-media-kits"
                  >
                    Press
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-contrast-400 ease-quad hover:text-primary focus-visible:text-primary block transition-colors duration-200"
                    href="/inspiration"
                  >
                    Inspiration
                  </Link>
                </li>
              </ul>
            </div>

            <div className="py-6 @3xl:py-0">
              <span className="text-foreground mb-3 block text-lg font-medium">My Account</span>
              <ul className="flex flex-col items-start gap-4">
                <li>
                  <Link
                    className="text-contrast-400 ease-quad hover:text-primary focus-visible:text-primary block transition-colors duration-200"
                    href="/login"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-contrast-400 ease-quad hover:text-primary focus-visible:text-primary block transition-colors duration-200"
                    href="/account/orders"
                  >
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-contrast-400 ease-quad hover:text-primary focus-visible:text-primary block transition-colors duration-200"
                    href={
                      session?.user?.customerAccessToken
                        ? '/account/wishlists'
                        : '/login?redirectTo=/account/wishlists'
                    }
                  >
                    Wish Lists
                  </Link>
                </li>
              </ul>
            </div>

            <div className="py-6 @3xl:py-0">
              <span className="text-foreground mb-3 block text-lg font-medium">Support</span>
              <ul className="flex flex-col items-start gap-4">
                <li>
                  <Link
                    className="text-contrast-400 ease-quad hover:text-primary focus-visible:text-primary block transition-colors duration-200"
                    href="/contact"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-contrast-400 ease-quad hover:text-primary focus-visible:text-primary block transition-colors duration-200"
                    href="/product-registration"
                  >
                    Registration
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-contrast-400 ease-quad hover:text-primary focus-visible:text-primary block transition-colors duration-200"
                    href="/faqs"
                  >
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-contrast-400 ease-quad hover:text-primary focus-visible:text-primary block transition-colors duration-200"
                    href="/tutorials"
                  >
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-contrast-400 ease-quad hover:text-primary focus-visible:text-primary block transition-colors duration-200"
                    href="/free-shipping"
                  >
                    Free Shipping
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-contrast-400 ease-quad hover:text-primary focus-visible:text-primary block transition-colors duration-200"
                    href="/warranty"
                  >
                    Warranty
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-contrast-400 ease-quad hover:text-primary focus-visible:text-primary block transition-colors duration-200"
                    href="/returns"
                  >
                    Returns
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse items-start gap-y-8 pt-12 @3xl:flex-row-reverse @3xl:items-start @3xl:justify-between">
          {/* Copyright */}
          <Stream
            fallback={
              <div className="flex h-[1lh] animate-pulse items-center text-sm">
                <span className="bg-contrast-100 h-[1ex] w-[40ch] rounded-sm" />
              </div>
            }
            value={streamableCopyright}
          >
            {(copyright) => {
              if (copyright != null) {
                return (
                  <p className="text-sm text-[var(--footer-copyright,hsl(var(--contrast-400)))]">
                    {copyright}
                  </p>
                );
              }
            }}
          </Stream>

          <div className="flex flex-col items-start gap-4 @4xl:flex-row @4xl:items-center @4xl:gap-8">
            <Link
              className="text-contrast-400 ease-quad hover:text-primary focus-visible:text-primary block text-sm transition-colors duration-200"
              href="/policies/privacy-policy/"
            >
              Privacy Policy
            </Link>
            <Link
              className="text-contrast-400 ease-quad hover:text-primary focus-visible:text-primary block text-sm transition-colors duration-200"
              href="/policies/privacy-policy#right-to-opt-out-of-the-sale-or-sharing-of-your-personal-information"
            >
              Don't Sell or Share My Information
            </Link>
            <Link
              className="text-contrast-400 ease-quad hover:text-primary focus-visible:text-primary block text-sm transition-colors duration-200"
              href="/policies/terms-and-conditions/"
            >
              Terms and Conditions
            </Link>
            <CookiePreferencesCta
              className="text-contrast-400 ease-quad hover:text-primary focus-visible:text-primary block text-sm transition-colors duration-200"
              variant="link"
            />
            <Link
              className="text-contrast-400 ease-quad hover:text-primary focus-visible:text-primary block text-sm transition-colors duration-200"
              href="/product-formulation-lookup"
            >
              Product Formulation Information
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
});
