/* eslint-disable react/jsx-no-bind */
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { SignInSection } from '@/vibes/soul/sections/sign-in-section';
import { buildConfig } from '~/build-config/reader';
import { ForceRefresh } from '~/components/force-refresh';
import { getHreflangAlternates } from '~/lib/utils';

import { login } from './_actions/login';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    redirectTo?: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const alternates = getHreflangAlternates(['login'], locale);

  const t = await getTranslations({ locale, namespace: 'Auth.Login' });

  return {
    title: t('title'),
    description:
      'Sign in to your Lotus account. Are you a new customer? Create an account for faster checkout, real-time order tracking, detailed order history, and more.',
    alternates,
  };
}

export default async function Login({ params, searchParams }: Props) {
  const { locale } = await params;
  const { redirectTo = '/account/orders' } = await searchParams;

  setRequestLocale(locale);

  const t = await getTranslations('Auth.Login');

  const vanityUrl = buildConfig.get('urls').vanityUrl;
  const redirectUrl = new URL(redirectTo, vanityUrl);
  const redirectTarget = redirectUrl.pathname + redirectUrl.search;

  return (
    <>
      <ForceRefresh />
      <SignInSection
        action={login.bind(null, { redirectTo: redirectTarget })}
        emailLabel={t('email')}
        forgotPasswordHref="/login/forgot-password"
        forgotPasswordLabel={t('forgotPassword')}
        passwordLabel={t('password')}
        submitLabel={t('cta')}
        title={t('heading')}
      >
        <div className="flex flex-col gap-y-8">
          <h2 className="text-2xl leading-[120%] @5xl:text-4xl">{t('CreateAccount.title')}</h2>
          <div>
            <h3 className="text-xl font-medium">{t('CreateAccount.accountBenefits')}</h3>
            <ul className="text-contrast-400 mt-2 flex list-disc flex-col gap-y-1 ps-4">
              <li>{t('CreateAccount.fastCheckout')}</li>
              <li>{t('CreateAccount.ordersTracking')}</li>
              <li>{t('CreateAccount.ordersHistory')}</li>
              <li>{t('CreateAccount.multipleAddresses')}</li>
              <li>{t('CreateAccount.wishlists')}</li>
            </ul>
          </div>
          <ButtonLink className="@2xl:self-start" href="/register" size="medium" variant="primary">
            {t('CreateAccount.cta')}
          </ButtonLink>
        </div>
      </SignInSection>
    </>
  );
}
