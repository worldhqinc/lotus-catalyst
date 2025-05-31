import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { Image } from '~/components/image';
import { ctaSchema, highlights } from '~/contentful/schema';
import { ensureImageUrl, getLinkHref } from '~/lib/utils';
import BrandArtwork from '~/public/images/Lotus-Pattern.svg';

export function Highlights({
  pageAnchor,
  title,
  image,
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
    <SectionLayout
      {...(pageAnchor && { id: pageAnchor })}
      className="bg-surface-secondary scroll-mt-32 !overflow-auto"
    >
      <div className="mb-8 flex flex-col items-center gap-4 lg:mb-16">
        <h2 className="text-icon-primary text-4xl">{title}</h2>
      </div>
      <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:gap-6">
        <div className="bg-primary relative isolate flex flex-col overflow-hidden rounded-lg p-4 lg:p-8 xl:aspect-4/3">
          <Image
            alt="Lotus Pattern"
            className="absolute inset-0 -z-10 h-full w-full object-cover"
            height={1000}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            src={BrandArtwork}
            width={1000}
          />
          <div className="h-full">
            <div className="flex h-full flex-col justify-between gap-2">
              <div className="grid grid-cols-[auto_1fr] gap-x-1">
                <span className="text-background font-heading text-4xl lg:text-5xl lg:leading-[120%]">
                  “
                </span>
                <p className="text-background font-heading text-4xl lg:text-5xl lg:leading-[120%]">
                  {quoteText}
                  <span className="text-background font-heading text-4xl lg:text-5xl lg:leading-[120%]">
                    ”
                  </span>
                </p>
              </div>
              <div className="mt-auto flex flex-col justify-self-end pt-5">
                {quoteAuthorImage ? (
                  <div className="bg-surface-image mb-8 aspect-square w-20 overflow-hidden rounded-full">
                    <Image
                      alt={quoteAuthorImage.fields.title || quoteAuthorName || ''}
                      className="h-full w-full object-cover"
                      height={quoteAuthorImage.fields.file.details.image?.height || 400}
                      src={ensureImageUrl(quoteAuthorImage.fields.file.url)}
                      width={quoteAuthorImage.fields.file.details.image?.width || 600}
                    />
                  </div>
                ) : null}
                <p className="text-background font-medium">{quoteAuthorName},</p>
                <p className="text-background font-medium">{quoteAuthorTitle}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-contrast-200 relative isolate flex aspect-square h-full w-full flex-col justify-end overflow-hidden rounded-lg p-4 lg:aspect-4/3 lg:p-8">
          {image && (
            <Image
              alt={image.fields.title || ''}
              className="absolute inset-0 -z-10 h-full w-full object-cover"
              height={image.fields.file.details.image?.height || 400}
              src={ensureImageUrl(image.fields.file.url)}
              width={image.fields.file.details.image?.width || 600}
            />
          )}
          <div>
            <ButtonLink href={linkHref}>{text}</ButtonLink>
          </div>
        </div>
      </div>
    </SectionLayout>
  );
}
