'use client';

import { SidebarMenuLink } from './sidebar-menu-link';

interface Props {
  label: string;
}

export function CookiePolicyLink({ label }: Props) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.truste.eu.clickListener();
  };

  return (
    <SidebarMenuLink href="#" onClick={handleClick}>
      {label}
    </SidebarMenuLink>
  );
}
