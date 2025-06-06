import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { ctaSchema, guidingPrincipleSchema, guidingPrinciplesSection } from '~/contentful/schema';
import { getLinkHref } from '~/lib/utils';

export function GuidingPrinciplesSection({
  sectionTitle,
  sectionDescription,
  principles,
  cta,
}: guidingPrinciplesSection['fields']) {
  const validCta = cta ? ctaSchema.parse(cta) : null;

  return (
    <SectionLayout containerSize="xl">
      <h2 className="text-surface-foreground font-heading mx-auto max-w-4xl text-center text-4xl uppercase md:text-6xl">
        {sectionTitle}
      </h2>
      {sectionDescription ? (
        <p className="text-icon-secondary mt-4 text-center text-xl">{sectionDescription}</p>
      ) : null}
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:mt-16 lg:gap-6">
        {principles.map((entry, index) => {
          const principle = guidingPrincipleSchema.parse(entry);
          const { title, description } = principle.fields;

          return (
            <div
              className="border-border rounded-lg border bg-white p-4 text-left md:p-8"
              key={principle.sys.id}
            >
              <div className="text-surface-foreground mb-8 text-xl font-medium">
                {String(index + 1).padStart(2, '0')}
              </div>
              <h3 className="text-surface-foreground mb-2 text-4xl">{title}</h3>
              <p className="text-contrast-400">{description}</p>
            </div>
          );
        })}
      </div>
      {validCta ? (
        <div className="flex justify-center pt-16">
          <ButtonLink href={getLinkHref(validCta.fields)} size="medium" variant="primary">
            {validCta.fields.text}
          </ButtonLink>
        </div>
      ) : null}
    </SectionLayout>
  );
}
