'use client';

import { Select } from '@/vibes/soul/primitives/select';
import { usePathname, useRouter } from '~/i18n/routing';

interface MenuLink {
  href: string;
  label: string;
  secondaryLinks?: Array<{ href: string; label: string }>;
  component?: React.ComponentType<{ label: string }>;
}

interface SelectOption {
  value: string;
  label: string;
  isCustomAction?: boolean;
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

  const options: SelectOption[] = links.flatMap((link) => [
    ...(link.secondaryLinks?.length
      ? []
      : [
          {
            value: link.href,
            label: link.label,
            isCustomAction: !!link.component,
          },
        ]),
    ...(link.secondaryLinks?.map((secondary) => ({
      value: secondary.href,
      label: `${link.label} - ${secondary.label}`,
    })) ?? []),
  ]);

  return (
    <Select
      onValueChange={(value) => {
        const option = options.find((opt) => opt.value === value);

        if (option?.isCustomAction) {
          window.truste.eu.clickListener();
        } else {
          router.push(value);
        }
      }}
      options={links.map((link) => ({ value: link.href, label: link.label }))}
      position="popper"
      value={matchingLink}
    />
  );
}
