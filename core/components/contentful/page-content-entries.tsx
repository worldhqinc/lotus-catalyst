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
  featureGridSchema,
  guidingPrinciplesSectionSchema,
  heroBannerSchema,
  heroCarouselSchema,
  heroSectionSchema,
  highlightsSchema,
  inspirationBentoSchema,
  inspirationCardSchema,
  introSectionSchema,
  newsletterFormSchema,
  pageStandard,
  postGridSchema,
  productBentoSchema,
  productGridSchema,
  testimonialsSchema,
} from '~/contentful/schema';

import { RecipeCarousel } from './carousels/recipe-carousel';
import { BlockProductFeatures } from './sections/block-product-features';
import { BlockProductFeaturesAccordion } from './sections/block-product-features-accordion';
import { CardSection } from './sections/card-section';
import { CarouselSection } from './sections/carousel-section';
import { CommunitySection } from './sections/community-section';
import { CtaSection } from './sections/cta-section';
import { CulinaryPassionSection } from './sections/culinary-passion-section';
import { FeatureGrid } from './sections/feature-grid';
import { GuidingPrinciplesSection } from './sections/guiding-principles-section';
import { HeroBanner } from './sections/hero-banner';
import { HeroCarousel } from './sections/hero-carousel';
import { HeroSection } from './sections/hero-section';
import { Highlights } from './sections/highlights';
import { InspirationBento } from './sections/inspiration-bento';
import { IntroSection } from './sections/intro-section';
import { NewsletterForm } from './sections/newsletter-form';
import { PostGrid } from './sections/post-grid';
import { ProductBento } from './sections/product-bento';
import { ProductGrid } from './sections/product-grid';
import { Testimonials } from './sections/testimonials';

type PageContent = pageStandard['fields']['pageContent'];
type ContentEntry = NonNullable<PageContent>[number];

const ContentComponentMap: Record<string, React.ComponentType<{ contentEntry: ContentEntry }>> = {
  heroCarousel: ({ contentEntry }) => {
    const data = heroCarouselSchema.parse(contentEntry);

    return <HeroCarousel data={data} />;
  },
  inspirationBento: ({ contentEntry }) => {
    const bentoData = inspirationBentoSchema.parse(contentEntry);
    const { cta, heading, inspirationCards, video } = bentoData.fields;
    const validCta = cta ? ctaSchema.parse(cta) : null;
    const validCards =
      inspirationCards?.map((card) => {
        return inspirationCardSchema.parse(card);
      }) ?? [];

    return (
      <InspirationBento
        cta={validCta}
        heading={heading}
        inspirationCards={validCards}
        video={video}
      />
    );
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
};

export function PageContentEntries({
  pageContent,
}: {
  pageContent: pageStandard['fields']['pageContent'];
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
              <Component contentEntry={entry} />
            </Fragment>
          );
        })}
    </div>
  );
}
