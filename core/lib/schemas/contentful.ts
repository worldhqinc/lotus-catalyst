import { z } from 'zod';
import type { Document } from '@contentful/rich-text-types';

export const contentfulRichTextSchema = z.unknown() as z.ZodType<Document>;

export type ContentfulRichText = z.infer<typeof contentfulRichTextSchema>;

export const contentfulImageSchema = z.object({
  sys: z.object({
    type: z.literal('Asset'),
  }),
  fields: z.object({
    title: z.string(),
    description: z.string(),
    file: z.object({
      url: z.string(),
      details: z.object({
        size: z.number(),
        image: z.object({
          width: z.number(),
          height: z.number(),
        }),
      }),
      fileName: z.string(),
      contentType: z.string(),
    }),
  }),
});

export type ContentfulImage = z.infer<typeof contentfulImageSchema>;

export const contentfulAssetSchema = z.object({
  sys: z.object({
    type: z.literal('Asset'),
  }),
  fields: z.object({
    title: z.string(),
    description: z.string(),
    file: z.object({
      url: z.string(),
      details: z.object({
        size: z.number(),
      }),
      fileName: z.string(),
      contentType: z.string(),
    }),
  }),
});

export type ContentfulAsset = z.infer<typeof contentfulAssetSchema>;

const _baseProductFinishedGoods = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal('productFinishedGoods'),
      }),
    }),
  }),
  fields: z.object({
    productName: z.string(),
    bcProductReference: z.string(),
    pageSlug: z.string().optional(),
    shortDescription: z.string().optional(),
    defaultPrice: z.string(),
    salePrice: z.string().optional(),
    couponCodesalesDates: z.string().optional(),
    details: contentfulRichTextSchema,
    faqs: z.unknown(),
    featuredImage: contentfulImageSchema,
    additionalImages: z.array(contentfulAssetSchema).optional(),
    partsAccessories: z.array(z.unknown()).optional(),
    productCarousel: z.unknown(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    productLine: z.array(z.string()).optional(),
    parentCategory: z.array(z.string()).optional(),
    subCategory: z.array(z.string()).optional(),
    webSubCategory: z.string().optional(),
    productFormulationInformation: z.unknown().optional(),
    feature: z.array(z.string()).optional(),
    finish: z.array(z.string()).optional(),
    size: z.string().optional(),
    supportDocumentation: z.unknown(),
    factoryRecertifiedProduct: z.boolean().optional(),
    modelNumber: z.string(),
    wattage: z.string().optional(),
    warranty: z.string().optional(),
    spotlightVideo: z.unknown(),
    outOfBoxNetWeight: z.string().optional(),
    outOfBoxDepth: z.string().optional(),
    outOfBoxWidth: z.string().optional(),
    outOfBoxHeight: z.string().optional(),
    outOfBoxSizeUom: z.string().optional(),
    outOfBoxWeightUom: z.string().optional(),
    archive: z.boolean().optional(),
    productBadge: z.string().optional(),
    isShipsFree: z.boolean().optional(),
    inventoryQuantity: z.number().int().optional(),
    recipes: z.unknown(),
    pageContentEntries: z.unknown(),
  }),
});

export type ProductFinishedGoods = z.infer<typeof _baseProductFinishedGoods> & {
  fields: {
    faqs?: Faq | undefined;
    productCarousel?: CarouselProduct | undefined;
    supportDocumentation?: SupportDocument | undefined;
    spotlightVideo?: FeatureVideoBanner | undefined;
    recipes?: CarouselRecipe | undefined;
    pageContentEntries?: BlockProductFeatures | BlockProductFeaturesAccordion | undefined;
  };
};

export const productFinishedGoodsSchema: z.ZodType<ProductFinishedGoods> =
  _baseProductFinishedGoods.extend({
    fields: _baseProductFinishedGoods.shape.fields.extend({
      faqs: z.lazy(() => faqSchema).optional(),
      productCarousel: z.lazy(() => carouselProductSchema).optional(),
      supportDocumentation: z.lazy(() => supportDocumentSchema).optional(),
      spotlightVideo: z.lazy(() => featureVideoBannerSchema).optional(),
      recipes: z.lazy(() => carouselRecipeSchema).optional(),
      pageContentEntries: z
        .lazy(() => z.union([blockProductFeaturesSchema, blockProductFeaturesAccordionSchema]))
        .optional(),
    }),
  });

