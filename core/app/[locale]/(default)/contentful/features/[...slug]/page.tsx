import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { SearchParams } from 'nuqs';

import { Badge } from '@/vibes/soul/primitives/badge';
import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { ProductCarousel } from '~/components/contentful/carousels/product-carousel';
import SocialShare from '~/components/contentful/sections/social-share';
import { Image } from '~/components/image';
import { carouselProductSchema } from '~/contentful/schema';
import { ensureImageUrl, generateHtmlFromRichText } from '~/lib/utils';

import { getPageBySlug } from '../../[...rest]/page-data';

interface Props {
  params: Promise<{ locale: string; slug: string[] }>;
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug('feature', ['features', ...slug]);
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
  const fullUrl = `${protocol}://${host}/features/${slug.join('/')}`;

  const page = await getPageBySlug('feature', ['features', ...slug]);
  const { fields } = page;

  const storyHtml = fields.story ? generateHtmlFromRichText(fields.story) : '';

  const productCarousel = fields.productCarousel
    ? carouselProductSchema.parse(fields.productCarousel)
    : null;

  const featuredImage = fields.featuredImage;

  return (
    <article>
      {/* Hero Image */}
      {featuredImage && (
        <Image
          alt={featuredImage.fields.title ?? fields.title}
          className="h-auto max-h-[620px] w-full object-cover"
          height={featuredImage.fields.file.details.image?.height ?? 0}
          src={`https:${featuredImage.fields.file.url}`}
          width={featuredImage.fields.file.details.image?.width ?? 0}
        />
      )}

      {/* Feature Header */}
      <SectionLayout className="mx-auto max-w-2xl text-center">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {fields.categories?.map((category) => <Badge key={category}>{category}</Badge>)}
        </div>
        <h1 className="font-heading mt-8 text-4xl font-medium uppercase">{fields.title}</h1>
        {fields.subtitle ? (
          <p className="prose [&_p]:text-icon-secondary mt-6 max-w-none">{fields.subtitle}</p>
        ) : null}
      </SectionLayout>
      <SocialShare
        media={featuredImage ? `https:${featuredImage.fields.file.url}` : undefined}
        title={fields.title}
        url={fullUrl}
      />
      {/* Story Content */}
      <SectionLayout className="mx-auto max-w-2xl">
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: storyHtml }} />
      </SectionLayout>

      <SectionLayout className="mx-auto max-w-2xl">
        <div className="flex items-center justify-center">
          <ButtonLink href="/features" size="medium" variant="tertiary">
            Explore more features
          </ButtonLink>
        </div>
      </SectionLayout>

      {/* Product Carousel */}
      {productCarousel && <ProductCarousel carousel={productCarousel} />}
    </article>
  );
}
