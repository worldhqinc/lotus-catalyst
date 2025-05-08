import CookiePreferencesNotice from '~/components/cookie-preferences-notice';
import { productFinishedGoodsFieldsSchema } from '~/contentful/schema';
import { contentfulClient } from '~/lib/contentful';

import { ProductRegistrationForm } from './_components/product-registration-form';

export default async function ProductRegistration() {
  const productsData = await contentfulClient.getEntries({
    content_type: 'productFinishedGoods',
    select: ['fields.bcProductReference', 'fields.parentCategory'],
    limit: 1000,
  });

  let productTypeOptions: Array<{ label: string; value: string }> = productsData.items.map(
    (item) => {
      const fields = productFinishedGoodsFieldsSchema
        .pick({
          parentCategory: true,
        })
        .parse(item.fields);

      return {
        label: fields.parentCategory?.[0] ?? '',
        value: fields.parentCategory?.[0] ?? '',
      };
    },
  );

  productTypeOptions.unshift({ label: 'Select a Product Type', value: 'null' });

  productTypeOptions = Array.from(
    new Map(productTypeOptions.map((item) => [item.value, item])).values(),
  ).filter((item) => item.value !== '');

  let modelNumberOptions: Array<{ label: string; value: string }> = productsData.items.map(
    (item) => {
      const fields = productFinishedGoodsFieldsSchema
        .pick({
          bcProductReference: true,
        })
        .parse(item.fields);

      return {
        label: fields.bcProductReference,
        value: fields.bcProductReference,
      };
    },
  );

  modelNumberOptions.unshift({ label: 'Select a Model Number', value: 'null' });

  modelNumberOptions = Array.from(
    new Map(modelNumberOptions.map((item) => [item.value, item])).values(),
  ).filter((item) => item.value !== '');

  return (
    <div>
      <div className="py-8 md:py-16">
        <div className="container max-w-[300px] text-center md:max-w-lg lg:max-w-2xl">
          <h1 className="font-heading text-4xl uppercase md:text-6xl">Product Registration</h1>
        </div>
      </div>
      <ProductRegistrationForm
        modelNumberOptions={modelNumberOptions}
        productTypeOptions={productTypeOptions}
      />
      <CookiePreferencesNotice />
    </div>
  );
}
