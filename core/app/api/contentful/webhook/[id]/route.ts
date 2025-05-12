import { algoliasearch } from 'algoliasearch';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { parse, stringify } from 'flatted';

import { contentfulClient } from '~/lib/contentful';

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

    const algoliaRecord = {
      objectID: entry.sys.id,
      fields: {
        ...entry.fields,
      },
      sys: {
        ...entry.sys,
        contentType: entry.sys.contentType,
      },
    };

    const safeJson = stringify(algoliaRecord);

    console.log('algoliaRecord', parse(safeJson));

    try {
      await algoliaClient.addOrUpdateObject({
        indexName: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME ?? '',
        objectID: entry.sys.id,
        body: parse(safeJson),
      });

      return NextResponse.json({ success: true });
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
