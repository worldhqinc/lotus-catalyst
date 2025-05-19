import type { SearchParams } from 'nuqs/server';
import { Fragment } from 'react';

import { ProductCarousel } from '~/components/contentful/carousels/product-carousel';
import {
  blockProductFeaturesAccordionSchema,
  blockProductFeaturesSchema,
  cardSectionSchema,
  carouselProductSchema,
  carouselRecipeSchema,
  carouselSectionSchema,
  communitySectionSchema,
  ctaSchema,
  ctaSectionSchema,
  culinaryPassionSectionSchema,
  faqListSchema,
  featureGridSchema,
  guidingPrinciplesSectionSchema,
  heroBannerSchema,
  heroCarouselSchema,
  heroSectionSchema,
  highlightsSchema,
  inspirationBentoSchema,
  introSectionSchema,
  mediaBannerSchema,
  newsletterFormSchema,
  pageHeaderSupportSchema,
  pageStandard,
  postGridSchema,
  productBentoSchema,
  productFormulationLookupSchema,
  productGridSchema,
  productSupportLinksSchema,
  testimonialsSchema,
} from '~/contentful/schema';

import { RecipeCarousel } from './carousels/recipe-carousel';
import { BlockProductFeatures } from './sections/block-product-features';
import { BlockProductFeaturesAccordion } from './sections/block-product-features-accordion';
import { CardSection } from './sections/card-section';
import { CarouselSection } from './sections/carousel-section';
import { CommunitySection } from './sections/community-section';
import { Cta } from './sections/cta';
import { CtaSection } from './sections/cta-section';
import { CulinaryPassionSection } from './sections/culinary-passion-section';
import { FaqList } from './sections/faq-list';
import { FeatureGrid } from './sections/feature-grid';
import { GuidingPrinciplesSection } from './sections/guiding-principles-section';
import { HeroBanner } from './sections/hero-banner';
import { HeroCarousel } from './sections/hero-carousel';
import { HeroSection } from './sections/hero-section';
import { Highlights } from './sections/highlights';
import { InspirationBento } from './sections/inspiration-bento';
import { IntroSection } from './sections/intro-section';
import { MediaBanner } from './sections/media-banner';
import { NewsletterForm } from './sections/newsletter-form';
import { PageHeaderSupport } from './sections/page-header';
import { PostGrid } from './sections/post-grid';
import { ProductBento } from './sections/product-bento';
import { ProductFormulationLookup } from './sections/product-formulation-lookup';
import { ProductGrid } from './sections/product-grid';
import { ProductSupportLinks } from './sections/product-support-links';
import { Testimonials } from './sections/testimonials';

type PageContent = pageStandard['fields']['pageContent'];
type ContentEntry = NonNullable<PageContent>[number];

const ContentComponentMap: Record<
  string,
  React.ComponentType<{ contentEntry: ContentEntry; searchParams: SearchParams }>
