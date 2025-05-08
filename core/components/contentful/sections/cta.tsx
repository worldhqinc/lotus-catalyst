import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { cta } from '~/contentful/schema';
import { getLinkHref } from '~/lib/utils';

export function Cta(fields: cta['fields']) {
  const href = getLinkHref(fields);

  if (!href) return null;

  return (
    <SectionLayout className="text-center" containerSize="lg">
      <ButtonLink href={href} size="medium" variant="tertiary">
        {fields.text}
      </ButtonLink>
    </SectionLayout>
  );
}
