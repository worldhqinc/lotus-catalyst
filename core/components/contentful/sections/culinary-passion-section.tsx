import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { Image } from '~/components/image';
import { culinaryPassionSection } from '~/contentful/schema';

export function CulinaryPassionSection({
  sectionTitle,
  sectionText,
  sectionImage,
}: culinaryPassionSection['fields']) {
  return (
    <SectionLayout className="bg-surface-secondary" containerClassName="py-16" containerSize="xl">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div className="bg-surface-image aspect-[1.33] w-full overflow-hidden rounded">
          {sectionImage ? (
            <Image
              alt={sectionImage.fields.title || sectionTitle}
              className="h-auto w-full object-cover"
              height={sectionImage.fields.file.details.image?.height || 400}
              src={sectionImage.fields.file.url}
              width={sectionImage.fields.file.details.image?.width || 600}
            />
          ) : null}
        </div>
        <div>
          <h2 className="text-icon-primary mb-4 text-4xl">{sectionTitle}</h2>
          <p className="text-icon-secondary">{sectionText}</p>
        </div>
      </div>
    </SectionLayout>
  );
}
