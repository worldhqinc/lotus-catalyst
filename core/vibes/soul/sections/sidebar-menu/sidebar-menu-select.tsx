'use client';

import { Select } from '@/vibes/soul/form/select';
import { usePathname, useRouter } from '~/i18n/routing';

interface MenuLink {
  href: string;
  label: string;
  secondaryLinks?: Array<{ href: string; label: string }>;
}

export function SidebarMenuSelect({ links }: { links: MenuLink[] }) {
  const pathname = usePathname();
  const router = useRouter();

  const matchingLink =
    links.reduce<string | undefined>((match, link) => {
      if (match) return match;
      if (pathname === link.href || pathname === `${link.href}/`) return link.href;

      return link.secondaryLinks?.find(
        (secondary) => pathname === secondary.href || pathname === `${secondary.href}/`,
      )?.href;
    }, undefined) ?? '';

  const options = links.flatMap((link) => [
    ...(link.secondaryLinks?.length ? [] : [{ value: link.href, label: link.label }]),
    ...(link.secondaryLinks?.map((secondary) => ({
      value: secondary.href,
      label: `${link.label} - ${secondary.label}`,
    })) ?? []),
  ]);

  return (
    <Select
      name="sidebar-layout-link-select"
      onValueChange={(value) => {
        router.push(value);
      }}
      options={options}
      value={matchingLink}
    />
  );
}
