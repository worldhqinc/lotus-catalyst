'use client';

import Script from 'next/script';
import { useLocale } from 'next-intl';
import { useCallback, useEffect } from 'react';

export default function WeglotClient() {
  const locale = useLocale();

  const setLanguageIfNeeded = useCallback(
    (langcode: string) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (typeof window !== 'undefined' && window.Weglot) {
        if (locale !== window.Weglot.getCurrentLang()) {
          window.Weglot.switchTo(langcode);
        }
      }
    },
    [locale],
  );

  useEffect(() => setLanguageIfNeeded(locale), [locale, setLanguageIfNeeded]);

  return (
    <Script
      onLoad={() => {
        window.Weglot.initialize({
          api_key: `${process.env.NEXT_PUBLIC_WEGLOT_API_KEY}`,
          hide_switcher: false,
          cache: true,
        });

        setTimeout(() => setLanguageIfNeeded(locale), 500);
      }}
      src="https://cdn.weglot.com/weglot.min.js"
    />
  );
}
