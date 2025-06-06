import { DownloadIcon } from 'lucide-react';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { Image } from '~/components/image';
import { Link } from '~/components/link';
import { DownloadableLink } from '~/components/link/downloadable-link';
import { assetSchema, ctaSchema, ctaSection } from '~/contentful/schema';
import { ensureImageUrl, getLinkHref } from '~/lib/utils';
import BrandArtwork from '~/public/images/Lotus-Pattern.svg';

export function CtaSection({
  sectionTitle,
  sectionSubtitle,
  buttonText,
  buttonLink,
  ctaList,
  variant,
}: ctaSection['fields']) {
  if (variant === 'media-grid') {
    return (
      <SectionLayout className="bg-contrast-100">
        <div className="flex flex-col gap-12 lg:flex-row">
          <div className="flex flex-col gap-2">
            {sectionTitle ? (
              <h2 className="text-surface-foreground text-4xl">{sectionTitle}</h2>
            ) : null}
            {sectionSubtitle ? (
              <p className="text-contrast-400 max-w-xs">{sectionSubtitle}</p>
            ) : null}
          </div>
          <div className="grid flex-1 grid-cols-1 gap-8 md:grid-cols-2">
            {ctaList?.map((cta, index) => {
              const { fields, sys } = ctaSchema.parse(cta);
              const href = getLinkHref(fields);

              const featuredImage = fields.featuredImage
                ? assetSchema.parse(fields.featuredImage)
                : null;
              const file = featuredImage?.fields.file;
              const featuredImageUrl = file?.url;

              const asset = fields.mediaReference ? assetSchema.parse(fields.mediaReference) : null;
              const assetUrl = asset?.fields.file.url;
              const assetFilename = asset?.fields.file.fileName;

              const linkContent = (
                <>
                  <div className="bg-contrast-200 aspect-[1.3333] overflow-hidden rounded">
                    {featuredImageUrl ? (
                      <Image
                        alt={featuredImage?.fields.description ?? fields.text}
                        className="size-full object-cover"
                        height={file.details.image?.height}
                        src={ensureImageUrl(featuredImageUrl)}
                        width={file.details.image?.width}
                      />
                    ) : null}
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-surface-foreground text-xl font-medium">{fields.text}</p>
                    {fields.mediaReference && (
                      <DownloadIcon className="text-surface-foreground h-6 w-6" strokeWidth={1.5} />
                    )}
                  </div>
                </>
              );

              return fields.mediaReference ? (
                <DownloadableLink
                  assetFilename={assetFilename}
                  assetUrl={assetUrl}
                  className="flex flex-col gap-2"
                  href={assetUrl ?? href}
                  key={`${sys.id}-${index}`}
                >
                  {linkContent}
                </DownloadableLink>
              ) : (
                <Link
                  className="flex flex-col gap-2"
                  href={assetUrl ?? href}
                  key={`${sys.id}-${index}`}
                >
                  {linkContent}
                </Link>
              );
            })}
          </div>
        </div>
      </SectionLayout>
    );
  }

  return (
    <SectionLayout className="bg-primary relative isolate overflow-hidden py-24 text-center text-white">
      <Image
        alt="Lotus Pattern"
        className="absolute inset-0 top-1/2 left-1/2 -z-10 h-full w-full -translate-x-1/2 -translate-y-1/2 object-cover"
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        src={BrandArtwork}
      />
      <div className="space-y-4 lg:space-y-6">
        {sectionTitle ? (
          <h2 className="font-heading text-4xl uppercase lg:text-6xl">{sectionTitle}</h2>
        ) : null}
        {sectionSubtitle ? <p className="mx-auto max-w-md">{sectionSubtitle}</p> : null}
      </div>
      {buttonLink ? (
        <ButtonLink className="mt-6 lg:mt-12" href={buttonLink} size="medium" variant="tertiary">
          {buttonText}
        </ButtonLink>
      ) : null}
    </SectionLayout>
  );
}
