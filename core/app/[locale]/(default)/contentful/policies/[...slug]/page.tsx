import { Metadata } from 'next';

import { generateHtmlFromRichText, getHreflangAlternates } from '~/lib/utils';

import { getPageBySlug } from '../../[...rest]/page-data';

interface Props {
  params: Promise<{ locale: string; slug: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const alternates = getHreflangAlternates(['policies', ...slug], locale);
  const page = await getPageBySlug('pageStandard', ['policies', ...slug]);
  const { fields } = page;

  return {
    title: fields.metaTitle || fields.pageName,
    description: fields.metaDescription,
    keywords: fields.metaKeywords,
    alternates,
  };
}

export default async function PoliciesPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPageBySlug('pageStandard', ['policies', ...slug]);
  const { fields } = page;

  return (
    <div>
      <h2 className="text-2xl leading-[120%] md:text-4xl md:leading-[120%]">{fields.pageName}</h2>
      {fields.optionalPageDescription && (
        <div
          className="prose policy-table [&_>_p:first-child]:text-foreground mt-4 max-w-none [&_h3:first-child]:mt-8"
          dangerouslySetInnerHTML={{
            __html: generateHtmlFromRichText(fields.optionalPageDescription),
          }}
        />
      )}
    </div>
  );
}
