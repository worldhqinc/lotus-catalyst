import { clsx } from 'clsx';
import { ArrowRight } from 'lucide-react';
import { z } from 'zod';

import { Accordion, AccordionItem } from '@/vibes/soul/primitives/accordion';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { Link } from '~/components/link';
import { faqFieldsSchema, faqListFieldsSchema } from '~/contentful/schema';
import { generateHtmlFromRichText } from '~/lib/utils';

interface FaqListProps {
  id?: string;
}

type FaqListFields = z.infer<typeof faqListFieldsSchema>;

export function FaqList({ faqParentCategory, faqReference, id }: FaqListFields & FaqListProps) {
  // Filters out FAQs with unpublished or invalid categories
  const validFaqs = faqReference.filter(() => {
    try {
      return true; // If we can parse the fields, the FAQ is valid
    } catch {
      return false;
    }
  });

  if (validFaqs.length === 0) return null;

  // Get the faqCategory name from the categoryFaq content type
  const categoryName = faqParentCategory;

  return (
    <SectionLayout
      className={clsx(
        id !== 'gg5Z3yjOegetUdutuAXgr'
          ? '[&:first-child_>div]:!pt-0 [&:not(:last-child)_>div]:py-0'
          : '',
      )}
      id={id}
    >
      <div className={clsx(id !== 'gg5Z3yjOegetUdutuAXgr' ? '' : 'space-y-8 @4xl:space-y-16')}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl md:text-4xl">{categoryName}</h2>
          {faqParentCategory === 'Common questions' && (
            <Link className="link flex items-center gap-2" href="/faqs">
              View all FAQ's
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
        <div>
          <Accordion
            className="divide-contrast-200 divide-y"
            collapsible
            defaultValue={validFaqs[0]?.sys.id}
            type="single"
          >
            {validFaqs.map((faq) => {
              const fields = faqFieldsSchema.parse(faq.fields);

              return (
                <AccordionItem
                  className="py-8 [&_button]:py-0"
                  key={faq.sys.id}
                  textTransform="none"
                  title={fields.question}
                  value={faq.sys.id}
                >
                  <div
                    className="prose prose-a:text-primary"
                    dangerouslySetInnerHTML={{
                      __html: generateHtmlFromRichText(fields.answer),
                    }}
                  />
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>
    </SectionLayout>
  );
}
