'use client';

import { clsx } from 'clsx';
import { ComponentProps, useEffect, useRef, useState } from 'react';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { Slideshow } from '@/vibes/soul/sections/slideshow';
import { Image } from '~/components/image';
import { WistiaPlayer } from '~/components/wistia-player';
import { assetSchema, heroCarousel, heroSlideSchema } from '~/contentful/schema';
import { ensureImageUrl, isString } from '~/lib/utils';

interface Props {
  data: heroCarousel;
}

type Slide = ComponentProps<typeof Slideshow>['slides'][number] & {
  invertText?: boolean;
  wistiaId?: string;
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
        wistiaId: isString(fields.wistiaId) ? fields.wistiaId : undefined,
      };

      return slideData;
    })
    .filter((slide): slide is Slide => slide !== null);

  const mediaElement = (slide: Slide, idx: number) => {
    if (slide.wistiaId) {
      return <WistiaPlayer buttonPosition="left" pageType="page" wistiaMediaId={slide.wistiaId} />;
    } else if (slide.image?.src) {
      return (
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
      );
    }

    return null;
  };

  // Scroll to specific slide
  const scrollToSlide = (index: number) => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const currentScroll = window.scrollY;

    const targetPosition = currentScroll + containerRect.top + index * viewportHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    });
  };

  // Set up scroll-based animations for vertical carousel
  useEffect(() => {
    if (!data.fields.vertical || !containerRef.current) return;

    const container = containerRef.current;
    let isLocked = false;
    let lastScrollY = window.scrollY;

    // Calculates initial active index based on scroll position
    const calculateInitialIndex = () => {
      const containerRect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // If we're already scrolled past the container
      if (containerRect.top <= 0) {
        const scrollProgress = Math.abs(containerRect.top) / viewportHeight;
        const initialIndex = Math.min(
          Math.max(0, Math.floor(scrollProgress)),
          processedSlides.length - 1,
        );

        setActiveIndex(initialIndex);
        isLocked = true;
      }
    };

    // Handle scroll event
    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const isScrollingUp = scrollY < lastScrollY;

      lastScrollY = scrollY;

      // Calculates if we're in the carousel section
      const isInCarousel = containerRect.top <= 0 && containerRect.bottom >= 0;
      const containerHeight = container.offsetHeight;
      const isPastLastSlide = containerRect.top < -(containerHeight - window.innerHeight);

      setIsInView(isInCarousel && !isPastLastSlide);

      // If container is out of view, reset lock state
      if (containerRect.top > viewportHeight) {
        isLocked = false;

        return;
      }

      // When the carousel first enters the viewport from top or bottom, record the scroll position
      if (
        !isLocked &&
        (containerRect.top <= 0 || (isScrollingUp && containerRect.bottom >= viewportHeight))
      ) {
        isLocked = true;
      }

      // Only calculate slide changes if the carousel is locked
      if (isLocked) {
        // Calculates scroll progress relative to when the carousel was locked
        const scrollProgress = Math.abs(containerRect.top) / viewportHeight;
        const slideIndex = Math.min(
          Math.max(0, Math.floor(scrollProgress)),
          processedSlides.length - 1,
        );

        setActiveIndex(slideIndex);
      }
    };

    // Calculates initial state
    calculateInitialIndex();
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
            'fixed bottom-16 left-1/2 z-20 flex -translate-x-1/2 gap-2 transition-opacity duration-500 md:top-1/2 md:right-8 md:bottom-auto md:left-auto md:-translate-x-0 md:-translate-y-1/2 md:flex-col xl:right-16',
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
          style={{ height: `calc(${processedSlides.length * 100}svh + 500px)` }}
        >
          {/* Fixed viewport container */}
          <div className="sticky top-0 h-dvh w-full">
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
                  <div className="bg-contrast-200 absolute inset-0 z-10 h-full w-full after:absolute after:inset-0 after:z-15 after:bg-linear-to-l after:from-transparent after:to-black/50">
                    {mediaElement(slide, idx)}
                  </div>
                  <div className="absolute top-1/2 left-1/2 z-20 container -translate-x-1/2 -translate-y-1/2">
                    <div
                      className={clsx(
                        'ease-quad flex h-full flex-col justify-center py-10 transition-all duration-500',
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
