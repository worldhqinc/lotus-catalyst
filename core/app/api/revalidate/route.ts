import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const revalidateSchema = z.object({
  entityId: z.string(),
  pageSlug: z.record(z.string(), z.string()).optional(),
});

export async function POST(request: NextRequest) {
  const secret = request.headers.get('X-Webhook-Secret');

  if (secret !== process.env.CONTENTFUL_WEBHOOK_SECRET) {
    return NextResponse.json({ message: 'Invalid webhook secret' }, { status: 401 });
  }

  const result = revalidateSchema.safeParse(await request.json());

  if (!result.success) {
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
  }

  const { pageSlug } = result.data;

  try {
    revalidateTag('contentful');

    if (pageSlug) {
      revalidatePath(pageSlug['en-US'] ?? '');
    }

    return NextResponse.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: 'Error revalidating',
        error: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
