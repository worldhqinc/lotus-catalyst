import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { Metadata } from 'next';

import { getPageBySlug } from '../../[...rest]/page-data';

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug('pageStandard', ['policies', ...slug]);

  return {
    title: page.fields.metaTitleSeo,
    description: page.fields.metaDescription,
  };
}

export default async function PoliciesPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPageBySlug('pageStandard', ['policies', ...slug]);
  const { fields } = page;

  return (
    <div>
      <h2 className="text-2xl leading-[120%] md:text-4xl md:leading-[120%]">{fields.pageName}</h2>
      <div
        className="prose [&_p:first-child]:text-foreground mt-4 max-w-none [&_h3:first-child]:mt-8"
        dangerouslySetInnerHTML={{
          __html: documentToHtmlString(fields.optionalPageDescription),
        }}
      />
    </div>
  );
}