const _baseFaq = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal('faq'),
      }),
    }),
  }),
  fields: z.object({
    question: z.string(),
    answer: contentfulRichTextSchema,
    faqCategory: z.unknown(),
    faqFilterCategory: z.string().optional(),
  }),
});

export type Faq = z.infer<typeof _baseFaq> & { fields: { faqCategory: CategoryFaq[] } };

export const faqSchema: z.ZodType<Faq> = _baseFaq.extend({
  fields: _baseFaq.shape.fields.extend({
    faqCategory: z.lazy(() => z.array(categoryFaqSchema)),
  }),
});

const _baseCarouselRecipe = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal('carouselRecipe'),
      }),
    }),
  }),
  fields: z.object({
    internalName: z.string(),
    carouselTitle: z.string(),
    recipes: z.unknown(),
  }),
});

export type CarouselRecipe = z.infer<typeof _baseCarouselRecipe> & {
  fields: { recipes: Recipe[] };
};

export const carouselRecipeSchema: z.ZodType<CarouselRecipe> = _baseCarouselRecipe.extend({
  fields: _baseCarouselRecipe.shape.fields.extend({
    recipes: z.lazy(() => z.array(recipeSchema)),
  }),
});

const _baseCategoryFaq = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal('categoryFaq'),
      }),
    }),
  }),
  fields: z.object({
    faqCategoryName: z.string(),
    parentCategory: z.unknown(),
  }),
});

export type CategoryFaq = z.infer<typeof _baseCategoryFaq> & {
  fields: { parentCategory?: CategoryFaq | undefined };
};

export const categoryFaqSchema: z.ZodType<CategoryFaq> = _baseCategoryFaq.extend({
  fields: _baseCategoryFaq.shape.fields.extend({
    parentCategory: z.lazy(() => categoryFaqSchema).optional(),
  }),
});

const _baseCategoryProduct = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal('categoryProduct'),
      }),
    }),
  }),
  fields: z.object({
    productCategoryName: z.string(),
    productParentCategoryName: z.unknown(),
    categoryDescription: z.string().optional(),
    categoryPencilBanner: contentfulImageSchema,
    categoryThumbnailImage: contentfulImageSchema,
    categoryLifestyleImage: contentfulAssetSchema,
    categoryLink: z.string().optional(),
    categoryCallToActionLabel: z.string().optional(),
    mainProduct: z.string().optional(),
  }),
});

export type CategoryProduct = z.infer<typeof _baseCategoryProduct> & {
  fields: { productParentCategoryName?: CategoryProduct | undefined };
};

export const categoryProductSchema: z.ZodType<CategoryProduct> = _baseCategoryProduct.extend({
  fields: _baseCategoryProduct.shape.fields.extend({
    productParentCategoryName: z.lazy(() => categoryProductSchema).optional(),
  }),
});

const _baseCarouselProduct = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal('carouselProduct'),
      }),
    }),
  }),
  fields: z.object({
    internalName: z.string(),
    carouselTitle: z.string(),
    products: z.unknown(),
  }),
});

export type CarouselProduct = z.infer<typeof _baseCarouselProduct> & {
  fields: { products: ProductFinishedGoods[] };
};

export const carouselProductSchema: z.ZodType<CarouselProduct> = _baseCarouselProduct.extend({
  fields: _baseCarouselProduct.shape.fields.extend({
    products: z.lazy(() => z.array(productFinishedGoodsSchema)),
  }),
});

const _baseRecipe = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal('recipe'),
      }),
    }),
  }),
  fields: z.object({
    recipeName: z.string(),
    metaTitle: z.string(),
    metaDescription: z.string(),
    pageSlug: z.string(),
    shortDescription: z.string().optional(),
    mealTypeCategory: z.array(z.string()).optional(),
    occasionCategory: z.array(z.string()).optional(),
    ingredientsCategory: z.array(z.string()).optional(),
    applianceTypeCategory: z.array(z.string()).optional(),
    author: z.unknown(),
    cookTime: z.string().optional(),
    numberOfIngredients: z.string().optional(),
    numberOfServings: z.string().optional(),
    ingredientsLists: z.unknown(),
    recipeDirections: contentfulRichTextSchema,
    testKitchenTips: contentfulRichTextSchema,
    featuredImage: contentfulImageSchema,
    additionalImages: z.array(contentfulAssetSchema).optional(),
    videoFeature: z.unknown(),
    productCarousel: z.unknown(),
    recipeCarousel: z.unknown(),
  }),
});

