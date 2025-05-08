import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { Image } from '~/components/image';
import { ctaSchema, highlights } from '~/contentful/schema';
import { ensureImageUrl, getLinkHref } from '~/lib/utils';

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
        <div className="bg-primary rounded-lg p-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col justify-between gap-2">
              <p className="text-background font-heading text-3xl">“{quoteText}”</p>
              <div className="flex flex-col pt-50">
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
        <div className="bg-contrast-200 flex flex-col justify-end rounded-lg p-8">
          <div>
            <ButtonLink href={linkHref}>{text}</ButtonLink>
          </div>
        </div>
      </div>
    </SectionLayout>
  );
}
