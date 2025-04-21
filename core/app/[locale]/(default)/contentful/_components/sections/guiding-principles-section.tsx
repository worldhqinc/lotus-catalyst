import { Button } from '@/vibes/soul/primitives/button';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { guidingPrincipleSchema, guidingPrinciplesSection } from '~/contentful/schema';

export default function GuidingPrinciplesSection({
  sectionTitle,
  sectionDescription,
  principles,
}: guidingPrinciplesSection['fields']) {
  return (
    <SectionLayout className="bg-white" containerClassName="py-16" containerSize="xl">
      <h2 className="text-icon-primary text-center text-2xl md:text-4xl">{sectionTitle}</h2>
      {sectionDescription ? (
        <p className="text-icon-secondary mt-4 text-center text-xl">{sectionDescription}</p>
      ) : null}
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        {principles.map((entry, index) => {
          const principle = guidingPrincipleSchema.parse(entry);
          const { title, description } = principle.fields;

          return (
            <div
              className="border-border rounded-lg border bg-white p-8 text-left"
              key={principle.sys.id}
            >
              <div className="font-heading text-primary mb-8 text-6xl uppercase">{index + 1}.</div>
              <h3 className="text-icon-primary mb-2 text-2xl font-medium uppercase">{title}</h3>
              <p className="text-icon-secondary">{description}</p>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center pt-12">
        <Button type="button">Shop our collection</Button>
      </div>
    </SectionLayout>
  );
}