export type Recipe = z.infer<typeof _baseRecipe> & {
  fields: {
    author?: Author | undefined;
    ingredientsLists?: IngredientsList | undefined;
    videoFeature?: FeatureVideoBanner | undefined;
    productCarousel?: CarouselProduct | undefined;
    recipeCarousel?: CarouselRecipe | undefined;
  };
};

export const recipeSchema: z.ZodType<Recipe> = _baseRecipe.extend({
  fields: _baseRecipe.shape.fields.extend({
    author: z.lazy(() => authorSchema).optional(),
    ingredientsLists: z.lazy(() => ingredientsListSchema).optional(),
    videoFeature: z.lazy(() => featureVideoBannerSchema).optional(),
    productCarousel: z.lazy(() => carouselProductSchema).optional(),
    recipeCarousel: z.lazy(() => carouselRecipeSchema).optional(),
  }),
});

const _baseProductPartsAndAccessories = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal('productPartsAndAccessories'),
      }),
    }),
  }),
  fields: z.object({
    productName: z.string(),
    bcProductReference: z.string(),
    pageSlug: z.string(),
    associatedFinishedGoods: z.unknown(),
    relatedPartsAndAccessories: z.unknown(),
    subCategory: z.array(z.string()).optional(),
    productLine: z.array(z.string()).optional(),
    feature: z.array(z.string()).optional(),
    size: z.array(z.string()).optional(),
    finish: z.array(z.string()).optional(),
    featuredImage: contentfulImageSchema,
    additionalImages: z.array(contentfulAssetSchema).optional(),
    productCarousel: z.unknown(),
    metaTitle: z.string(),
    metaDescription: z.string().optional(),
    parentCategory: z.unknown().optional(),
    productFormulationInformation: z.unknown().optional(),
    details: contentfulRichTextSchema,
    factoryRecertifiedProduct: z.boolean(),
    modelNumber: z.string().optional(),
    outOfBoxNetWeight: z.string().optional(),
    outOfBoxDepth: z.string().optional(),
    outOfBoxWidth: z.string().optional(),
    outOfBoxHeight: z.string().optional(),
    outOfBoxUnitVolume: z.string().optional(),
    outOfBoxSizeUom: z.string().optional(),
    outOfBoxWeightUom: z.string().optional(),
    archived: z.boolean().optional(),
    price: z.string().optional(),
    couponCodesalesDates: z.string().optional(),
    salePrice: z.string().optional(),
    productBadge: z.string().optional(),
    isShipsFree: z.boolean().optional(),
    inventoryQuantity: z.number().int().optional(),
    pageContentEntries: z.unknown(),
  }),
});

export type ProductPartsAndAccessories = z.infer<typeof _baseProductPartsAndAccessories> & {
  fields: {
    associatedFinishedGoods?: ProductFinishedGoods | undefined;
    relatedPartsAndAccessories?: ProductPartsAndAccessories | undefined;
    productCarousel?: CarouselProduct | undefined;
    pageContentEntries?: BlockProductFeatures | BlockProductFeaturesAccordion | undefined;
  };
};

export const productPartsAndAccessoriesSchema: z.ZodType<ProductPartsAndAccessories> =
  _baseProductPartsAndAccessories.extend({
    fields: _baseProductPartsAndAccessories.shape.fields.extend({
      associatedFinishedGoods: z.lazy(() => productFinishedGoodsSchema).optional(),
      relatedPartsAndAccessories: z.lazy(() => productPartsAndAccessoriesSchema).optional(),
      productCarousel: z.lazy(() => carouselProductSchema).optional(),
      pageContentEntries: z
        .lazy(() => z.union([blockProductFeaturesSchema, blockProductFeaturesAccordionSchema]))
        .optional(),
    }),
  });

const _baseIngredientsList = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal('ingredientsList'),
      }),
    }),
  }),
  fields: z.object({
    ingredientsListName: z.string(),
    sectionTitle: z.string().optional(),
    listOfIngredients: z.array(z.string()).optional(),
  }),
});

export type IngredientsList = z.infer<typeof _baseIngredientsList> & { fields: {} };

export const ingredientsListSchema: z.ZodType<IngredientsList> = _baseIngredientsList.extend({
  fields: _baseIngredientsList.shape.fields.extend({}),
});

