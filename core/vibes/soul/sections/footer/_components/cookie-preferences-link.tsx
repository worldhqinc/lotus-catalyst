'use client';

import { Link } from '~/components/link';

export const CookiePreferencesLink = () => {
  return (
    <Link
      className="text-contrast-400 ease-quad hover:text-primary focus-visible:text-primary text-sm transition-colors duration-200"
      href="#"
      onClick={() => window.truste.eu.clickListener()}
    >
      Cookie Preferences
    </Link>
  );
};
