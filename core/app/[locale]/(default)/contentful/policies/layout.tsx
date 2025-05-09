import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PropsWithChildren } from 'react';

import { SidebarMenu } from '@/vibes/soul/sections/sidebar-menu';
import { CookiePolicyLink } from '@/vibes/soul/sections/sidebar-menu/cookie-policy-link';
import { StickySidebarLayout } from '@/vibes/soul/sections/sticky-sidebar-layout';

interface Props extends PropsWithChildren {
  params: Promise<{ locale: string }>;
}

export default async function Layout({ children, params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations('Policies.Layout');

  return (
    <>
      <section className="py-8 lg:py-16">
        <div className="container text-center">
          <h1 className="font-heading text-4xl leading-[100%] uppercase md:text-6xl">
            {t('title')}
          </h1>
        </div>
      </section>
      <StickySidebarLayout
        className="[&_>div]:py-8 md:[&_>div]:py-16"
        sidebar={
          <SidebarMenu
            links={[
              {
                href: '/policies/privacy-policy',
                label: t('privacyPolicy.label'),
                secondaryLinks: [
                  { href: '/policies/privacy-policy', label: t('privacyPolicy.us') },
                  { href: '/policies/privacy-policy/ca', label: t('privacyPolicy.ca') },
                ],
              },
              { href: '/policies/terms-of-service', label: t('termsOfService') },
              {
                href: '#',
                label: t('cookiePolicy'),
                component: CookiePolicyLink,
              },
              { href: '/policies/accessibility', label: t('accessibility') },
            ]}
          />
        }
        sidebarSize="small"
      >
        {children}
      </StickySidebarLayout>
    </>
  );
}
