'use client';

import { ArrowRight } from 'lucide-react';

import { Link } from '~/components/link';
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
    <Link className="link flex items-center gap-2" href={linkHref}>
      {text}
      <ArrowRight size={24} strokeWidth={1.4} />
    </Link>
  );
}
