'use client';

import { clsx } from 'clsx';

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
  const handleClick = () => {
    window.truste.eu.clickListener();
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
