import { richTextFromMarkdown } from '@contentful/rich-text-from-markdown';
import { unstable_cacheTag as cacheTag } from 'next/cache';
import { getLocale, getTranslations } from 'next-intl/server';
import { cache } from 'react';

import { Streamable } from '@/vibes/soul/lib/streamable';
import { HeaderSection } from '@/vibes/soul/sections/header-section';
import { LayoutQuery } from '~/app/[locale]/(default)/page-data';
import { getSessionCustomerAccessToken } from '~/auth';
import { client } from '~/client';
import { graphql, readFragment } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';
import { TAGS } from '~/client/tags';
import { getMinicartItems } from '~/components/minicart/_actions/minicart';
import { routing } from '~/i18n/routing';
import { getCartId } from '~/lib/cart';
import { contentfulClient } from '~/lib/contentful';
import { getPreferredCurrencyCode } from '~/lib/currency';
import { generateHtmlFromRichText, isString } from '~/lib/utils';

import { switchCurrency } from './_actions/switch-currency';
import { HeaderFragment } from './fragment';

const GetCartCountQuery = graphql(`
  query GetCartCountQuery($cartId: String) {
    site {
      cart(entityId: $cartId) {
        entityId
        lineItems {
          totalQuantity
        }
      }
    }
  }
`);

const getCartCount = cache(async (cartId: string, customerAccessToken?: string) => {
  const response = await client.fetch({
    document: GetCartCountQuery,
    variables: { cartId },
    customerAccessToken,
    fetchOptions: {
      cache: 'no-store',
      next: {
        tags: [TAGS.cart],
      },
    },
  });

  return response.data.site.cart?.lineItems.totalQuantity ?? null;
});

const getHeaderData = cache(async () => {
  const { data: response } = await client.fetch({
    document: LayoutQuery,
    fetchOptions: { next: { revalidate } },
  });

  return readFragment(HeaderFragment, response).site;
});

export const Header = async () => {
  const t = await getTranslations('Components.Header');
  const locale = await getLocale();

  const data = await getHeaderData();

  const locales = routing.locales.map((enabledLocales) => ({
    id: enabledLocales,
    label: enabledLocales.toLocaleUpperCase(),
  }));

  const currencies = data.currencies.edges
    ? data.currencies.edges
        // only show transactional currencies for now until cart prices can be rendered in display currencies
        .filter(({ node }) => node.isTransactional)
        .map(({ node }) => ({
          id: node.code,
          label: node.code,
          isDefault: node.isDefault,
        }))
    : [];

  const streamableLinks = Streamable.from(async () => {
    // const customerAccessToken = await getSessionCustomerAccessToken();

    // const categoryTree = await getHeaderLinks(customerAccessToken);

    /**  To prevent the navigation menu from overflowing, we limit the number of categories to 6.
   To show a full list of categories, modify the `slice` method to remove the limit.
   Will require modification of navigation menu styles to accommodate the additional categories.
   */
    // const slicedTree = categoryTree.slice(0, 6);

    // return slicedTree.map(({ name, path, children }) => ({
    //   label: name,
    //   href: path,
    //   groups: children.map((firstChild) => ({
    //     label: firstChild.name,
    //     href: firstChild.path,
    //     links: firstChild.children.map((secondChild) => ({
    //       label: secondChild.name,
    //       href: secondChild.path,
    //     })),
    //   })),
    // }));

    return await Promise.resolve([
      {
        label: 'Shop',
        href: '/shop',
        groups: [
          {
            label: 'Professional Series',
            href: '/shop/professional-series',
            links: [],
            comingSoon: false,
          },
          {
            label: 'Signature Series',
            href: '/shop/signature-series',
            links: [],
            comingSoon: true,
          },
          {
            label: 'Accessories',
            href: '/shop/accessories',
            links: [],
            comingSoon: false,
          },
        ],
      },
      {
        label: 'Explore',
        href: '/professional-series',
      },
      {
        label: 'Inspiration',
        href: '/inspiration',
      },
      {
        label: 'Our Story',
        href: '/our-story',
      },
      {
        label: 'Support',
        href: '/support',
      },
    ]);
  });

  const streamableCartCount = Streamable.from(async () => {
    const cartId = await getCartId();
    const customerAccessToken = await getSessionCustomerAccessToken();

    if (!cartId) {
      return null;
    }

    return getCartCount(cartId, customerAccessToken);
  });

  const streamableActiveCurrencyId = Streamable.from(async (): Promise<string | undefined> => {
    const currencyCode = await getPreferredCurrencyCode();

    const defaultCurrency = currencies.find(({ isDefault }) => isDefault);

    return currencyCode ?? defaultCurrency?.id;
  });

  const streamableCartItems = Streamable.from(async () => {
    return getMinicartItems();
  });

  const streamablePromoCode = Streamable.from(async () => {
    'use cache';

    cacheTag('contentful');

    const entry = await contentfulClient.getEntry('4cNmVukXww5ocaDTQ0agTX');
    const subtitle = entry.fields.subtitle;
    const subtitleRichTextDocument =
      subtitle && isString(subtitle) ? await richTextFromMarkdown(subtitle) : null;
    const subtitleHtml = subtitleRichTextDocument
      ? generateHtmlFromRichText(subtitleRichTextDocument)
      : '';

    return <span dangerouslySetInnerHTML={{ __html: subtitleHtml }} key="promo-banner" />;
  });

  return (
    <HeaderSection
      banner={{
        activeLocaleId: locale,
        children: streamablePromoCode,
        locales,
      }}
      navigation={{
        accountHref: '/login',
        accountLabel: t('Icons.account'),
        cartHref: '/cart',
        cartLabel: t('Icons.cart'),
        links: streamableLinks,
        mobileMenuTriggerLabel: t('toggleNavigation'),
        openSearchPopupLabel: t('Icons.search'),
        cartCount: streamableCartCount,
        cartItems: streamableCartItems,
        activeLocaleId: locale,
        locales,
        currencies,
        activeCurrencyId: streamableActiveCurrencyId,
        currencyAction: switchCurrency,
      }}
    />
  );
};
