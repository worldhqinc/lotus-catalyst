import { DownloadIcon } from 'lucide-react';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { Link } from '~/components/link';
import { ctaSchema, ctaSection } from '~/contentful/schema';
import { getLinkHref } from '~/lib/utils';

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

              return (
                <div className="flex flex-col gap-2" key={`${sys.id}-${index}`}>
                  <div className="bg-contrast-200 aspect-[1.3333] rounded" />
                  <Link className="flex items-center justify-between gap-4" href={href}>
                    <p className="text-surface-foreground text-xl font-medium">{fields.text}</p>
                    <DownloadIcon className="text-surface-foreground h-6 w-6" strokeWidth={1.5} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </SectionLayout>
    );
  }

  return (
    <SectionLayout className="bg-contrast-200 py-24 text-center">
      {sectionTitle ? (
        <h2 className="text-icon-primary font-heading mb-14 text-6xl uppercase">{sectionTitle}</h2>
      ) : null}
      {buttonLink ? (
        <ButtonLink href={buttonLink} variant="primary">
          {buttonText}
        </ButtonLink>
      ) : null}
    </SectionLayout>
  );
}
