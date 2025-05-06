import { Metadata } from 'next';

import { PageContentEntries } from '~/components/contentful/page-content-entries';
import { faqListSchema } from '~/contentful/schema';

import { getPageBySlug } from '../[...rest]/page-data';

import { FaqSidebar } from './_components/faq-sidebar';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('pageStandard', ['faqs']);

  return {
    title: page.fields.metaTitleSeo,
    description: page.fields.metaDescription,
  };
}

export default async function FaqsPage() {
  const page = await getPageBySlug('pageStandard', ['faqs']);

  const faqCategories =
    page.fields.pageContent
      ?.filter((entry) => entry.sys.contentType.sys.id === 'faqList')
      .map((entry) => {
        const data = faqListSchema.parse(entry);

        return {
          category: data.fields.faqParentCategory,
          id: data.sys.id,
        };
      }) || [];

  return (
    <div>
      <section className="py-16 text-center">
        <h1 className="text-4xl font-medium">Frequently Asked Questions</h1>
      </section>
      <div className="container">
        <div className="grid lg:grid-cols-12">
          <FaqSidebar categories={faqCategories} />
          <div className="lg:col-span-7 lg:col-start-5 [&_>div]:flex [&_>div]:flex-col [&_>div]:gap-12">
            <PageContentEntries pageContent={page.fields.pageContent} />
          </div>
        </div>
      </div>
    </div>
  );
}
