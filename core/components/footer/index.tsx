import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { getTranslations } from 'next-intl/server';
import { cache, JSX } from 'react';

import { Streamable } from '@/vibes/soul/lib/streamable';
import { Footer as FooterSection } from '@/vibes/soul/sections/footer';
import {
  Facebook,
  Instagram,
  Pinterest,
  X,
  Youtube,
} from '@/vibes/soul/sections/footer/social-icons';
import { GetLinksAndSectionsQuery, LayoutQuery } from '~/app/[locale]/(default)/page-data';
import { getSessionCustomerAccessToken } from '~/auth';
import { client } from '~/client';
import { readFragment } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';
import { logoTransformer } from '~/data-transformers/logo-transformer';

import { subscribe } from '../subscribe/_actions/subscribe';

import { FooterFragment, FooterSectionsFragment } from './fragment';

const socialIcons: Record<string, { icon: JSX.Element }> = {
  Facebook: { icon: <Facebook /> },
  Twitter: { icon: <X /> },
  X: { icon: <X /> },
  Pinterest: { icon: <Pinterest /> },
  Instagram: { icon: <Instagram /> },
  YouTube: { icon: <Youtube /> },
};

const getFooterSections = cache(async (customerAccessToken?: string) => {
  const { data: response } = await client.fetch({
    document: GetLinksAndSectionsQuery,
    customerAccessToken,
    // Since this query is needed on every page, it's a good idea not to validate the customer access token.
    // The 'cache' function also caches errors, so we might get caught in a redirect loop if the cache saves an invalid token error response.
    validateCustomerAccessToken: false,
    fetchOptions: customerAccessToken ? { cache: 'no-store' } : { next: { revalidate } },
  });

  return readFragment(FooterSectionsFragment, response).site;
});

const getFooterData = cache(async () => {
  const { data: response } = await client.fetch({
    document: LayoutQuery,
    fetchOptions: { next: { revalidate } },
  });

  return readFragment(FooterFragment, response).site;
});

export const Footer = async () => {
  const t = await getTranslations('Components.Footer');

  const data = await getFooterData();

  const logo = data.settings ? logoTransformer(data.settings) : '';

  const copyright = `© ${new Date().getFullYear()} ${data.settings?.storeName}`;

  const contactInformation = data.settings?.contact
    ? {
        address: data.settings.contact.address,
        phone: data.settings.contact.phone,
      }
    : undefined;

  const socialMediaLinks = data.settings?.socialMediaLinks
    .filter((socialMediaLink) => Boolean(socialIcons[socialMediaLink.name]))
    .map((socialMediaLink) => ({
      href: socialMediaLink.url,
      icon: socialIcons[socialMediaLink.name]?.icon,
      label: socialMediaLink.name,
    }));

  const streamableSections = Streamable.from(async () => {
    const customerAccessToken = await getSessionCustomerAccessToken();

    const sectionsData = await getFooterSections(customerAccessToken);

    return [
      {
        title: t('categories'),
        links: sectionsData.categoryTree.map((category) => ({
          label: category.name,
          href: category.path,
        })),
      },
      {
        title: t('brands'),
        links: removeEdgesAndNodes(sectionsData.brands).map((brand) => ({
          label: brand.name,
          href: brand.path,
        })),
      },
      {
        title: t('navigate'),
        links: removeEdgesAndNodes(sectionsData.content.pages).map((page) => ({
          label: page.name,
          href: page.__typename === 'ExternalLinkPage' ? page.link : page.path,
        })),
      },
    ];
  });

  return (
    <FooterSection
      action={subscribe}
      contactInformation={contactInformation}
      contactTitle={t('contactUs')}
      copyright={copyright}
      logo={logo}
      logoHref="/"
      logoLabel={t('home')}
      sections={streamableSections}
      socialMediaLinks={socialMediaLinks}
    />
  );
};
