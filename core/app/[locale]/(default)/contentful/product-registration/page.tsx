import CookiePreferencesCta from '~/components/cookie-preferences-cta';
import CookiePreferencesNotice from '~/components/cookie-preferences-notice';
import { productFinishedGoodsFieldsSchema } from '~/contentful/schema';
import { contentfulClient } from '~/lib/contentful';

import { ProductRegistrationForm } from './_components/product-registration-form';

export default async function ProductRegistration() {
  const productsData = await contentfulClient.getEntries({
    content_type: 'productFinishedGoods',
    select: ['fields.bcProductReference', 'fields.webCategory'],
    limit: 1000,
  });

  const productTypeOptions: Array<{ label: string; value: string }> = Array.from(
    new Set(
      productsData.items
        .map((item) => {
          const fields = productFinishedGoodsFieldsSchema
            .pick({
              webCategory: true,
            })
            .parse(item.fields);

          return fields.webCategory[0];
        })
        .filter((category): category is string => category !== undefined),
    ),
  ).map((category) => ({
    label: category,
    value: category,
  }));

  productTypeOptions.unshift({ label: 'Select a product type', value: 'null' });

  const modelNumberOptions: Array<{ label: string; value: string }> = Array.from(
    new Set(
      productsData.items.map((item) => {
        const fields = productFinishedGoodsFieldsSchema
          .pick({
            bcProductReference: true,
          })
          .parse(item.fields);

        return fields.bcProductReference;
      }),
    ),
  ).map((reference) => ({
    label: reference,
    value: reference,
  }));

  modelNumberOptions.unshift({ label: 'Select a model number', value: 'null' });

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
      <CookiePreferencesNotice
        message={
          <div className="flex flex-col items-center justify-center pt-10 pb-20">
            <h1 className="font-heading mt-8 mb-6 text-center text-5xl font-normal md:text-6xl">
              Our cookie jar is empty.
            </h1>
            <p className="mb-10 max-w-2xl text-center text-xl text-gray-500">
              If there is no information visible below, please update your cookie preferences to
              include "functional cookies" via Cookie Preferences accessible with the button below
              or in our website footer.
            </p>
            <CookiePreferencesCta label="Update cookie preferences" variant="button" />
          </div>
        }
      />
    </div>
  );
}
