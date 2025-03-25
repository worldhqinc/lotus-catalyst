import { notFound } from 'next/navigation';
import { SearchParams } from 'nuqs';

import { getPageBySlug, getPages } from '~/lib/contentful';

interface Props {
  params: Promise<{ locale: string; rest: Array<string> }>;
  searchParams: Promise<SearchParams>;
}

export async function generateStaticParams() {
  const pages = await getPages();

  return pages.map((page) => ({
    slug: page.fields.pageSlug,
  }));
}

export default async function CatchAllPage({ params }: Props) {
  const { rest } = await params;
  const page = await getPageBySlug(rest.join('/'));

  if (!page) {
    notFound();
  }

  // eslint-disable-next-line
  const { fields } = page;
  // eslint-disable-next-line
  const pageName = fields?.pageName as string;
  // eslint-disable-next-line
  function extractContentValue(richTextField: any): string {
    // eslint-disable-next-line
    return richTextField?.content?.[0]?.content?.[0]?.value ?? '';
  }
  // eslint-disable-next-line
  const pageDescription = extractContentValue(fields?.optionalPageDescription);

  return (
    <div>
      <h1>{pageName}</h1>
      <div>{pageDescription}</div>
    </div>
  );
}
