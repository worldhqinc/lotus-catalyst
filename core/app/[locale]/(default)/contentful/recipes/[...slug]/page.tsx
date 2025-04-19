import { ProductCard } from '@/vibes/soul/primitives/product-card';
import { richTextFromMarkdown } from '@contentful/rich-text-from-markdown';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { BLOCKS, Document as RichDocument } from '@contentful/rich-text-types';
import { Mail, Printer } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import { SearchParams } from 'nuqs';

import { Badge } from '@/vibes/soul/primitives/badge';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { authorSchema } from '~/contentful/schema';
import { ensureImageUrl } from '~/lib/utils';
import { getPageBySlug } from '../../[...rest]/page-data';

interface Props {
  params: Promise<{ locale: string; slug: string[] }>;
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug('recipe', ['recipes', ...slug]);

  const { fields } = page;

  return {
    title: fields.metaTitle || fields.recipeName,
    description: fields.metaDescription,
  };
}

export default async function RecipePage({ params }: Props) {
  const { slug } = await params;
  const page = await getPageBySlug('recipe', ['recipes', ...slug]);

  const { fields } = page;

  // Parse author entry if present
  const authorEntry = fields.author ? authorSchema.parse(fields.author) : null;
  const authorName = authorEntry?.fields.authorName;
  const authorImage = authorEntry?.fields.authorImage;

  // Render markdown for short description
  const shortDescDoc = fields.shortDescription
    ? await richTextFromMarkdown(fields.shortDescription)
    : null;
  const shortDescHtml = shortDescDoc ? documentToHtmlString(shortDescDoc) : '';

  // Featured Hero Image
  const featuredImage = fields.featuredImage;

  // Render rich text fields to HTML
  // Construct Rich Text Document for directions
  const directionsDoc: RichDocument = {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: (fields.recipeDirections as any) ?? [],
  };
  const directionsHtml = documentToHtmlString(directionsDoc);
  // Construct Rich Text Document for pro tip
  const proTipDoc: RichDocument = {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: (fields.testKitchenTips as any) ?? [],
  };
  const proTipHtml = documentToHtmlString(proTipDoc);

  return (
    <article>
      {/* Hero Section */}
      <div className="bg-primary relative">
        <div className="bg-background absolute inset-0 bottom-1/3 z-0" />
        <SectionLayout className="relative z-10">
          <div className="grid grid-cols-1 items-center gap-8 xl:grid-cols-2">
            <div>
              {/* Category Pill */}
              {fields.mealTypeCategory?.[0] && (
                <Badge shape="pill" className="mb-4">
                  {fields.mealTypeCategory[0]}
                </Badge>
              )}

              {/* Title */}
              <h1 className="font-[family-name:var(--font-family-heading)] text-5xl leading-tight">
                {fields.recipeName}
              </h1>

              {/* Meta Info */}
              <div className="text-contrast-500 mt-2 flex items-center text-sm">
                {authorEntry && <span>Recipe by {authorName}</span>}
                {authorEntry && fields.cookTime && <span className="mx-2">•</span>}
                {fields.cookTime && <span>Total Time {fields.cookTime}</span>}
              </div>

              {/* Description */}
              {fields.shortDescription && (
                <div
                  className="prose text-contrast-500 mt-4 max-w-none"
                  dangerouslySetInnerHTML={{ __html: shortDescHtml }}
                />
              )}

              {fields.applianceTypeCategory?.length && (
                <p className="text-primary text-sm">
                  Ideal for: {fields.applianceTypeCategory.join(', ')}
                </p>
              )}
            </div>

            {/* Hero Image */}
            {featuredImage && (
              <div>
                <Image
                  src={ensureImageUrl(featuredImage.fields.file.url)}
                  alt={featuredImage.fields.title || ''}
                  width={600}
                  height={400}
                  className="rounded-lg object-cover shadow-lg"
                />
              </div>
            )}
          </div>
        </SectionLayout>
      </div>

      {/* Social Share Section */}
      <SectionLayout>
        <div className="mb-6 flex justify-center space-x-6">
          <a href="#" className="text-contrast-500 hover:text-foreground transition">
            <Mail size={20} aria-label="Share via Email" />
          </a>
          <a href="#" className="text-contrast-500 hover:text-foreground transition">
            <Printer size={20} aria-label="Print recipe" />
          </a>
        </div>
        <hr className="border-contrast-100 mt-6" />
      </SectionLayout>

      {/* Ingredients Section */}
      <SectionLayout containerSize="md">
        <h2 className="text-lg font-semibold uppercase">Ingredients</h2>
        {fields.numberOfServings && (
          <p className="text-primary mt-2 text-sm uppercase">Serves {fields.numberOfServings}</p>
        )}
        <div className="mt-6">
          {fields.ingredientsLists?.map((list) => {
            const sectionTitle =
              (list.fields.sectionTitle as string) || (list.fields.ingredientsListName as string);
            const items = list.fields.listOfIngredients as string[] | undefined;
            return (
              <div key={list.sys.id}>
                <h3 className="mt-8 text-base font-semibold">{sectionTitle}</h3>
                <ul className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2">
                  {items?.map((item: string) => (
                    <li key={item} className="text-contrast-500 text-sm">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </SectionLayout>

      {/* Equipment Section */}
      <SectionLayout containerSize="md">
        <h2 className="text-lg font-semibold uppercase">What You'll Need</h2>
        <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {fields.additionalImages?.map((asset) => {
            const title = asset.fields.title || 'Unnamed Item';
            const desc = asset.fields.description || '';
            const src = ensureImageUrl(asset.fields.file.url);
            return (
              <ProductCard
                key={asset.sys.id}
                product={{
                  id: asset.sys.id,
                  title,
                  subtitle: desc,
                  image: { src, alt: title },
                  href: '#',
                  price: '$499.95',
                  rating: 4.9,
                }}
                colorScheme="light"
              />
            );
          })}
        </div>
      </SectionLayout>

      {/* Directions Section */}
      <SectionLayout containerSize="md">
        <h2 className="text-lg font-semibold uppercase">Directions</h2>
        <div
          className="prose text-contrast-500 mt-4 max-w-none"
          dangerouslySetInnerHTML={{ __html: directionsHtml }}
        />
      </SectionLayout>

      {/* Variations Section */}
      <SectionLayout containerSize="md">
        <h2 className="text-primary text-lg font-semibold uppercase">Variations</h2>
        <div className="prose text-contrast-500 mt-4 max-w-none">TODO: render variations here</div>
      </SectionLayout>

      {/* Pro Tip Section */}
      <SectionLayout containerSize="md">
        <h2 className="text-primary text-lg font-semibold uppercase">Pro Tip</h2>
        <div
          className="prose text-contrast-500 mt-4 max-w-none"
          dangerouslySetInnerHTML={{ __html: proTipHtml }}
        />
      </SectionLayout>
    </article>
  );
}