> = {
  heroCarousel: ({ contentEntry }) => {
    const data = heroCarouselSchema.parse(contentEntry);

    return <HeroCarousel data={data} />;
  },
  inspirationBento: ({ contentEntry }) => {
    const bentoData = inspirationBentoSchema.parse(contentEntry);

    return <InspirationBento {...bentoData.fields} />;
  },
  newsletterForm: ({ contentEntry }) => {
    const data = newsletterFormSchema.parse(contentEntry);

    return <NewsletterForm {...data.fields} />;
  },
  postGrid: ({ contentEntry }) => {
    const postGridData = postGridSchema.parse(contentEntry);
    const { title, subtitle, type } = postGridData.fields;

    return <PostGrid subtitle={subtitle} title={title} type={type} />;
  },
  productBento: ({ contentEntry }) => {
    const data = productBentoSchema.parse(contentEntry);

    return <ProductBento {...data.fields} />;
  },
  carouselProduct: ({ contentEntry }) => {
    const carouselData = carouselProductSchema.parse(contentEntry);

    return <ProductCarousel carousel={carouselData} />;
  },
  carouselRecipe: ({ contentEntry }) => {
    const carouselData = carouselRecipeSchema.parse(contentEntry);

    return <RecipeCarousel carousel={carouselData} />;
  },
  heroSection: ({ contentEntry }) => {
    const heroData = heroSectionSchema.parse(contentEntry);

    return <HeroSection {...heroData.fields} />;
  },
  guidingPrinciplesSection: ({ contentEntry }) => {
    const sectionData = guidingPrinciplesSectionSchema.parse(contentEntry);

    return <GuidingPrinciplesSection {...sectionData.fields} />;
  },
  culinaryPassionSection: ({ contentEntry }) => {
    const sectionData = culinaryPassionSectionSchema.parse(contentEntry);

    return <CulinaryPassionSection {...sectionData.fields} />;
  },
  communitySection: ({ contentEntry }) => {
    const sectionData = communitySectionSchema.parse(contentEntry);

    return <CommunitySection {...sectionData.fields} />;
  },
  ctaSection: ({ contentEntry }) => {
    const sectionData = ctaSectionSchema.parse(contentEntry);

    return <CtaSection {...sectionData.fields} />;
  },
  cta: ({ contentEntry }) => {
    const data = ctaSchema.parse(contentEntry);

    return <Cta {...data.fields} />;
  },
  heroBanner: ({ contentEntry }) => {
    const data = heroBannerSchema.parse(contentEntry);

    return <HeroBanner {...data.fields} />;
  },
  highlights: ({ contentEntry }) => {
    const data = highlightsSchema.parse(contentEntry);

    return <Highlights {...data.fields} />;
  },
  introSection: ({ contentEntry }) => {
    const data = introSectionSchema.parse(contentEntry);

    return <IntroSection {...data.fields} />;
  },
  carouselSection: ({ contentEntry }) => {
    const data = carouselSectionSchema.parse(contentEntry);

    return <CarouselSection {...data.fields} />;
  },
  featureGrid: ({ contentEntry }) => {
    const data = featureGridSchema.parse(contentEntry);

    return <FeatureGrid {...data.fields} />;
  },
  testimonials: ({ contentEntry }) => {
    const data = testimonialsSchema.parse(contentEntry);

    return <Testimonials {...data.fields} />;
  },
  cardSection: ({ contentEntry }) => {
    const data = cardSectionSchema.parse(contentEntry);

    return <CardSection {...data.fields} />;
  },
  blockProductFeatures: ({ contentEntry }) => {
    const data = blockProductFeaturesSchema.parse(contentEntry);

    return <BlockProductFeatures {...data.fields} />;
  },
  blockProductFeaturesAccordion: ({ contentEntry }) => {
    const data = blockProductFeaturesAccordionSchema.parse(contentEntry);

    return <BlockProductFeaturesAccordion {...data.fields} />;
  },
  productGrid: ({ contentEntry }) => {
    const data = productGridSchema.parse(contentEntry);

    return <ProductGrid {...data.fields} />;
  },
  pageHeaderSupport: ({ contentEntry }) => {
    const data = pageHeaderSupportSchema.parse(contentEntry);

    return <PageHeaderSupport {...data.fields} />;
  },
  productSupportLinks: ({ contentEntry }) => {
    const data = productSupportLinksSchema.parse(contentEntry);

    return <ProductSupportLinks {...data.fields} />;
  },
  faqList: ({ contentEntry }) => {
    const data = faqListSchema.parse(contentEntry);

    return <FaqList id={data.sys.id} {...data.fields} />;
  },
  productFormulationLookup: ({ contentEntry, searchParams }) => {
    const data = productFormulationLookupSchema.parse(contentEntry);

    return (
      <ProductFormulationLookup
        {...data.fields}
        selectedSku={
          typeof searchParams.selectedSku === 'string' ? searchParams.selectedSku : undefined
        }
      />
    );
  },
  mediaBanner: ({ contentEntry }) => {
    const data = mediaBannerSchema.parse(contentEntry);

    return <MediaBanner {...data.fields} />;
  },
};

export function PageContentEntries({
  pageContent,
  searchParams,
}: {
  pageContent: pageStandard['fields']['pageContent'];
  searchParams: SearchParams;
}) {
  return (
    <div>
      {Array.isArray(pageContent) &&
        pageContent.map((entry) => {
          const contentType = entry.sys.contentType.sys.id;
          const entryId = entry.sys.id;

          if (!contentType || !entryId) {
            return null;
          }

          const Component = ContentComponentMap[contentType];

          if (!Component) {
            return null;
          }

          return (
            <Fragment key={entryId}>
              <Component contentEntry={entry} searchParams={searchParams} />
            </Fragment>
          );
        })}
    </div>
  );
}
