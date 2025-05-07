import { richTextFromMarkdown } from '@contentful/rich-text-from-markdown';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

import { productFinishedGoodsFieldsSchema, productFormulationLookup } from '~/contentful/schema';
import { contentfulClient } from '~/lib/contentful';

import {
  ProductFormulationInformation,
  ProductFormulationLookupClient,
} from './product-formulation-lookup-client';

export async function ProductFormulationLookup({
  title,
  disclaimer,
  selectedSku = '',
}: productFormulationLookup['fields'] & { selectedSku?: string }) {
  const disclaimerRichText = disclaimer ? await richTextFromMarkdown(disclaimer) : null;
  const disclaimerHtml = disclaimerRichText ? documentToHtmlString(disclaimerRichText) : '';

  const productsData = await contentfulClient.getEntries({
    content_type: 'productFinishedGoods',
    select: ['fields.productName', 'fields.bcProductReference'],
    limit: 1000,
  });

  const productOptions: Array<{ label: string; value: string }> = productsData.items.map((item) => {
    const fields = productFinishedGoodsFieldsSchema
      .pick({
        productName: true,
        bcProductReference: true,
      })
      .parse(item.fields);

    return {
      label: fields.productName,
      value: fields.bcProductReference,
    };
  });

  let formulationInfo = null;

  if (selectedSku) {
    const res = await contentfulClient.getEntries({
      content_type: 'productFinishedGoods',
      'fields.bcProductReference': selectedSku,
      select: ['fields.productFormulationInformation'],
      limit: 1,
    });

    formulationInfo = res.items[0]?.fields.productFormulationInformation ?? null;
  }

  return (
    <ProductFormulationLookupClient
      disclaimerHtml={disclaimerHtml}
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      formulationInfo={formulationInfo as ProductFormulationInformation}
      productOptions={productOptions}
      selectedSku={selectedSku}
      title={title}
    />
  );
}
