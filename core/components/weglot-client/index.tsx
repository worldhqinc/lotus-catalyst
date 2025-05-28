'use client';

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

  return null;
}
