'use client';

import { Select } from '@/vibes/soul/form/select';
import { usePathname, useRouter } from '~/i18n/routing';

export function SidebarMenuSelect({ links }: { links: Array<{ href: string; label: string }> }) {
  const pathname = usePathname();
  const router = useRouter();

  const matchingLink = links.find((link) => pathname.includes(link.href))?.href ?? '';

  return (
    <Select
      name="sidebar-layout-link-select"
      onValueChange={(value) => {
        router.push(value);
      }}
      options={links.map((link) => ({ value: link.href, label: link.label }))}
      value={matchingLink}
    />
  );
}
