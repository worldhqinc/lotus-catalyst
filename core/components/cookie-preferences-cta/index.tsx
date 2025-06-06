'use client';

import { Button } from '@/vibes/soul/primitives/button';
import { Link } from '~/components/link';

interface CookiePreferencesCtaProps {
  label?: string;
  variant: 'link' | 'button';
  className?: string;
}

export default function CookiePreferencesCta({
  variant,
  label = 'Cookie Preferences',
  className = 'text-inherit underline',
}: CookiePreferencesCtaProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e.preventDefault();

    if (
      typeof window.truste !== 'undefined' &&
      typeof window.truste.eu.clickListener === 'function'
    ) {
      window.truste.eu.clickListener();
    }
  };

  if (variant === 'link') {
    return (
      <Link className={className} href="#" onClick={handleClick}>
        {label}
      </Link>
    );
  }

  return (
    <Button className={className} onClick={handleClick}>
      {label}
    </Button>
  );
}
