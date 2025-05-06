import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { Search } from 'lucide-react';
import { Metadata } from 'next';

import { Input } from '@/vibes/soul/form/input';
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
      <section className="pt-8 text-center lg:pt-16">
        <div className="container max-w-2xl space-y-6">
          <h1 className="font-heading text-4xl leading-[100%] uppercase md:text-6xl">
            {page.fields.pageName}
          </h1>
          {page.fields.optionalPageDescription && (
            <div
              className="text-contrast-400"
              dangerouslySetInnerHTML={{
                __html: documentToHtmlString(page.fields.optionalPageDescription),
              }}
            />
          )}
        </div>
      </section>
      <div className="container lg:mt-16">
        <div className="grid lg:grid-cols-12 lg:gap-8">
          <div className="sticky top-16 space-y-4 bg-white py-8 lg:top-32 lg:col-span-2 lg:max-h-max lg:space-y-8 lg:py-0">
            {/* TODO: Add Algolia search */}
            <Input
              className="w-full"
              placeholder="Search FAQs..."
              prepend={<Search className="h-4 w-4" />}
              type="search"
            />
            <FaqSidebar categories={faqCategories} />
          </div>
          <div className="lg:col-span-7 lg:col-start-5 [&_>div]:flex [&_>div]:flex-col [&_>div]:gap-12">
            <PageContentEntries pageContent={page.fields.pageContent} />
          </div>
        </div>
      </div>
    </div>
  );
}
