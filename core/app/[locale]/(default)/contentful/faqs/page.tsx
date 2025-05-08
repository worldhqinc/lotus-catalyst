import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { Metadata } from 'next';
import { z } from 'zod';

import { PageContentEntries } from '~/components/contentful/page-content-entries';
import { faqListSchema, faqSchema } from '~/contentful/schema';

import { getPageBySlug } from '../[...rest]/page-data';

import { FaqSearch } from './_components/faq-search';
import { FaqSidebar } from './_components/faq-sidebar';

type ContentfulEntry = {
  sys: {
    contentType: {
      sys: {
        id: string;
      };
    };
    id: string;
  };
  fields: Record<string, unknown>;
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('pageStandard', ['faqs']);

  return {
    title: page.fields.metaTitleSeo,
    description: page.fields.metaDescription,
  };
}

export default async function FaqsPage({ searchParams }: { searchParams: { search?: string } }) {
  const page = await getPageBySlug('pageStandard', ['faqs']);
  const searchTerm = searchParams.search?.toLowerCase() || '';

  const faqCategories =
    page.fields.pageContent
      ?.filter((entry: ContentfulEntry) => entry.sys.contentType.sys.id === 'faqList')
      .map((entry: ContentfulEntry) => {
        const data = faqListSchema.parse(entry);
        const faqCategory =
          data.fields.faqReference[0]?.fields.faqCategory?.[0]?.fields.faqCategoryName;

        return {
          category: data.fields.faqParentCategory,
          id: data.sys.id,
          faqCategory,
        };
      }) || [];

  // Gets the first FAQ category to use as the header
  const faqCategoryHeader = faqCategories[0]?.faqCategory || '';

  // Filters the page content based on search term
  const filteredPageContent = page.fields.pageContent?.filter((entry: ContentfulEntry) => {
    if (entry.sys.contentType.sys.id !== 'faqList') return true;

    const data = faqListSchema.parse(entry);

    if (!searchTerm) return true;

    const categoryMatches = data.fields.faqParentCategory.toLowerCase().includes(searchTerm);

    const faqMatches = data.fields.faqReference.some((faqRef: ContentfulEntry) => {
      const faqData = faqSchema.parse(faqRef);
      const question = faqData.fields.question.toLowerCase() || '';
      const answer = documentToHtmlString(faqData.fields.answer).toLowerCase();

      return question.includes(searchTerm) || answer.includes(searchTerm);
    });

    return categoryMatches || faqMatches;
  });

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
            <FaqSearch />
            <FaqSidebar categories={faqCategories} faqCategoryHeader={faqCategoryHeader} />
          </div>
          <div className="lg:col-span-7 lg:col-start-5 [&_>div]:flex [&_>div]:flex-col [&_>div]:gap-12">
            <PageContentEntries pageContent={filteredPageContent} searchParams={searchParams} />
          </div>
        </div>
      </div>
    </div>
  );
}
