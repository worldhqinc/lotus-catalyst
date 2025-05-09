'use client';

import { clsx } from 'clsx';
import React from 'react';

import { Link } from '~/components/link';
import { usePathname } from '~/i18n/routing';

export function SidebarMenuLink({
  className,
  href,
  isSecondary,
  ...rest
}: React.ComponentPropsWithoutRef<typeof Link> & { isSecondary?: boolean }) {
  const pathname = usePathname();
  const linkPathname = typeof href === 'string' ? href : (href.pathname ?? null);

  const isActive =
    linkPathname !== null &&
    (isSecondary
      ? pathname === linkPathname || pathname === `${linkPathname}/`
      : pathname.includes(linkPathname));

  return (
    <Link
      {...rest}
      className={clsx(
        'ease-quad relative flex min-h-10 items-center py-2 pl-3 leading-[150%] tracking-[1.28px] uppercase transition-colors duration-200',
        isActive
          ? 'text-foreground after:bg-primary font-medium after:absolute after:inset-y-0 after:left-0 after:w-0.75'
          : 'text-contrast-400 hover:text-foreground',
        className,
      )}
      href={href}
    />
  );
}
