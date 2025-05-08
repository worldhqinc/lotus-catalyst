import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PropsWithChildren } from 'react';

import { SidebarMenu } from '@/vibes/soul/sections/sidebar-menu';
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
              { href: '/policies/privacy-policy', label: t('privacyPolicy') },
              { href: '/policies/terms-of-service', label: t('termsOfService') },
              { href: '/policies/cookie-policy', label: t('cookiePolicy') },
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
