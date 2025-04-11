import { z } from 'zod';

import { PageContentFieldSchema } from '../[...rest]/page-data';

import InspirationBento from './sections/inspiration-bento';

export default function PageContentEntries({
  pageContent,
}: {
  pageContent: z.infer<typeof PageContentFieldSchema>['fields']['pageContent'];
}) {
  return (
    <div>
      {Array.isArray(pageContent) &&
        pageContent.map((field) => (
          <div key={field.sys.id}>
            {field.sys.contentType.sys.id === 'button' ? (
              <div key={field.sys.id}>Button Display Component</div>
            ) : null}
            {field.sys.contentType.sys.id === 'faq' ? (
              <div key={field.sys.id}>FAQ Display Component</div>
            ) : null}
            {field.sys.contentType.sys.id === 'inspirationBento' ? (
              <InspirationBento
                cta={field.fields.cta}
                heading={field.fields.heading}
                inspirationCards={field.fields.inspirationCards || []}
                inspirationSlides={field.fields.inspirationSlides || []}
                key={field.sys.id}
                video={field.fields.video}
              />
            ) : null}
          </div>
        ))}
    </div>
  );
}
