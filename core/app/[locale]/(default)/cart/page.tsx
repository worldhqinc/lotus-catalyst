import { Metadata } from 'next';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { SearchParams } from 'nuqs/server';

import { Cart as CartComponent, CartEmptyState } from '@/vibes/soul/sections/cart';
import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { PageContentEntries } from '~/components/contentful/page-content-entries';
import { getCartId } from '~/lib/cart';
import { getPreferredCurrencyCode } from '~/lib/currency';
import { exists, getHreflangAlternates } from '~/lib/utils';

import { getPageBySlug } from '../contentful/[...rest]/page-data';

import { redirectToCheckout } from './_actions/redirect-to-checkout';
import { updateCouponCode } from './_actions/update-coupon-code';
import { updateLineItem } from './_actions/update-line-item';
import { updateShippingInfo } from './_actions/update-shipping-info';
// import { CartViewed } from './_components/cart-viewed';
import { getCart, getShippingCountries } from './page-data';

const GetAdditionalProductDataQuery = graphql(`
  query GetAdditionalProductData($entityId: Int!, $currencyCode: currencyCode) {
    site {
      product(entityId: $entityId) {
        path
        prices(currencyCode: $currencyCode) {
          price {
            value
            currencyCode
          }
          basePrice {
            value
            currencyCode
          }
        }
        customFields {
          edges {
            node {
              entityId
              name
              value
            }
          }
        }
      }
    }
  }
`);

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: SearchParams;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const alternates = getHreflangAlternates(['cart'], locale);

  const t = await getTranslations({ locale, namespace: 'Cart' });

  return {
    title: t('title'),
    description:
      'An elevated kitchen awaits. Manage your cart, proceed to checkout, and explore personalized recommendations. Cook with calm confidence today.',
    alternates,
  };
}

