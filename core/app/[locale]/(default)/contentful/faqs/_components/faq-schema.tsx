import { faqListSchema, faqSchema } from '~/contentful/schema';
import { generateHtmlFromRichText } from '~/lib/utils';

interface ContentfulEntry {
  sys: {
    contentType: {
      sys: {
        id: string;
      };
    };
    id: string;
  };
  fields: Record<string, unknown>;
}

interface FaqSchemaType {
  '@context': string;
  '@type': string;
  mainEntity: Array<{
    '@type': string;
    name: string;
    acceptedAnswer: {
      '@type': string;
      text: string;
    };
  }>;
}

export function generateFaqSchema(pageContent: ContentfulEntry[]): FaqSchemaType {
  const faqLists = pageContent.filter((entry) => entry.sys.contentType.sys.id === 'faqList');

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqLists.flatMap((entry) => {
      const data = faqListSchema.parse(entry);

      return data.fields.faqReference.map((faqRef: ContentfulEntry) => {
        const faqData = faqSchema.parse(faqRef);

        return {
          '@type': 'Question',
          name: faqData.fields.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: generateHtmlFromRichText(faqData.fields.answer),
          },
        };
      });
    }),
  };
}

export const FaqSchema = ({ pageContent }: { pageContent: ContentfulEntry[] }) => {
  const schema = generateFaqSchema(pageContent);

  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      type="application/ld+json"
    />
  );
};
