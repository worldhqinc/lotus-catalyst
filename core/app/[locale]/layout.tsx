import { GoogleTagManager } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { clsx } from 'clsx';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { cache, PropsWithChildren } from 'react';

import '../../globals.css';

import { fonts } from '~/app/fonts';
import { CookieNotifications } from '~/app/notifications';
import { Providers } from '~/app/providers';
import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';
import { WebAnalyticsFragment } from '~/components/analytics/fragment';
import WeglotClient from '~/components/weglot-client';
// import { AnalyticsProvider } from '~/components/analytics/provider';
import { routing } from '~/i18n/routing';
import { getToastNotification } from '~/lib/server-toast';

import { SmoothScrolling } from './smooth-scrolling';

const RootLayoutMetadataQuery = graphql(
  `
    query RootLayoutMetadataQuery {
      site {
        settings {
          storeName
          seo {
            pageTitle
            metaDescription
            metaKeywords
          }
          ...WebAnalyticsFragment
        }
      }
      channel {
        entityId
      }
    }
  `,
  [WebAnalyticsFragment],
);

const fetchRootLayoutMetadata = cache(async () => {
  return await client.fetch({
    document: RootLayoutMetadataQuery,
    fetchOptions: { next: { revalidate } },
  });
});

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await fetchRootLayoutMetadata();

  const storeName = data.site.settings?.storeName ?? '';

  const { pageTitle, metaDescription, metaKeywords } = data.site.settings?.seo || {};

  return {
    title: {
      template: `%s - ${storeName}`,
      default: pageTitle || storeName,
    },
    icons: {
      icon: '/favicon.ico', // app/favicon.ico/route.ts
    },
    description: metaDescription,
    keywords: metaKeywords ? metaKeywords.split(',') : null,
    metadataBase: new URL('https://staging.lotuscooking.com'),
    openGraph: {
      images: [
        {
          url: '/images/lotus-social-share.jpg',
          alt: storeName || 'Lotus',
        },
      ],
    },
    other: {
      platform: 'bigcommerce.catalyst',
      build_sha: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? '',
      store_hash: process.env.BIGCOMMERCE_STORE_HASH ?? '',
    },
  };
}

const VercelComponents = () => {
  if (process.env.VERCEL !== '1') {
    return null;
  }

  return (
    <>
      {process.env.DISABLE_VERCEL_ANALYTICS !== 'true' && <Analytics />}
      {process.env.DISABLE_VERCEL_SPEED_INSIGHTS !== 'true' && <SpeedInsights />}
    </>
  );
};

interface Props extends PropsWithChildren {
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({ params, children }: Props) {
  const { locale } = await params;

  // const { data } = await fetchRootLayoutMetadata();
  const toastNotificationCookieData = await getToastNotification();

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  // need to call this method everywhere where static rendering is enabled
  // https://next-intl-docs.vercel.app/docs/getting-started/app-router#add-setRequestLocale-to-all-layouts-and-pages
  setRequestLocale(locale);

  return (
    <html className={clsx(fonts.map((f) => f.variable))} lang={locale}>
      <body className="font-body flex min-h-screen flex-col antialiased [&_[data-radix-popper-content-wrapper]]:!z-20">
        <SmoothScrolling>
          <GoogleTagManager gtmId={`${process.env.NEXT_PUBLIC_GTM_ID}`} />
          <NextIntlClientProvider>
            <WeglotClient />
            <NuqsAdapter>
              {/* <AnalyticsProvider channelId={data.channel.entityId} settings={data.site.settings}> */}
              <Providers>
                {toastNotificationCookieData && (
                  <CookieNotifications {...toastNotificationCookieData} />
                )}
                {children}
              </Providers>
              {/* </AnalyticsProvider> */}
            </NuqsAdapter>
          </NextIntlClientProvider>
          <VercelComponents />
        </SmoothScrolling>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const fetchCache = 'default-cache';
