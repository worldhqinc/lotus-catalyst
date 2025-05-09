'use client';

import { ComponentPropsWithoutRef } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { usePathname } from '~/i18n/routing';

import { SidebarMenuLink } from './sidebar-menu-link';
import { SidebarMenuSelect } from './sidebar-menu-select';

interface MenuLink {
  href: string;
  label: string;
  prefetch?: ComponentPropsWithoutRef<typeof SidebarMenuLink>['prefetch'];
  secondaryLinks?: Array<{ href: string; label: string }>;
  onClick?: () => void;
  component?: React.ComponentType<{ label: string }>;
}

interface Props {
  links: Streamable<MenuLink[]>;
  placeholderCount?: number;
}

export function SidebarMenu({ links: streamableLinks, placeholderCount = 5 }: Props) {
  const pathname = usePathname();

  return (
    <Stream
      fallback={<SidebarMenuSkeleton placeholderCount={placeholderCount} />}
      value={streamableLinks}
    >
      {(links) => {
        if (!links.length) {
          return null;
        }

        return (
          <nav>
            <ul className="hidden @2xl:block">
              {links.map((link, index) => {
                const isPrimaryActive = pathname.includes(link.href);

                return (
                  <li className="mb-2" key={index}>
                    {link.component ? (
                      <link.component label={link.label} />
                    ) : (
                      <SidebarMenuLink
                        href={link.href}
                        onClick={link.onClick}
                        prefetch={link.prefetch}
                      >
                        {link.label}
                      </SidebarMenuLink>
                    )}
                    {link.secondaryLinks && isPrimaryActive && (
                      <ul className="mt-1 ml-4">
                        {link.secondaryLinks.map((secondaryLink, secondaryIndex) => (
                          <li key={secondaryIndex}>
                            <SidebarMenuLink
                              className="!tracking-normal !normal-case after:content-none"
                              href={secondaryLink.href}
                              isSecondary
                              prefetch={link.prefetch}
                            >
                              {secondaryLink.label}
                            </SidebarMenuLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
            <div className="@2xl:hidden">
              <SidebarMenuSelect links={links} />
            </div>
          </nav>
        );
      }}
    </Stream>
  );
}

function SidebarMenuSkeleton({ placeholderCount }: { placeholderCount: number }) {
  return (
    <>
      <div className="hidden [mask-image:linear-gradient(to_bottom,_black_0%,_transparent_90%)] @2xl:block">
        <div className="w-full animate-pulse">
          {Array.from({ length: placeholderCount }).map((_, index) => (
            <div className="flex h-10 items-center px-3" key={index}>
              <div className="bg-contrast-100 h-[1lh] flex-1 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
      <div className="@2xl:hidden">
        <div className="bg-contrast-100 h-[50px] w-full rounded-lg" />
      </div>
    </>
  );
}
