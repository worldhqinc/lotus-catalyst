'use client';

import { ArrowRight } from 'lucide-react';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { cta as CtaEntry } from '~/contentful/schema';
import { getLinkHref } from '~/lib/utils';

export interface ContentfulCtaProps {
  cta?: CtaEntry | null;
}

export default function ContentfulCta({ cta }: ContentfulCtaProps) {
  if (!cta?.fields.text) {
    return null;
  }

  const { text } = cta.fields;

  const linkHref = getLinkHref(cta.fields);

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