const _baseAuthor = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal('author'),
      }),
    }),
  }),
  fields: z.object({
    authorName: z.string(),
    authorImage: contentfulImageSchema,
  }),
});

export type Author = z.infer<typeof _baseAuthor> & { fields: {} };

export const authorSchema: z.ZodType<Author> = _baseAuthor.extend({
  fields: _baseAuthor.shape.fields.extend({}),
});

const _baseSupportDocument = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal('supportDocument'),
      }),
    }),
  }),
  fields: z.object({
    documentName: z.string(),
    productImage: contentfulAssetSchema,
    documentType: z.string().optional(),
    url: z.string(),
    modelNumber: z.string().optional(),
  }),
});

export type SupportDocument = z.infer<typeof _baseSupportDocument> & { fields: {} };

export const supportDocumentSchema: z.ZodType<SupportDocument> = _baseSupportDocument.extend({
  fields: _baseSupportDocument.shape.fields.extend({}),
});

const _basePageStandard = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal('pageStandard'),
      }),
    }),
  }),
  fields: z.object({
    pageName: z.string(),
    metaTitleSeo: z.string(),
    metaDescription: z.string().optional(),
    metaKeywordsSeo: z.string().optional(),
    pageSlug: z.string(),
    optionalPageDescription: contentfulRichTextSchema,
    pageContent: z.array(z.unknown()).optional(),
  }),
});

export type PageStandard = z.infer<typeof _basePageStandard> & { fields: {} };

export const pageStandardSchema: z.ZodType<PageStandard> = _basePageStandard.extend({
  fields: _basePageStandard.shape.fields.extend({}),
});

const _baseMegaMenu = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal('megaMenu'),
      }),
    }),
  }),
  fields: z.object({
    menuName: z.string(),
    menuReference: z.array(z.unknown()),
  }),
});

export type MegaMenu = z.infer<typeof _baseMegaMenu> & { fields: {} };

export const megaMenuSchema: z.ZodType<MegaMenu> = _baseMegaMenu.extend({
  fields: _baseMegaMenu.shape.fields.extend({}),
});

const _baseCarouselProductSimple = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal('carouselProductSimple'),
      }),
    }),
  }),
  fields: z.object({
    internalName: z.string(),
    carouselTitle: z.string(),
    productReference: z.unknown(),
  }),
});

export type CarouselProductSimple = z.infer<typeof _baseCarouselProductSimple> & {
  fields: { productReference: ProductFinishedGoods[] };
};

export const carouselProductSimpleSchema: z.ZodType<CarouselProductSimple> =
  _baseCarouselProductSimple.extend({
    fields: _baseCarouselProductSimple.shape.fields.extend({
      productReference: z.lazy(() => z.array(productFinishedGoodsSchema)),
    }),
  });

const _baseFaqList = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal('faqList'),
      }),
    }),
  }),
  fields: z.object({
    faqParentCategory: z.string(),
    faqReference: z.unknown(),
  }),
});

export type FaqList = z.infer<typeof _baseFaqList> & { fields: { faqReference: Faq[] } };

export const faqListSchema: z.ZodType<FaqList> = _baseFaqList.extend({
  fields: _baseFaqList.shape.fields.extend({
    faqReference: z.lazy(() => z.array(faqSchema)),
  }),
});

const _baseBlockProductFeatures = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal('blockProductFeatures'),
      }),
    }),
  }),
  fields: z.object({
    heading: z.string(),
  }),
});

export type BlockProductFeatures = z.infer<typeof _baseBlockProductFeatures> & { fields: {} };

export const blockProductFeaturesSchema: z.ZodType<BlockProductFeatures> =
  _baseBlockProductFeatures.extend({
    fields: _baseBlockProductFeatures.shape.fields.extend({}),
  });

const _baseBlockProductFeaturesAccordion = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal('blockProductFeaturesAccordion'),
      }),
    }),
  }),
  fields: z.object({
    heading: z.string(),
  }),
});

export type BlockProductFeaturesAccordion = z.infer<typeof _baseBlockProductFeaturesAccordion> & {
  fields: {};
};

export const blockProductFeaturesAccordionSchema: z.ZodType<BlockProductFeaturesAccordion> =
  _baseBlockProductFeaturesAccordion.extend({
    fields: _baseBlockProductFeaturesAccordion.shape.fields.extend({}),
  });

