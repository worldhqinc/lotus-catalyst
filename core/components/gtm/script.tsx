'use client';

/* eslint-disable */

import { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer: any[];
    landingURL?: string;
  }
}

export default function GoogleTagManagerScript() {
  useEffect(() => {
    const dataLayer = (window.dataLayer = window.dataLayer || []);

    if (typeof window.landingURL === 'undefined') {
      const { protocol, hostname, pathname, search, hash } = window.location;
      window.landingURL = `${protocol}//${hostname}${pathname}${search}${hash}`;
    }

    if (window.landingURL) {
      dataLayer.push({
        landingURL: window.landingURL,
        originalLocation: window.landingURL,
      });
    }

    function gtag(...args: any[]) {
      dataLayer.push(args);
    }

    gtag('consent', 'default', {
      analytics_storage: 'denied',
      functionality_storage: 'denied',
      personalization_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      security_storage: 'granted',
    });

    const hostname = window.location.hostname.replace('www.', '');
    const gtm_brand = 'lotuscooking';
    const gtm_countryCode = 'US';

    dataLayer.push({
      cms: 'bigcommerce',
      brand: gtm_brand,
      countryCode: gtm_countryCode,
    });

    const isDevHostname =
      /^(.+?\.)?(.*(stage|staging|beta|test).*|mybigcommerce\.com|platformsh\.site|localhost|local|(\d{1,3}\.){3}\d{1,3})$/i;
    let gtm_id = 'GTM-TRN8MB9P';

    if (isDevHostname.test(hostname)) {
      gtm_id = 'GTM-P9MM6ZN6';
    }

    if (!gtm_id) {
      console.error('No GTM ID found');
      return;
    }

    (function (w: Window & { [key: string]: any[] }, d: Document, s: string, l: string, i: string) {
      w[l] = w[l] || [];
      w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      const f = d.getElementsByTagName(s)[0];
      const j = d.createElement(s) as HTMLScriptElement;
      const dl = l !== 'dataLayer' ? '&l=' + l : '';
      j.async = true;
      j.src = `https://www.googletagmanager.com/gtm.js?id=${i}${dl}`;
      j.setAttribute('data-cookieconsent', 'ignore');
      j.setAttribute('data-ot-ignore', '');
      j.classList.add('optanon-category-C0001');
      if (f && f.parentNode) {
        f.parentNode.insertBefore(j, f);
      }
    })(
      window as unknown as Window & { [key: string]: any[] },
      document,
      'script',
      'dataLayer',
      gtm_id,
    );
  }, []);

  return null;
}
