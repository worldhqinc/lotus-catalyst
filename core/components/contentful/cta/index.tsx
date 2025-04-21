'use client';

import { ArrowRight } from 'lucide-react';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { cta as CtaEntry, pageStandardSchema } from '~/contentful/schema';

export interface ContentfulCtaProps {
  cta?: CtaEntry | null;
}

export default function ContentfulCta({ cta }: ContentfulCtaProps) {
  if (!cta?.fields.text) {
    return null;
  }

  let linkHref = '#';

  const { internalReference, externalLink, text } = cta.fields;

  if (internalReference) {
    const type = internalReference.sys.contentType.sys.id;

    if (type === 'pageStandard') {
      try {
        const page = pageStandardSchema.parse(internalReference);

        linkHref = page.fields.pageSlug ? `/${page.fields.pageSlug}` : '#';
      } catch {
        // parse error, keep default
      }
    } else {
      linkHref = '/not-implemented';
    }
  } else if (externalLink) {
    linkHref = externalLink;
  }

  return (
    <ButtonLink
      className="[&_span]:flex [&_span]:items-center [&_span]:gap-2 [&_span]:font-medium"
      href={linkHref}
      shape="link"
      size="link"
      variant="link"
    >
      {text}
      <ArrowRight size={24} strokeWidth={1.4} />
    </ButtonLink>
  );
}
