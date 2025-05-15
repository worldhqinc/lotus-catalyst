import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { Image } from '~/components/image';
import { ctaSchema, highlights } from '~/contentful/schema';
import { ensureImageUrl, getLinkHref } from '~/lib/utils';
import BrandArtwork from '~/public/images/Lotus-Pattern.svg';

export function Highlights({
  title,
  quoteText,
  quoteAuthorImage,
  quoteAuthorName,
  quoteAuthorTitle,
  cta,
}: highlights['fields']) {
  const validatedCta = cta ? ctaSchema.parse(cta) : null;
  const linkHref = validatedCta ? getLinkHref(validatedCta.fields) : '#';
  const text = validatedCta?.fields.text ?? null;

  return (
    <SectionLayout className="bg-surface-secondary">
      <div className="mb-12 flex flex-col items-center gap-4">
        <h2 className="text-icon-primary text-4xl">{title}</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="bg-primary relative isolate overflow-hidden rounded-lg p-4 lg:p-8 xl:aspect-square">
          <Image
            alt="Lotus Pattern"
            className="absolute inset-0 -z-10 h-full w-full object-cover"
            height={1000}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            src={BrandArtwork}
            width={1000}
          />
          <div className="flex h-full flex-col gap-4">
            <div className="flex h-full flex-col justify-between gap-2">
              <p className="text-background font-heading text-4xl lg:text-5xl">“{quoteText}”</p>
              <div className="mt-auto flex flex-col pt-5">
                <div className="bg-surface-image mb-8 aspect-square w-20 overflow-hidden rounded-full">
                  {quoteAuthorImage ? (
                    <Image
                      alt={quoteAuthorImage.fields.title || quoteAuthorName || ''}
                      className="h-full w-full object-cover"
                      height={quoteAuthorImage.fields.file.details.image?.height || 400}
                      src={ensureImageUrl(quoteAuthorImage.fields.file.url)}
                      width={quoteAuthorImage.fields.file.details.image?.width || 600}
                    />
                  ) : null}
                </div>
                <p className="text-background font-medium">{quoteAuthorName},</p>
                <p className="text-background font-medium">{quoteAuthorTitle}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-contrast-200 flex aspect-square h-full w-full flex-col justify-end rounded-lg p-4 lg:p-8">
          <div>
            <ButtonLink href={linkHref}>{text}</ButtonLink>
          </div>
        </div>
      </div>
    </SectionLayout>
  );
}
