import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { SiFacebook, SiPinterest, SiX } from '@icons-pack/react-simple-icons';
import { Mail, Printer } from 'lucide-react';
import type { Metadata } from 'next';
import { SearchParams } from 'nuqs';

import { Badge } from '@/vibes/soul/primitives/badge';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { ProductCarousel } from '~/components/contentful/carousels/product-carousel';
import { Image } from '~/components/image';
import { carouselProductSchema } from '~/contentful/schema';

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
    title: fields.title,
    description: fields.subtitle,
  };
}

export default async function FeaturePage({ params }: Props) {
  const { slug } = await params;
  const page = await getPageBySlug('feature', ['features', ...slug]);
  const { fields } = page;

  const storyHtml = fields.story ? documentToHtmlString(fields.story) : '';

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
          className="h-auto w-full object-cover"
          height={featuredImage.fields.file.details.image?.height ?? 0}
          src={`https:${featuredImage.fields.file.url}`}
          width={featuredImage.fields.file.details.image?.width ?? 0}
        />
      )}

      {/* Feature Header */}
      <SectionLayout className="mx-auto max-w-2xl text-center">
        {fields.categories?.map((category) => <Badge key={category}>{category}</Badge>)}
        <h1 className="font-heading mt-8 text-4xl font-medium uppercase">{fields.title}</h1>
        {fields.subtitle ? (
          <p className="prose [&_p]:text-icon-secondary mt-6 max-w-none">{fields.subtitle}</p>
        ) : null}
      </SectionLayout>
      <div className="mx-auto flex max-w-2xl justify-center space-x-4">
        <a className="text-icon-secondary hover:text-icon-default" href="/">
          <SiFacebook className="h-6 w-6" title="Facebook" />
        </a>
        <a className="text-icon-secondary hover:text-icon-default" href="/">
          <SiX className="h-6 w-6" title="X" />
        </a>
        <a className="text-icon-secondary hover:text-icon-default" href="/">
          <SiPinterest className="h-6 w-6" title="Pinterest" />
        </a>
        <a className="text-icon-secondary hover:text-icon-default" href="/">
          <Mail className="h-6 w-6" />
        </a>
        <a className="text-icon-secondary hover:text-icon-default" href="/">
          <Printer className="h-6 w-6" />
        </a>
      </div>
      {/* Story Content */}
      <SectionLayout className="mx-auto max-w-2xl">
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: storyHtml }} />
      </SectionLayout>

      {/* Product Carousel */}
      {productCarousel && <ProductCarousel carousel={productCarousel} />}
    </article>
  );
}