// eslint-disable-next-line complexity
export default async function Cart({ params, searchParams }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations('Cart');
  const format = await getFormatter();
  const cartId = await getCartId();
  const currencyCode = await getPreferredCurrencyCode();

  if (!cartId) {
    try {
      const page = await getPageBySlug('pageStandard', ['cart-empty']);

      return (
        <PageContentEntries pageContent={page.fields.pageContent} searchParams={searchParams} />
      );
    } catch {
      return (
        <CartEmptyState
          cta={{ label: t('Empty.cta'), href: '/shop/all' }}
          subtitle={t('Empty.subtitle')}
          title={t('Empty.title')}
        />
      );
    }
  }

  const data = await getCart({ cartId });

  const cart = data.site.cart;
  const checkout = data.site.checkout;

  if (!cart) {
    try {
      const page = await getPageBySlug('pageStandard', ['cart-empty']);

      return (
        <PageContentEntries pageContent={page.fields.pageContent} searchParams={searchParams} />
      );
    } catch {
      return (
        <CartEmptyState
          cta={{ label: t('Empty.cta'), href: '/shop/all' }}
          subtitle={t('Empty.subtitle')}
          title={t('Empty.title')}
        />
      );
    }
  }

  const lineItems = [...cart.lineItems.physicalItems, ...cart.lineItems.digitalItems];

  const additionalProductData = await Promise.all(
    lineItems.map(async (item) => {
      const additionalDataResponse = await client.fetch({
        document: GetAdditionalProductDataQuery,
        variables: {
          entityId: item.productEntityId,
          currencyCode,
        },
      });

      return {
        productEntityId: item.productEntityId,
        path: additionalDataResponse.data.site.product?.path,
        prices: additionalDataResponse.data.site.product?.prices,
        customFields: additionalDataResponse.data.site.product?.customFields,
      };
    }),
  );
  const additionalProductDataMap = new Map(
    additionalProductData.map((additionalData) => [additionalData.productEntityId, additionalData]),
  );

  const formattedLineItems = lineItems.map((item) => {
    const additionalData = additionalProductDataMap.get(item.productEntityId);
    const path = additionalData?.path;
    const prices = additionalData?.prices;
    const basePrice = prices?.basePrice?.value;
    const currentPrice = prices?.price.value;
    const customFields = additionalData?.customFields?.edges;
    const webProductNameDescriptor = customFields?.find(
      (field) => field.node.name === 'Web Product Name Descriptor',
    )?.node.value;

    return {
      id: item.entityId,
      quantity: item.quantity,
      price: format.number(item.extendedSalePrice.value, {
        style: 'currency',
        currency: item.extendedSalePrice.currencyCode,
      }),
      basePrice:
        basePrice && currentPrice && basePrice !== currentPrice
          ? format.number(basePrice * item.quantity, {
              style: 'currency',
              currency: prices.basePrice?.currencyCode,
            })
          : undefined,
      subtitle: webProductNameDescriptor ?? '',
      // subtitle: item.selectedOptions
      //   .map((option) => {
      //     switch (option.__typename) {
      //       case 'CartSelectedMultipleChoiceOption':
      //       case 'CartSelectedCheckboxOption':
      //         return `${option.name}: ${option.value}`;

      //       case 'CartSelectedNumberFieldOption':
      //         return `${option.name}: ${option.number}`;

      //       case 'CartSelectedMultiLineTextFieldOption':
      //       case 'CartSelectedTextFieldOption':
      //         return `${option.name}: ${option.text}`;

      //       case 'CartSelectedDateFieldOption':
      //         return `${option.name}: ${format.dateTime(new Date(option.date.utc))}`;

      //       default:
      //         return '';
      //     }
      //   })
      // .join(', '),
      title: item.name,
      image: { src: item.image?.url || '', alt: item.name },
      href: path,
      selectedOptions: item.selectedOptions,
      productEntityId: item.productEntityId,
      variantEntityId: item.variantEntityId,
    };
  });

  const totalCouponDiscount =
    checkout?.coupons.reduce((sum, coupon) => sum + coupon.discountedAmount.value, 0) ?? 0;

  const shippingConsignment =
    checkout?.shippingConsignments?.find((consignment) => consignment.selectedShippingOption) ||
    checkout?.shippingConsignments?.[0];

  const shippingCountries = await getShippingCountries();

  const countries = shippingCountries.map((country) => ({
    value: country.code,
    label: country.name,
  }));

  const statesOrProvinces = shippingCountries.map((country) => ({
    country: country.code,
    states: country.statesOrProvinces.map((state) => ({
      value: state.entityId.toString(),
      label: state.name,
    })),
  }));

  const showShippingForm =
    shippingConsignment?.address && !shippingConsignment.selectedShippingOption;

  return (
    <>
      <CartComponent
        cart={{
          lineItems: formattedLineItems,
          total: format.number(checkout?.grandTotal?.value || 0, {
            style: 'currency',
            currency: cart.currencyCode,
          }),
          totalLabel: t('CheckoutSummary.total'),
          summaryItems: [
            {
              label: t('CheckoutSummary.subTotal'),
              value: format.number(checkout?.subtotal?.value ?? 0, {
                style: 'currency',
                currency: cart.currencyCode,
              }),
            },
            cart.discountedAmount.value > 0
              ? {
                  label: t('CheckoutSummary.discounts'),
                  value: `-${format.number(cart.discountedAmount.value, {
                    style: 'currency',
                    currency: cart.currencyCode,
                  })}`,
                }
              : null,
            totalCouponDiscount > 0
              ? {
                  label: t('CheckoutSummary.CouponCode.couponCode'),
                  value: `-${format.number(totalCouponDiscount, {
                    style: 'currency',
                    currency: cart.currencyCode,
                  })}`,
                }
              : null,
            checkout?.taxTotal && {
              label: t('CheckoutSummary.tax'),
              value: format.number(checkout.taxTotal.value, {
                style: 'currency',
                currency: cart.currencyCode,
              }),
            },
          ].filter(exists),
        }}
        checkoutAction={redirectToCheckout}
        checkoutLabel={t('proceedToCheckout')}
        couponCode={{
          action: updateCouponCode,
          couponCodes: checkout?.coupons.map((coupon) => coupon.code) ?? [],
          ctaLabel: t('CheckoutSummary.CouponCode.apply'),
          label: t('CheckoutSummary.CouponCode.couponCode'),
          removeLabel: t('CheckoutSummary.CouponCode.removeCouponCode'),
        }}
        decrementLineItemLabel={t('decrement')}
        deleteLineItemLabel={t('removeItem')}
        incrementLineItemLabel={t('increment')}
        key={`${cart.entityId}-${cart.version}`}
        lineItemAction={updateLineItem}
        shipping={{
          action: updateShippingInfo,
          countries,
          states: statesOrProvinces,
          address: shippingConsignment?.address
            ? {
                country: shippingConsignment.address.countryCode,
                city:
                  shippingConsignment.address.city !== ''
                    ? (shippingConsignment.address.city ?? undefined)
                    : undefined,
                state:
                  shippingConsignment.address.stateOrProvince !== ''
                    ? (shippingConsignment.address.stateOrProvince ?? undefined)
                    : undefined,
                postalCode:
                  shippingConsignment.address.postalCode !== ''
                    ? (shippingConsignment.address.postalCode ?? undefined)
                    : undefined,
              }
            : undefined,
          shippingOptions: shippingConsignment?.availableShippingOptions
            ? shippingConsignment.availableShippingOptions.map((option) => ({
                label: option.description,
                value: option.entityId,
                price: format.number(option.cost.value, {
                  style: 'currency',
                  currency: checkout?.cart?.currencyCode,
                }),
              }))
            : undefined,
          shippingOption: shippingConsignment?.selectedShippingOption
            ? {
                value: shippingConsignment.selectedShippingOption.entityId,
                label: shippingConsignment.selectedShippingOption.description,
                price: format.number(shippingConsignment.selectedShippingOption.cost.value, {
                  style: 'currency',
                  currency: checkout?.cart?.currencyCode,
                }),
              }
            : undefined,
          showShippingForm,
          shippingLabel: t('CheckoutSummary.Shipping.shipping'),
          addLabel: t('CheckoutSummary.Shipping.add'),
          changeLabel: t('CheckoutSummary.Shipping.change'),
          countryLabel: t('CheckoutSummary.Shipping.country'),
          cityLabel: t('CheckoutSummary.Shipping.city'),
          stateLabel: t('CheckoutSummary.Shipping.state'),
          postalCodeLabel: t('CheckoutSummary.Shipping.postalCode'),
          updateShippingOptionsLabel: t('CheckoutSummary.Shipping.updatedShippingOptions'),
          viewShippingOptionsLabel: t('CheckoutSummary.Shipping.viewShippingOptions'),
          cancelLabel: t('CheckoutSummary.Shipping.cancel'),
          editAddressLabel: t('CheckoutSummary.Shipping.editAddress'),
          shippingOptionsLabel: t('CheckoutSummary.Shipping.shippingOptions'),
          updateShippingLabel: t('CheckoutSummary.Shipping.updateShipping'),
          addShippingLabel: t('CheckoutSummary.Shipping.addShipping'),
          noShippingOptionsLabel: t('CheckoutSummary.Shipping.noShippingOptions'),
        }}
        summaryTitle={t('CheckoutSummary.title')}
        title={t('title')}
      />
      {/* <CartViewed
        currencyCode={cart.currencyCode}
        lineItems={lineItems}
        subtotal={checkout?.subtotal?.value}
      /> */}
    </>
  );
}
