import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { ArrowRight } from 'lucide-react';
import { z } from 'zod';

import { Accordion, AccordionItem } from '@/vibes/soul/primitives/accordion';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { Link } from '~/components/link';
import { faqFieldsSchema, faqListFieldsSchema } from '~/contentful/schema';

type FaqListFields = z.infer<typeof faqListFieldsSchema>;

export function FaqList({ faqParentCategory, faqReference }: FaqListFields) {
  return (
    <SectionLayout>
      <div className="mx-auto max-w-2xl md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-center text-2xl font-medium">{faqParentCategory}</h2>
          {faqParentCategory === 'Common questions' && (
            <Link className="link text-primary flex items-center gap-2" href="/faqs">
              View all FAQ's
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
        <div className="mt-16">
          <Accordion
            className="divide-contrast-200 divide-y"
            collapsible
            defaultValue={faqReference[0]?.sys.id}
            type="single"
          >
            {faqReference.map((faq) => {
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
                    dangerouslySetInnerHTML={{
                      __html: documentToHtmlString(fields.answer),
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
