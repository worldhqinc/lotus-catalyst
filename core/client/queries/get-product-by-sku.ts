import { PricingFragment } from '../fragments/pricing';
import { graphql } from '../graphql';

export const GetProductBySkuQuery = graphql(
  `
    query GetProductBySkuQuery($sku: String!, $currencyCode: currencyCode) {
      site {
        product(sku: $sku) {
          entityId
          name
          sku
          path
          defaultImage {
            url: urlTemplate(lossy: true)
            altText
          }
          brand {
            name
          }
          ...PricingFragment
        }
      }
    }
  `,
  [PricingFragment],
);
