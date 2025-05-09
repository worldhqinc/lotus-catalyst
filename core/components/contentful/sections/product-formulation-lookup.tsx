import { richTextFromMarkdown } from '@contentful/rich-text-from-markdown';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

import { productFinishedGoodsFieldsSchema, productFormulationLookup } from '~/contentful/schema';
import { contentfulClient } from '~/lib/contentful';

import { ProductFormulationLookupClient } from './product-formulation-lookup-client';

export async function ProductFormulationLookup({
  title,
  disclaimer,
  selectedSku = '',
}: productFormulationLookup['fields'] & { selectedSku?: string }) {
  const disclaimerRichText = disclaimer ? await richTextFromMarkdown(disclaimer) : null;
  const disclaimerHtml = disclaimerRichText ? documentToHtmlString(disclaimerRichText) : '';

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

  let selectedProductFields = null;

  if (selectedSku) {
    const res = await contentfulClient.getEntries({
      content_type: 'productFinishedGoods',
      'fields.bcProductReference': selectedSku,
      limit: 1,
    });

    selectedProductFields = productFinishedGoodsFieldsSchema.parse(res.items[0]?.fields);
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
