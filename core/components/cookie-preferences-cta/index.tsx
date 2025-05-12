'use client';

import { Button } from '@/vibes/soul/primitives/button';
import { Link } from '~/components/link';

interface CookiePreferencesCtaProps {
  label?: string;
  variant: 'link' | 'button';
}

export default function CookiePreferencesCta({
  variant,
  label = 'Cookie Preferences',
}: CookiePreferencesCtaProps) {
  const handleClick = () => {
    window.truste.eu.clickListener();
  };

  if (variant === 'link') {
    return (
      <Link className="underline" href="#" onClick={handleClick}>
        {label}
      </Link>
    );
  }

  return <Button onClick={handleClick}>{label}</Button>;
}
