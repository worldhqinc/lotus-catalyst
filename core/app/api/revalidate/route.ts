import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export function GET(request: NextRequest) {
  const secret = request.headers.get('X-Revalidate-Secret');
  const id = request.nextUrl.searchParams.get('id');
  const contentType = request.nextUrl.searchParams.get('contentType');
  const path = request.nextUrl.searchParams.get('path');
  const sku = request.nextUrl.searchParams.get('sku');

  if (secret !== process.env.CONTENTFUL_WEBHOOK_SECRET) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  if (!path) {
    return NextResponse.json({ message: 'Path parameter is required' }, { status: 400 });
  }

  try {
    revalidatePath(path);

    revalidateTag(`contentful:${id}`);
    revalidateTag(`contentful:${sku}`);
    revalidateTag(`contentful:${contentType}`);
    revalidateTag(`contentful:${contentType}:${path}`);

    return NextResponse.json({
      revalidated: true,
      message: `Path ${path} revalidated successfully`,
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
