'use client';

import { clsx } from 'clsx';
import { ComponentProps, useEffect, useRef, useState } from 'react';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { Slideshow } from '@/vibes/soul/sections/slideshow';
import { Image } from '~/components/image';
import { assetSchema, heroCarousel, heroSlideSchema } from '~/contentful/schema';
import { ensureImageUrl, isString } from '~/lib/utils';

interface Props {
  data: heroCarousel;
}

type Slide = ComponentProps<typeof Slideshow>['slides'][number] & {
  invertText?: boolean;
};

export function HeroCarousel({ data }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const processedSlides = (data.fields.heroSlides || [])
    .map((slide) => {
      const parsedSlide = heroSlideSchema.parse(slide);
      const fields = parsedSlide.fields;
      const ctaLink = fields.ctaLink;
      const title = fields.headline;
      const description = fields.subhead;
      const imageAsset = fields.image;
      const imageFile = imageAsset ? assetSchema.parse(imageAsset).fields.file : null;

      if (!title) return null;

      const pageSlug = isString(ctaLink?.fields.pageSlug) ? ctaLink.fields.pageSlug : undefined;

      const slideData: Slide = {
        title,
        description,
        showDescription: Boolean(description),
        invertText: Boolean(fields.invertTextColor),
        image: imageFile
          ? {
              alt: title,
              src: ensureImageUrl(imageFile.url),
              blurDataUrl: undefined,
            }
          : undefined,
        cta:
          fields.ctaLabel && pageSlug
            ? {
                label: fields.ctaLabel,
                href: `/${pageSlug}`,
              }
            : undefined,
        showCta: Boolean(fields.ctaLabel && pageSlug),
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
    let startScrollY = 0;
    let isLocked = false;
    let lastScrollY = 0;

    // Handle scroll event
    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollY = window.scrollY;
      const isScrollingUp = scrollY < lastScrollY;

      lastScrollY = scrollY;

      // Calculate if we're in the carousel section
      const isInCarousel = rect.top <= 0 && rect.bottom >= 0;

      setIsInView(isInCarousel);

      // If container is out of view, reset lock state
      if (rect.top > vh) {
        isLocked = false;

        return;
      }

      // When the carousel first enters the viewport from top or bottom, record the scroll position
      if (!isLocked && (rect.top <= 0 || (isScrollingUp && rect.bottom >= vh))) {
        isLocked = true;
        startScrollY = scrollY;
      }

      // Only calculate slide changes if the carousel is locked
      if (isLocked) {
        // Calculate scroll progress relative to when the carousel was locked
        const scrollProgress = (scrollY - startScrollY) / vh;
        const slideIndex = Math.min(
          Math.max(0, Math.floor(scrollProgress)),
          processedSlides.length - 1,
        );

        setActiveIndex(slideIndex);
      }
    };

    // Initial calculation
    handleScroll();

    // Listen for scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [data.fields.vertical, processedSlides.length]);

  // Vertical carousel implementation
  if (data.fields.vertical) {
    return (
      <>
        {/* Fixed navigation bullets */}
        <div
          className={clsx(
            'fixed bottom-16 left-1/2 z-50 flex -translate-x-1/2 gap-2 transition-opacity duration-500 md:top-1/2 md:right-8 md:bottom-auto md:left-auto md:-translate-x-0 md:-translate-y-1/2 md:flex-col xl:right-16',
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
          style={{ height: `calc(${processedSlides.length * 100}dvh + 1000px)` }}
        >
          {/* Fixed viewport container */}
          <div className="sticky top-0 h-screen w-full">
            {/* Content sections layer */}
            <div className="relative h-full w-full">
              {processedSlides.map((slide, idx) => (
                <div
                  className={clsx(
                    'absolute inset-0 h-full w-full transition-all duration-500',
                    idx === activeIndex ? 'z-10 opacity-100' : 'z-0 opacity-0',
                  )}
                  key={`content-${idx}`}
                >
                  <div className="absolute inset-0 z-15 bg-linear-to-l from-transparent to-black/50" />
                  <div className="bg-contrast-200 absolute inset-0 z-10 h-full w-full">
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
                  <div className="absolute inset-0 left-0 z-20">
                    <div
                      className={clsx(
                        'ease-quad container mx-auto flex h-full flex-col justify-center py-10 transition-all duration-500',
                        idx === activeIndex
                          ? 'translate-y-0 opacity-100'
                          : 'translate-y-10 opacity-0',
                      )}
                      style={{ transform: 'translateY(0)' }}
                    >
                      <h1
                        className={clsx(
                          'font-heading m-0 max-w-lg text-4xl uppercase lg:text-6xl',
                          slide.invertText ? 'text-white' : 'text-surface-foreground',
                        )}
                      >
                        {slide.title}
                      </h1>
                      {Boolean(slide.showDescription && slide.description) && (
                        <p
                          className={clsx(
                            'mt-4 max-w-lg text-xl @xl:mt-6',
                            slide.invertText ? 'text-white' : 'text-contrast-400',
                          )}
                        >
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
              ))}
            </div>
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
