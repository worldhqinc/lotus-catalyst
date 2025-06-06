import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

// TODO: Add recaptcha token
// import { bypassReCaptcha } from '~/lib/bypass-recaptcha';

import { DynamicFormSection } from '@/vibes/soul/sections/dynamic-form-section';
import { formFieldTransformer } from '~/data-transformers/form-field-transformer';
import {
  CUSTOMER_FIELDS_TO_EXCLUDE,
  FULL_NAME_FIELDS,
} from '~/data-transformers/form-field-transformer/utils';
import { exists, getHreflangAlternates } from '~/lib/utils';

import { registerCustomer } from './_actions/register-customer';
import { getRegisterCustomerQuery } from './page-data';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const alternates = getHreflangAlternates(['register'], locale);

  const t = await getTranslations({ locale, namespace: 'Auth.Register' });

  return {
    title: t('title'),
    alternates,
  };
}

export default async function Register({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations('Auth.Register');

  const registerCustomerData = await getRegisterCustomerQuery({
    address: { sortBy: 'SORT_ORDER' },
    customer: { sortBy: 'SORT_ORDER' },
  });

  if (!registerCustomerData) {
    notFound();
  }

  const { addressFields, customerFields } = registerCustomerData;
  // const reCaptcha = await bypassReCaptcha(reCaptchaSettings);

  return (
    <DynamicFormSection
      action={registerCustomer}
      benefits={{
        title: t('AccountBenefits.title'),
        items: [
          t('AccountBenefits.fastCheckout'),
          t('AccountBenefits.ordersTracking'),
          t('AccountBenefits.ordersHistory'),
          t('AccountBenefits.multipleAddresses'),
          t('AccountBenefits.wishlists'),
        ],
      }}
      fields={[
        addressFields
          .filter((field) => FULL_NAME_FIELDS.includes(field.entityId))
          .map(formFieldTransformer)
          .filter(exists),
        ...customerFields
          .filter((field) => !CUSTOMER_FIELDS_TO_EXCLUDE.includes(field.entityId))
          .map(formFieldTransformer)
          .filter(exists),
      ]}
      isRegisterForm
      submitLabel={t('cta')}
      title={t('heading')}
    />
  );
}