const _baseCTA = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal('cta'),
      }),
    }),
  }),
  fields: z.object({
    text: z.string(),
    internalReference: z.unknown(),
    externalLink: z.string().optional(),
  }),
});

export type CTA = z.infer<typeof _baseCTA> & {
  fields: {
    internalReference?:
      | ProductFinishedGoods
      | ProductPartsAndAccessories
      | PageStandard
      | undefined;
  };
};

export const ctaSchema: z.ZodType<CTA> = _baseCTA.extend({
  fields: _baseCTA.shape.fields.extend({
    internalReference: z
      .lazy(() =>
        z.union([productFinishedGoodsSchema, productPartsAndAccessoriesSchema, pageStandardSchema]),
      )
      .optional(),
  }),
});

const _baseInspirationBento = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal('inspirationBento'),
      }),
    }),
  }),
  fields: z.object({
    heading: z.string().optional(),
    cta: z.unknown(),
    video: z.string().optional(),
    inspirationCards: z.unknown(),
  }),
});

export type InspirationBento = z.infer<typeof _baseInspirationBento> & {
  fields: { cta?: CTA | undefined; inspirationCards?: InspirationCard | undefined };
};

export const inspirationBentoSchema: z.ZodType<InspirationBento> = _baseInspirationBento.extend({
  fields: _baseInspirationBento.shape.fields.extend({
    cta: z.lazy(() => ctaSchema).optional(),
    inspirationCards: z.lazy(() => inspirationCardSchema).optional(),
  }),
});

const _baseInspirationCard = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal('inspirationCard'),
      }),
    }),
  }),
  fields: z.object({
    title: z.string(),
    contentReference: z.unknown(),
  }),
});

export type InspirationCard = z.infer<typeof _baseInspirationCard> & {
  fields: { contentReference: Tutorial | Recipe };
};

export const inspirationCardSchema: z.ZodType<InspirationCard> = _baseInspirationCard.extend({
  fields: _baseInspirationCard.shape.fields.extend({
    contentReference: z.lazy(() => z.union([tutorialSchema, recipeSchema])),
  }),
});

const _baseTutorial = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal('tutorial'),
      }),
    }),
  }),
  fields: z.object({
    title: z.string(),
  }),
});

export type Tutorial = z.infer<typeof _baseTutorial> & { fields: {} };

export const tutorialSchema: z.ZodType<Tutorial> = _baseTutorial.extend({
  fields: _baseTutorial.shape.fields.extend({}),
});

const _baseHeroCarousel = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal('heroCarousel'),
      }),
    }),
  }),
  fields: z.object({
    heroSlides: z.unknown(),
  }),
});

export type HeroCarousel = z.infer<typeof _baseHeroCarousel> & {
  fields: { heroSlides?: HeroSlide | undefined };
};

export const heroCarouselSchema: z.ZodType<HeroCarousel> = _baseHeroCarousel.extend({
  fields: _baseHeroCarousel.shape.fields.extend({
    heroSlides: z.lazy(() => heroSlideSchema).optional(),
  }),
});

const _baseHeroSlide = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal('heroSlide'),
      }),
    }),
  }),
  fields: z.object({
    image: contentfulAssetSchema,
    headline: z.string(),
    subhead: z.string().optional(),
    ctaLabel: z.string().optional(),
    ctaLink: z.unknown().optional(),
  }),
});

export type HeroSlide = z.infer<typeof _baseHeroSlide> & { fields: {} };

export const heroSlideSchema: z.ZodType<HeroSlide> = _baseHeroSlide.extend({
  fields: _baseHeroSlide.shape.fields.extend({}),
});

const _baseFeatureVideoBanner = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal('featureVideoBanner'),
      }),
    }),
  }),
  fields: z.object({
    internalName: z.string(),
    sectionTitle: z.string().optional(),
    subTitle: z.string().optional(),
    descriptiveBodyCopy: z.string().optional(),
    video: contentfulAssetSchema,
    registrationCookieMessage: z.string().optional(),
  }),
});

export type FeatureVideoBanner = z.infer<typeof _baseFeatureVideoBanner> & { fields: {} };

export const featureVideoBannerSchema: z.ZodType<FeatureVideoBanner> =
  _baseFeatureVideoBanner.extend({
    fields: _baseFeatureVideoBanner.shape.fields.extend({}),
  });
