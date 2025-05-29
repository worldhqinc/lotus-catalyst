import { richTextFromMarkdown } from '@contentful/rich-text-from-markdown';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { SearchParams } from 'nuqs';

import { Badge } from '@/vibes/soul/primitives/badge';
import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { ProductCarousel } from '~/components/contentful/carousels/product-carousel';
import SocialShare from '~/components/contentful/sections/social-share';
import { Image } from '~/components/image';
import { WistiaPlayer } from '~/components/wistia-player';
import { carouselProductSchema } from '~/contentful/schema';
import { ensureImageUrl, generateHtmlFromRichText } from '~/lib/utils';

import { getPageBySlug } from '../../[...rest]/page-data';

interface Props {
  params: Promise<{ locale: string; slug: string[] }>;
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug('tutorial', ['tutorials', ...slug]);
  const { fields } = page;

  return {
    title: fields.metaTitle || fields.title,
    description: fields.metaDescription,
    keywords: fields.metaKeywords,
    openGraph: {
      images: [
        {
          url: ensureImageUrl(
            fields.featuredImage?.fields.file.url ?? '/images/lotus-social-share.jpg',
          ),
          alt: fields.metaTitle || fields.title,
        },
      ],
    },
  };
}

export default async function FeaturePage({ params }: Props) {
  const { slug } = await params;
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const fullUrl = `${protocol}://${host}/tutorials/${slug.join('/')}`;
  const page = await getPageBySlug('tutorial', ['tutorials', ...slug]);
  const { fields } = page;
  const storyRichText = await richTextFromMarkdown(fields.content ?? '');
  const storyHtml = generateHtmlFromRichText(storyRichText);
  const productCarousel = fields.productCarousel
    ? carouselProductSchema.parse(fields.productCarousel)
    : null;
  const featuredImage = fields.featuredImage;

  return (
    <article>
      {featuredImage && (
        <Image
          alt={featuredImage.fields.title ?? fields.title}
          className="h-auto max-h-[480px] w-full object-cover"
          height={featuredImage.fields.file.details.image?.height ?? 0}
          src={`https:${featuredImage.fields.file.url}`}
          width={featuredImage.fields.file.details.image?.width ?? 0}
        />
      )}
      <SectionLayout className="text-center" containerClassName="!pb-8" containerSize="md">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {fields.categories?.map((category) => <Badge key={category}>{category}</Badge>)}
        </div>
        <h1 className="font-heading mt-8 text-4xl font-medium uppercase">{fields.title}</h1>
        {fields.subtitle ? (
          <p className="prose [&_p]:text-icon-secondary mt-6 max-w-none">{fields.subtitle}</p>
        ) : null}
      </SectionLayout>
      <div className="mx-auto mb-12 flex w-[min(calc(100%-2rem),672px)] justify-center space-x-4 lg:space-x-8">
        <SocialShare
          media={featuredImage ? `https:${featuredImage.fields.file.url}` : undefined}
          title={fields.title}
          url={fullUrl}
        />
      </div>
      <SectionLayout containerClassName="!py-0" containerSize="md">
        <hr className="border-border" />
      </SectionLayout>
      <SectionLayout containerSize="md">
        {fields.wistiaMediaId ? (
          <div className="tutorial-video relative isolate mb-8 aspect-4/3 h-auto w-full overflow-hidden rounded-lg">
            <WistiaPlayer pageType="tutorial" wistiaMediaId={fields.wistiaMediaId} />
          </div>
        ) : null}
        <div
          className="prose [&_p]:text-surface-foreground max-w-none [&_p]:text-lg"
          dangerouslySetInnerHTML={{ __html: storyHtml }}
        />
      </SectionLayout>
      <SectionLayout containerClassName="!py-0" containerSize="md">
        <hr className="border-border" />
      </SectionLayout>
      <SectionLayout className="mx-auto max-w-2xl">
        <div className="flex items-center justify-center">
          <ButtonLink href="/tutorials" size="medium" variant="tertiary">
            Explore more tutorials
          </ButtonLink>
        </div>
      </SectionLayout>
      {productCarousel && <ProductCarousel carousel={productCarousel} />}
    </article>
  );
}
