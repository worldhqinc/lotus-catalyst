import { SubmissionResult } from '@conform-to/react';
import { clsx } from 'clsx';
import { forwardRef, ReactNode, type Ref } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { FooterEmailForm } from '@/vibes/soul/primitives/footer-email-form';
import { Logo } from '@/vibes/soul/primitives/logo';
import { Link } from '~/components/link';

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
}

interface ContactInformation {
  address?: string;
  phone?: string;
}

interface Props {
  action: Action<{ lastResult: SubmissionResult | null; successMessage?: string }, FormData>;
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
export const Footer = forwardRef(function Footer(
  {
    action,
    logo,
    sections: streamableSections,
    contactTitle = 'Contact Us',
    contactInformation: streamableContactInformation,
    socialMediaLinks: streamableSocialMediaLinks,
    copyright: streamableCopyright,
    className,
    logoHref = '#',
    logoLabel = 'Home',
    logoWidth = 200,
    logoHeight = 40,
  }: Props,
  ref: Ref<HTMLDivElement>,
) {
  return (
    <footer
      className={clsx(
        'border-b-4 border-t border-b-[var(--footer-border-bottom,hsl(var(--primary)))] border-t-[var(--footer-border-top,hsl(var(--contrast-100)))] bg-[var(--footer-background,hsl(var(--background)))] @container',
        className,
      )}
      ref={ref}
    >
      <div className="container py-6 @xl:py-10 @4xl:py-20">
        <div className="flex flex-col justify-between gap-x-8 gap-y-12 @3xl:flex-row">
          <div className="flex flex-1 flex-col gap-4 @3xl:w-1/3 @3xl:gap-6 @4xl:flex-none">
            {/* Logo Information */}
            <Logo
              height={logoHeight}
              href={logoHref}
              label={logoLabel}
              location="footer"
              logo={logo}
              width={logoWidth}
            />

            {/* Contact Information */}
            <Stream
              fallback={
                <div className="mb-4 animate-pulse text-lg @lg:text-xl">
                  <div className="flex h-[1lh] items-center">
                    <span className="h-[1ex] w-[10ch] rounded bg-contrast-100" />
                  </div>
                  <div className="flex h-[1lh] items-center">
                    <span className="h-[1ex] w-[15ch] rounded bg-contrast-100" />
                  </div>
                  <div className="flex h-[1lh] items-center">
                    <span className="h-[1ex] w-[12ch] rounded bg-contrast-100" />
                  </div>
                </div>
              }
              value={streamableContactInformation}
            >
              {(contactInformation) => {
                if (contactInformation?.address != null || contactInformation?.phone != null) {
                  return (
                    <div>
                      <p className="text-lg">{contactTitle}</p>
                      <div className="mt-8">
                        <FooterEmailForm action={action} />
                      </div>
                    </div>
                  );
                }
              }}
            </Stream>
          </div>

          {/* Footer Columns of Links */}
          <Stream
            fallback={
              <div className="grid w-full flex-1 animate-pulse gap-8 [grid-template-columns:_repeat(auto-fill,_150px)] @xl:gap-y-10">
                <div className="pr-8">
                  <div className="mb-3 flex h-[1lh] items-center">
                    <span className="h-[1ex] w-[10ch] rounded bg-contrast-100" />
                  </div>

                  <ul>
                    <li className="py-2 text-sm">
                      <div className="flex h-[1lh] items-center text-sm">
                        <span className="h-[1ex] w-[10ch] rounded-sm bg-contrast-100" />
                      </div>
                    </li>
                    <li className="py-2 text-sm">
                      <div className="flex h-[1lh] items-center text-sm">
                        <span className="h-[1ex] w-[10ch] rounded-sm bg-contrast-100" />
                      </div>
                    </li>
                    <li className="py-2 text-sm">
                      <div className="flex h-[1lh] items-center text-sm">
                        <span className="h-[1ex] w-[10ch] rounded-sm bg-contrast-100" />
                      </div>
                    </li>
                    <li className="py-2 text-sm">
                      <div className="flex h-[1lh] items-center text-sm">
                        <span className="h-[1ex] w-[10ch] rounded-sm bg-contrast-100" />
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="pr-8">
                  <div className="mb-3 flex h-[1lh] items-center">
                    <span className="h-[1ex] w-[10ch] rounded bg-contrast-100" />
                  </div>

                  <ul>
                    <li className="py-2 text-sm">
                      <div className="flex h-[1lh] items-center text-sm">
                        <span className="h-[1ex] w-[10ch] rounded-sm bg-contrast-100" />
                      </div>
                    </li>
                    <li className="py-2 text-sm">
                      <div className="flex h-[1lh] items-center text-sm">
                        <span className="h-[1ex] w-[10ch] rounded-sm bg-contrast-100" />
                      </div>
                    </li>
                    <li className="py-2 text-sm">
                      <div className="flex h-[1lh] items-center text-sm">
                        <span className="h-[1ex] w-[10ch] rounded-sm bg-contrast-100" />
                      </div>
                    </li>
                    <li className="py-2 text-sm">
                      <div className="flex h-[1lh] items-center text-sm">
                        <span className="h-[1ex] w-[10ch] rounded-sm bg-contrast-100" />
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="pr-8">
                  <div className="mb-3 flex h-[1lh] items-center">
                    <span className="h-[1ex] w-[10ch] rounded bg-contrast-100" />
                  </div>

                  <ul>
                    <li className="py-2 text-sm">
                      <div className="flex h-[1lh] items-center text-sm">
                        <span className="h-[1ex] w-[10ch] rounded-sm bg-contrast-100" />
                      </div>
                    </li>
                    <li className="py-2 text-sm">
                      <div className="flex h-[1lh] items-center text-sm">
                        <span className="h-[1ex] w-[10ch] rounded-sm bg-contrast-100" />
                      </div>
                    </li>
                    <li className="py-2 text-sm">
                      <div className="flex h-[1lh] items-center text-sm">
                        <span className="h-[1ex] w-[10ch] rounded-sm bg-contrast-100" />
                      </div>
                    </li>
                    <li className="py-2 text-sm">
                      <div className="flex h-[1lh] items-center text-sm">
                        <span className="h-[1ex] w-[10ch] rounded-sm bg-contrast-100" />
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="pr-8">
                  <div className="mb-3 flex h-[1lh] items-center">
                    <span className="h-[1ex] w-[10ch] rounded bg-contrast-100" />
                  </div>

                  <ul>
                    <li className="py-2 text-sm">
                      <div className="flex h-[1lh] items-center text-sm">
                        <span className="h-[1ex] w-[10ch] rounded-sm bg-contrast-100" />
                      </div>
                    </li>
                    <li className="py-2 text-sm">
                      <div className="flex h-[1lh] items-center text-sm">
                        <span className="h-[1ex] w-[10ch] rounded-sm bg-contrast-100" />
                      </div>
                    </li>
                    <li className="py-2 text-sm">
                      <div className="flex h-[1lh] items-center text-sm">
                        <span className="h-[1ex] w-[10ch] rounded-sm bg-contrast-100" />
                      </div>
                    </li>
                    <li className="py-2 text-sm">
                      <div className="flex h-[1lh] items-center text-sm">
                        <span className="h-[1ex] w-[10ch] rounded-sm bg-contrast-100" />
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            }
            value={streamableSections}
          >
            {(sections) => {
              if (sections.length > 0) {
                return (
                  <div className="grid w-full flex-1 justify-end gap-8 [grid-template-columns:_repeat(auto-fill,_150px)] @xl:gap-y-10">
                    {sections.map(({ title, links }, i) => (
                      <div key={i}>
                        {title != null && (
                          <span className="mb-3 block text-lg font-semibold text-foreground">
                            {title}
                          </span>
                        )}

                        <ul className="flex flex-col items-start gap-4">
                          {links.map((link, idx) => {
                            return (
                              <li key={idx}>
                                <Link
                                  className="block transition-colors duration-200 ease-quad hover:text-primary focus-visible:text-primary"
                                  href={link.href}
                                >
                                  {link.label}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                );
              }
            }}
          </Stream>
        </div>

        <div className="flex flex-col-reverse items-start gap-y-8 pt-16 @3xl:flex-row-reverse @3xl:items-end @3xl:pt-20">
          {/* Copyright */}
          <Stream
            fallback={
              <div className="flex h-[1lh] animate-pulse items-center text-sm">
                <span className="h-[1ex] w-[40ch] rounded-sm bg-contrast-100" />
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

          {/* Social Media Links */}
          <Stream
            fallback={
              <div className="flex flex-1 animate-pulse items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-contrast-100" />
                <div className="h-8 w-8 rounded-full bg-contrast-100" />
                <div className="h-8 w-8 rounded-full bg-contrast-100" />
                <div className="h-8 w-8 rounded-full bg-contrast-100" />
              </div>
            }
            value={streamableSocialMediaLinks}
          >
            {(socialMediaLinks) => {
              if (socialMediaLinks != null) {
                return (
                  <div className="flex flex-1 items-center gap-3">
                    {socialMediaLinks.map(({ href, icon }, i) => {
                      return (
                        <Link
                          className="flex items-center justify-center rounded-lg fill-[var(--footer-social-icon,hsl(var(--contrast-400)))] p-1 ring-[var(--footer-focus,hsl(var(--primary)))] transition-colors duration-300 ease-out hover:fill-[var(--footer-social-icon-hover,hsl(var(--foreground)))] focus-visible:outline-0 focus-visible:ring-2"
                          href={href}
                          key={i}
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
      </div>
    </footer>
  );
});
