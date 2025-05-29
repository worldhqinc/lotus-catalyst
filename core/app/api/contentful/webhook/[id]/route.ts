import { algoliasearch } from 'algoliasearch';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import {
  featureSchema,
  pageStandardSchema,
  productFinishedGoodsSchema,
  productPartsAndAccessoriesSchema,
  recipeSchema,
  tutorialSchema,
} from '~/contentful/schema';
import { contentfulClient } from '~/lib/contentful';
import { ensureImageUrl } from '~/lib/utils';

// eslint-disable-next-line complexity
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: 'No id provided' }, { status: 400 });
  }

  try {
    if (!verifyWebhookSignature(request)) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    const entry = await contentfulClient.getEntry(id, {
      include: 10,
    });

    const algoliaClient = algoliasearch(
      process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? '',
      process.env.ALGOLIA_ADMIN_API_KEY ?? '',
    );

    let body = {};

    if (entry.sys.contentType.sys.id === 'productFinishedGoods') {
      const parsedEntry = productFinishedGoodsSchema.parse(entry);

      body = {
        href: `/${parsedEntry.fields.pageSlug}`,
        sku: parsedEntry.fields.bcProductReference,
        title: parsedEntry.fields.webProductName,
        subtitle: parsedEntry.fields.webProductNameDescriptor,
        categories: parsedEntry.fields.webCategory,
        productLines: parsedEntry.fields.webProductLine,
        price: getPriceField(parsedEntry.fields.price ?? '0.00', parsedEntry.fields.salePrice),
        priceFloat: parseFloat(parsedEntry.fields.price ?? '0.00'),
        badge: parsedEntry.fields.badge,
        newFlag: parsedEntry.fields.newFlag,
        inStock: Boolean(parsedEntry.fields.inventoryQuantity ?? 0),
        image: {
          src: ensureImageUrl(parsedEntry.fields.featuredImage?.fields.file.url ?? ''),
          alt:
            parsedEntry.fields.featuredImage?.fields.description ??
            parsedEntry.fields.webProductName,
        },
      };
    }

    if (entry.sys.contentType.sys.id === 'productPartsAndAccessories') {
      const parsedEntry = productPartsAndAccessoriesSchema.parse(entry);

      body = {
        href: `/${parsedEntry.fields.pageSlug}`,
        sku: parsedEntry.fields.bcProductReference,
        title: parsedEntry.fields.webProductName,
        subtitle: parsedEntry.fields.webProductNameDescriptor,
        categories: parsedEntry.fields.webCategory,
        productLines: parsedEntry.fields.webProductLine,
        price: getPriceField(parsedEntry.fields.price ?? '0.00', parsedEntry.fields.salePrice),
        priceFloat: parseFloat(parsedEntry.fields.price ?? '0.00'),
        badge: parsedEntry.fields.badge,
        newFlag: parsedEntry.fields.newFlag,
        inStock: Boolean(parsedEntry.fields.inventoryQuantity ?? 0),
        image: {
          src: ensureImageUrl(parsedEntry.fields.featuredImage?.fields.file.url ?? ''),
          alt:
            parsedEntry.fields.featuredImage?.fields.description ??
            parsedEntry.fields.webProductName,
        },
      };
    }

    if (entry.sys.contentType.sys.id === 'pageStandard') {
      const parsedEntry = pageStandardSchema.parse(entry);

      body = {
        href: `/${parsedEntry.fields.pageSlug}`,
        title: parsedEntry.fields.pageName,
        subtitle: parsedEntry.fields.optionalPageDescription,
      };
    }

    if (entry.sys.contentType.sys.id === 'recipe') {
      const parsedEntry = recipeSchema.parse(entry);

      body = {
        href: `/${parsedEntry.fields.pageSlug}`,
        title: parsedEntry.fields.recipeName,
        subtitle: parsedEntry.fields.shortDescription,
        categories: parsedEntry.fields.mealTypeCategory,
        image: {
          src: ensureImageUrl(parsedEntry.fields.featuredImage.fields.file.url),
          alt: parsedEntry.fields.featuredImage.fields.description ?? parsedEntry.fields.recipeName,
        },
      };
    }

    if (entry.sys.contentType.sys.id === 'feature') {
      const parsedEntry = featureSchema.parse(entry);

      body = {
        href: `/${parsedEntry.fields.pageSlug}`,
        title: parsedEntry.fields.title,
        subtitle: parsedEntry.fields.subtitle,
        categories: parsedEntry.fields.categories,
        image: {
          src: ensureImageUrl(parsedEntry.fields.featuredImage?.fields.file.url ?? ''),
          alt: parsedEntry.fields.featuredImage?.fields.description ?? parsedEntry.fields.title,
        },
      };
    }

    if (entry.sys.contentType.sys.id === 'tutorial') {
      const parsedEntry = tutorialSchema.parse(entry);

      body = {
        href: `/${parsedEntry.fields.pageSlug}`,
        title: parsedEntry.fields.title,
        subtitle: parsedEntry.fields.subtitle,
        categories: parsedEntry.fields.categories,
        image: {
          src: ensureImageUrl(parsedEntry.fields.featuredImage?.fields.file.url ?? ''),
          alt: parsedEntry.fields.featuredImage?.fields.description ?? parsedEntry.fields.title,
        },
      };
    }

    try {
      await algoliaClient.addOrUpdateObject({
        indexName: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME ?? '',
        objectID: entry.sys.id,
        body: {
          contentType: entry.sys.contentType.sys.id,
          ...body,
        },
      });

      return NextResponse.json({
        updatedAt: new Date().toISOString(),
        objectID: entry.sys.id,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error adding or updating object in Algolia:', error);

      return NextResponse.json(
        { error: 'Error adding or updating object in Algolia' },
        { status: 500 },
      );
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error processing webhook:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid webhook payload', details: error.errors },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function verifyWebhookSignature(request: NextRequest) {
  const signature = request.headers.get('x-contentful-webhook-secret');

  if (signature !== process.env.CONTENTFUL_WEBHOOK_SECRET) {
    return false;
  }

  return true;
}

function getPriceField(
  price?: string | null,
  salePrice?: string | null,
): string | { type: 'sale'; previousValue: string; currentValue: string } {
  if (!price) {
    return '0.00';
  }

  const priceData = salePrice
    ? {
        type: 'sale' as const,
        previousValue: `$${salePrice}`,
        currentValue: `$${price}`,
      }
    : `$${price}`;

  return priceData;
}
