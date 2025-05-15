'use client';

import { clsx } from 'clsx';
import { ComponentProps, useEffect, useRef, useState } from 'react';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { Slideshow } from '@/vibes/soul/sections/slideshow';
import { Image } from '~/components/image';
import {
  assetSchema,
  heroCarousel,
  heroSlideSchema,
  pageStandardSchema,
} from '~/contentful/schema';
import { ensureImageUrl } from '~/lib/utils';

interface Props {
  data: heroCarousel;
}

type Slide = ComponentProps<typeof Slideshow>['slides'][number];

export function HeroCarousel({ data }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingRef = useRef(false);

  const processedSlides = (data.fields.heroSlides || [])
    .map((slide) => {
      const parsedSlide = heroSlideSchema.parse(slide);
      const fields = parsedSlide.fields;
      const ctaLink = fields.ctaLink;
      const ctaLinkFields = ctaLink ? pageStandardSchema.parse(ctaLink).fields : null;
      const title = fields.headline;
      const description = fields.subhead;
      const imageAsset = fields.image;
      const imageFile = imageAsset ? assetSchema.parse(imageAsset).fields.file : null;

      if (!title) return null;

      const slideData: Slide = {
        title,
        description,
        showDescription: Boolean(description),
        image: imageFile
          ? {
              alt: title,
              src: ensureImageUrl(imageFile.url),
              blurDataUrl: undefined,
            }
          : undefined,
        cta:
          fields.ctaLabel && ctaLinkFields?.pageSlug
            ? {
                label: fields.ctaLabel,
                href: `/${ctaLinkFields.pageSlug}`,
              }
            : undefined,
        showCta: Boolean(fields.ctaLabel && ctaLinkFields?.pageSlug),
      };

      return slideData;
    })
    .filter((slide): slide is Slide => slide !== null);

  // Scroll to specific slide
  const scrollToSlide = (index: number) => {
    if (!containerRef.current) return;

    const slideHeight = window.innerHeight;
    const containerTop = containerRef.current.offsetTop;
    const targetPosition = containerTop + index * slideHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    });
  };

  // Set up scroll-based animations for vertical carousel
  useEffect(() => {
    if (!data.fields.vertical || !containerRef.current) return;

    const container = containerRef.current;

    // Handle scroll event
    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollY = window.scrollY;
      const containerTop = container.offsetTop;
      const containerHeight = rect.height;

      // Calculate if we're at the end of the carousel
      // User has scrolled to the point where the bottom of carousel is at or above bottom of viewport
      const isAtEnd = scrollY >= containerTop + containerHeight - vh;

      // Show bullets only when:
      // 1. First slide is sticky (top of carousel at or past top of viewport) AND
      // 2. User hasn't scrolled past the carousel AND
      // 3. User hasn't reached the bottom of the last slide
      const isFirstSlideSticky = scrollY >= containerTop && rect.bottom > 0 && !isAtEnd;

      setIsInView(isFirstSlideSticky);

      // If container is out of view, no need to calculate
      if (rect.bottom < 0 || rect.top > vh) {
        return;
      }

      // Calculate which slide should be active based on scroll position
      const scrollProgress = Math.abs(rect.top) / (containerHeight - vh);
      const slideIndex = Math.min(
        Math.floor(scrollProgress * processedSlides.length),
        processedSlides.length - 1,
      );

      setActiveIndex(slideIndex);

      // Get all slides
      const slides = Array.from(container.querySelectorAll('.slide-content'));

      // Update content opacities - each slide starts at 50% opacity and increases to 100% as it reaches the top
      slides.forEach((content, idx) => {
        // Calculate how close this specific slide is to being at the top of the viewport
        const slidePosition = containerTop + idx * vh;
        const distanceFromTop = Math.max(0, slidePosition - scrollY);
        const viewportHeight = vh;

        // Normalize to get a value between 0 and 1, where 0 means the slide is at the top
        const normalizedDistance = Math.min(distanceFromTop / viewportHeight, 1);

        // Calculate opacity: mostly hidden until almost at top, then quickly becomes fully visible
        const opacity = 1 * (1 - normalizedDistance) ** 4;

        content.setAttribute('style', `opacity: ${opacity}`);
      });

      // Mark that scrolling is happening
      isScrollingRef.current = true;

      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set a new timeout to detect when scrolling stops
      scrollTimeoutRef.current = setTimeout(() => {
        // Only apply snap if carousel is fully in view
        if (isFirstSlideSticky) {
          // Calculate the fractional part of the scroll progress to determine if we're between slides
          const fractionalProgress = (scrollProgress * processedSlides.length) % 1;
          const targetIndex =
            fractionalProgress > 0.5
              ? Math.ceil(scrollProgress * processedSlides.length)
              : Math.floor(scrollProgress * processedSlides.length);

          // Snap to the closest slide
          scrollToSlide(Math.min(targetIndex, processedSlides.length - 1));
        }

        isScrollingRef.current = false;
      }, 150); // Wait 150ms after last scroll event before snapping
    };

    // Initial calculation
    handleScroll();

    // Listen for scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);

      // Clear any remaining timeout on unmount
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [data.fields.vertical, processedSlides.length]);

  // Vertical carousel implementation
  if (data.fields.vertical) {
    return (
      <>
        {/* Fixed navigation bullets */}
        <div
          className={clsx(
            'fixed top-1/2 right-4 z-50 flex -translate-y-1/2 flex-col gap-2 transition-opacity duration-500',
            isInView ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
        >
          {processedSlides.map((_, idx) => (
            <button
              aria-label={`Show slide ${idx + 1}`}
              className={clsx(
                'size-2 rounded-full transition-all duration-300 focus:outline-none',
                idx === activeIndex
                  ? 'bg-[var(--slideshow-pagination,hsl(var(--background)))] opacity-100'
                  : 'bg-[var(--slideshow-pagination,hsl(var(--background)))] opacity-30 hover:opacity-70',
              )}
              key={idx}
              onClick={() => scrollToSlide(idx)}
            />
          ))}
        </div>

        {/* Main carousel container */}
        <div
          className="relative"
          ref={containerRef}
          style={{ height: `${processedSlides.length * 100}dvh` }}
        >
          {/* Content sections layer */}
          <div className="relative z-10 h-full w-full">
            {processedSlides.map((slide, idx) => (
              <div className="sticky top-0 h-screen w-full" key={`content-${idx}`}>
                <div
                  className="slide-content absolute inset-0 h-full w-full transition-opacity duration-500"
                  style={{ opacity: idx === 0 ? 1 : 0 }}
                >
                  <div className="bg-contrast-200 absolute inset-0 h-full w-full transition-opacity duration-500">
                    {slide.image?.src != null && slide.image.src !== '' && (
                      <Image
                        alt={slide.image.alt}
                        blurDataURL={slide.image.blurDataUrl}
                        className="h-full w-full object-cover"
                        fill
                        placeholder={slide.image.blurDataUrl ? 'blur' : 'empty'}
                        priority={idx === 0}
                        sizes="100vw"
                        src={slide.image.src}
                      />
                    )}
                  </div>
                  <div className="absolute inset-0 left-0">
                    <div className="mx-auto flex h-full max-w-[var(--section-max-width-2xl,1536px)] flex-col justify-center px-4 py-10 @xl:px-6 @xl:py-14 @4xl:px-8 @4xl:py-16">
                      <h1 className="font-heading text-surface-foreground m-0 max-w-lg text-6xl uppercase">
                        {slide.title}
                      </h1>
                      {Boolean(slide.showDescription && slide.description) && (
                        <p className="text-contrast-400 mt-4 max-w-lg text-xl @xl:mt-6">
                          {slide.description}
                        </p>
                      )}
                      {slide.showCta && slide.cta && (
                        <ButtonLink
                          className="mt-6 @xl:mt-8"
                          href={slide.cta.href}
                          shape={slide.cta.shape ?? 'rounded'}
                          size={slide.cta.size ?? 'large'}
                          variant={slide.cta.variant ?? 'primary'}
                        >
                          {slide.cta.label}
                        </ButtonLink>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  // Default horizontal slideshow implementation
  return (
    <section className="@container">
      <Slideshow slides={processedSlides} vertical={data.fields.vertical} />
    </section>
  );
}
