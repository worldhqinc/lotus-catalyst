import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { Image } from '~/components/image';
import { ctaSchema, type introSection } from '~/contentful/schema';

export default function IntroSection({ title, subtitle, image, cta }: introSection['fields']) {
  const validCta = cta ? ctaSchema.parse(cta) : null;

  return (
    <div className="bg-white px-8 py-16">
      <div className="grid items-center gap-16 md:grid-cols-2">
        <div className="bg-surface-image aspect-[4/3] w-full overflow-hidden rounded-lg">
          {image && (
            <Image
              alt={image.fields.title || title}
              className="h-full w-full object-cover"
              height={image.fields.file.details.image?.height || 600}
              src={image.fields.file.url}
              width={image.fields.file.details.image?.width || 800}
            />
          )}
        </div>
        <div className="space-y-4">
          <h2 className="text-icon-primary text-4xl">{title}</h2>
          {subtitle ? <p className="text-icon-secondary max-w-xl">{subtitle}</p> : null}
          {validCta && (
            <ButtonLink
              className="mt-8"
              href={validCta.fields.externalLink ?? ''}
              variant="tertiary"
            >
              {validCta.fields.text}
            </ButtonLink>
          )}
        </div>
      </div>
    </div>
  );
}
