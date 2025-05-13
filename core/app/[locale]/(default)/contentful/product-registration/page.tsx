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

  let productOptions: Array<{ label: string; value: string }> = productsData.items.map((item) => {
    const fields = productFinishedGoodsFieldsSchema
      .pick({
        bcProductReference: true,
      })
      .parse(item.fields);

    return {
      label: fields.bcProductReference,
      value: fields.bcProductReference,
    };
  });

  productOptions.unshift({ label: 'Select a Model Number', value: 'null' });

  productOptions = Array.from(
    new Map(productOptions.map((item) => [item.value, item])).values(),
  ).filter((item) => item.value !== '');

  return (
    <div>
      <div className="py-8 md:py-16">
        <div className="container max-w-[300px] text-center md:max-w-lg lg:max-w-2xl">
          <h1 className="font-heading text-4xl uppercase md:text-6xl">Product Registration</h1>
        </div>
      </div>
      <ProductRegistrationForm productOptions={productOptions} />
      <CookiePreferencesNotice
        message={
          <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
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
