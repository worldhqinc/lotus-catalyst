import { richTextFromMarkdown } from '@contentful/rich-text-from-markdown';
import { unstable_cacheTag as cacheTag } from 'next/cache';

import { productFinishedGoodsFieldsSchema, productFormulationLookup } from '~/contentful/schema';
import { contentfulClient } from '~/lib/contentful';
import { generateHtmlFromRichText } from '~/lib/utils';

import { ProductFormulationLookupClient } from './product-formulation-lookup-client';

async function getProductOptions() {
  'use cache';

  cacheTag('contentful');

  const productsData = await contentfulClient.getEntries({
    content_type: 'productFinishedGoods',
    select: ['fields.webProductName', 'fields.bcProductReference'],
    limit: 1000,
  });

  const productOptions: Array<{ label: string; value: string }> = productsData.items.map((item) => {
    const fields = productFinishedGoodsFieldsSchema
      .pick({
        webProductName: true,
        bcProductReference: true,
      })
      .parse(item.fields);

    return {
      label: fields.webProductName,
      value: fields.bcProductReference,
    };
  });

  return productOptions;
}

async function getProductFields(sku: string) {
  'use cache';

  cacheTag('contentful');

  const productData = await contentfulClient.getEntries({
    content_type: 'productFinishedGoods',
    'fields.bcProductReference': sku,
    limit: 1,
  });

  return productFinishedGoodsFieldsSchema.parse(productData.items[0]?.fields);
}

export async function ProductFormulationLookup({
  title,
  disclaimer,
  selectedSku = '',
}: productFormulationLookup['fields'] & { selectedSku?: string }) {
  const disclaimerRichText = disclaimer ? await richTextFromMarkdown(disclaimer) : null;
  const disclaimerHtml = disclaimerRichText ? generateHtmlFromRichText(disclaimerRichText) : '';

  const productOptions = await getProductOptions();

  let selectedProductFields = null;

  if (selectedSku) {
    selectedProductFields = await getProductFields(selectedSku);
  }

  return (
    <ProductFormulationLookupClient
      disclaimerHtml={disclaimerHtml}
      productOptions={productOptions}
      selectedProductFields={selectedProductFields}
      selectedSku={selectedSku}
      title={title ?? ''}
    />
  );
}
