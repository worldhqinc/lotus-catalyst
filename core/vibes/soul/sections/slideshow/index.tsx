'use client';

import { clsx } from 'clsx';
import { EmblaCarouselType } from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';
import Fade from 'embla-carousel-fade';
import useEmblaCarousel from 'embla-carousel-react';
import { Pause, Play } from 'lucide-react';
import { ComponentPropsWithoutRef, useCallback, useEffect, useState } from 'react';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { Image } from '~/components/image';

type ButtonLinkProps = ComponentPropsWithoutRef<typeof ButtonLink>;

interface Slide {
  title: string;
  description?: string | null;
  showDescription?: boolean;
  image?: { alt: string; blurDataUrl?: string; src: string };
  cta?: {
    label: string;
    href: string;
    variant?: ButtonLinkProps['variant'];
    size?: ButtonLinkProps['size'];
    shape?: ButtonLinkProps['shape'];
  };
  showCta?: boolean;
}

interface Props {
  slides: Slide[];
  playOnInit?: boolean;
  interval?: number;
  className?: string;
  vertical?: boolean | null;
  isProductGallery?: boolean;
  navigationColor?: 'white' | 'black';
}

interface UseProgressButtonType {
  selectedIndex: number;
  scrollSnaps: number[];
  onProgressButtonClick: (index: number) => void;
}

const useProgressButton = (
  emblaApi: EmblaCarouselType | undefined,
  onButtonClick?: (emblaApi: EmblaCarouselType) => void,
): UseProgressButtonType => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onProgressButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
      if (onButtonClick) onButtonClick(emblaApi);
    },
    [emblaApi, onButtonClick],
  );

  const onInit = useCallback((emblaAPI: EmblaCarouselType) => {
    setScrollSnaps(emblaAPI.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaAPI: EmblaCarouselType) => {
    setSelectedIndex(emblaAPI.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);

    emblaApi.on('reInit', onInit).on('reInit', onSelect).on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);

  return {
    selectedIndex,
    scrollSnaps,
    onProgressButtonClick,
  };
};

// eslint-disable-next-line valid-jsdoc
/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --slideshow-focus: hsl(var(--primary));
 *   --slideshow-mask: hsl(var(--foreground) / 80%);
 *   --slideshow-background: color-mix(in oklab, hsl(var(--primary)), black 75%);
 *   --slideshow-title: hsl(var(--background));
 *   --slideshow-title-font-family: var(--font-family-heading);
 *   --slideshow-description: hsl(var(--background) / 80%);
 *   --slideshow-description-font-family: var(--font-family-body);
 *   --slideshow-pagination: hsl(var(--background));
 *   --slideshow-play-border: hsl(var(--contrast-300) / 50%);
 *   --slideshow-play-border-hover: hsl(var(--contrast-300) / 80%);
 *   --slideshow-play-text: hsl(var(--background));
 *   --slideshow-number: hsl(var(--background));
 *   --slideshow-number-font-family: var(--font-family-mono);
 * }
 * ```
 */
export function Slideshow({
  className,
  slides,
  playOnInit = true,
  interval = 5000,
  isProductGallery = false,
  vertical = false,
  navigationColor = 'white',
}: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 20, axis: vertical ? 'y' : 'x' },
    [...(isProductGallery ? [] : [Autoplay({ delay: interval, playOnInit })]), Fade()],
  );
  const { selectedIndex, scrollSnaps, onProgressButtonClick } = useProgressButton(emblaApi);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playCount, setPlayCount] = useState(0);

  const toggleAutoplay = useCallback(() => {
    const autoplay = emblaApi?.plugins().autoplay;

    if (!autoplay) return;

    const playOrStop = autoplay.isPlaying() ? autoplay.stop : autoplay.play;

    playOrStop();
  }, [emblaApi]);

  const resetAutoplay = useCallback(() => {
    const autoplay = emblaApi?.plugins().autoplay;

    if (!autoplay) return;

    autoplay.reset();
  }, [emblaApi]);

  useEffect(() => {
    const autoplay = emblaApi?.plugins().autoplay;

    if (!autoplay) return;

    setIsPlaying(autoplay.isPlaying());
    emblaApi
      .on('autoplay:play', () => {
        setIsPlaying(true);
        setPlayCount(playCount + 1);
      })
      .on('autoplay:stop', () => {
        setIsPlaying(false);
      })
      .on('reInit', () => {
        setIsPlaying(autoplay.isPlaying());
      });
  }, [emblaApi, playCount]);

  return (
    <section
      className={clsx(
        'bg-contrast-200 @container relative aspect-[3/4] w-full lg:aspect-video xl:max-h-[calc(100svh-105px)] max-lg:landscape:aspect-video',
        className,
      )}
    >
      <div className="h-full overflow-hidden" ref={emblaRef}>
        <div className={clsx('flex h-full', vertical && 'flex-col')}>
          {slides.map(
            ({ title, description, showDescription = true, image, cta, showCta = true }, idx) => {
              return (
                <div
                  className={clsx(
                    'relative isolate h-full w-full min-w-0 shrink-0 grow-0 basis-full overflow-hidden',
                    !isProductGallery &&
                      'after:absolute after:inset-0 after:bg-gradient-to-b after:from-transparent after:to-black/60 lg:after:from-20%',
                  )}
                  key={idx}
                >
                  <div
                    className={clsx(
                      'absolute inset-x-0 bottom-0 z-10',
                      vertical && 'absolute inset-y-0 left-0 z-10',
                    )}
                  >
                    <div
                      className={clsx(
                        'ease-quad mx-auto w-full max-w-(--breakpoint-2xl) px-4 pt-12 pb-16 text-balance transition-all duration-300 @xl:px-6 @xl:pt-16 @xl:pb-20 @4xl:px-8 @4xl:pt-20',
                        vertical && 'flex h-full flex-col justify-center',
                        idx === selectedIndex
                          ? 'translate-y-0 opacity-100'
                          : 'translate-y-10 opacity-0',
                      )}
                    >
                      {title && idx === 0 ? (
                        <h1 className="m-0 max-w-xl font-[family-name:var(--slideshow-title-font-family,var(--font-family-heading))] text-4xl leading-none font-medium text-[var(--slideshow-title,hsl(var(--background)))] @2xl:text-5xl @2xl:leading-[.9] @4xl:text-6xl">
                          {title}
                        </h1>
                      ) : null}
                      {title && idx !== 0 ? (
                        <h2 className="m-0 max-w-xl font-[family-name:var(--slideshow-title-font-family,var(--font-family-heading))] text-4xl leading-none font-medium text-[var(--slideshow-title,hsl(var(--background)))] @2xl:text-5xl @2xl:leading-[.9] @4xl:text-6xl">
                          {title}
                        </h2>
                      ) : null}
                      {showDescription && (
                        <p className="mt-2 max-w-xl font-[family-name:var(--slideshow-description-font-family,var(--font-family-body))] text-base leading-normal text-[var(--slideshow-description,hsl(var(--background)/80%))] @xl:mt-3 @xl:text-lg">
                          {description}
                        </p>
                      )}
                      {showCta && (
                        <ButtonLink
                          className="mt-6 @xl:mt-8"
                          href={cta?.href ?? '#'}
                          shape={cta?.shape ?? 'rounded'}
                          size={cta?.size ?? 'medium'}
                          variant={cta?.variant ?? 'primary'}
                        >
                          {cta?.label ?? 'Learn more'}
                        </ButtonLink>
                      )}
                    </div>
                  </div>

                  {image?.src != null && image.src !== '' && (
                    <Image
                      alt={image.alt}
                      blurDataURL={image.blurDataUrl}
                      className="block h-full w-full object-cover"
                      fill
                      placeholder={
                        image.blurDataUrl != null && image.blurDataUrl !== '' ? 'blur' : 'empty'
                      }
                      priority={idx === 0}
                      sizes="100vw"
                      src={image.src}
                    />
                  )}
                </div>
              );
            },
          )}
        </div>
      </div>

      {/* Controls */}
      <div
        className={
          vertical
            ? 'absolute top-1/2 right-4 flex w-auto -translate-y-1/2 flex-col items-center'
            : 'absolute bottom-4 left-1/2 flex w-full max-w-(--breakpoint-2xl) -translate-x-1/2 flex-wrap items-center px-4 @xl:bottom-6 @xl:px-6 @4xl:px-8'
        }
      >
        {/* Progress Buttons */}
        {scrollSnaps.map((_: number, index: number) => {
          const dimensionStyle = index === selectedIndex ? 30 : undefined;
          const animationStyle = vertical
            ? 'animate-in slide-in-from-top opacity-100 ease-linear'
            : 'animate-in slide-in-from-left opacity-100 ease-linear';

          return (
            <button
              aria-label={`View image number ${index + 1}`}
              className="rounded-lg px-1.5 py-2 focus-visible:ring-2 focus-visible:ring-[var(--slideshow-focus,hsl(var(--primary)))] focus-visible:outline-0"
              key={index}
              onClick={() => {
                onProgressButtonClick(index);
                resetAutoplay();
              }}
            >
              <div className="relative overflow-hidden rounded-full">
                {/* White Bar - Current Index Indicator / Progress Bar */}
                <div
                  className={clsx(
                    'fill-mode-forwards absolute size-2 transition-all duration-300',
                    isPlaying ? 'running' : 'paused',
                    navigationColor === 'black' ? 'bg-black' : 'bg-contrast-200',
                    index === selectedIndex ? 'opacity-100' : 'opacity-0',
                    index === selectedIndex ? animationStyle : 'animate-out fade-out ease-out',
                  )}
                  key={`progress-${playCount}`} // Force the animation to restart when pressing "Play", to match animation with embla's autoplay timer
                  style={
                    vertical
                      ? {
                          animationDuration: index === selectedIndex ? `${interval}ms` : '200ms',
                          height: dimensionStyle,
                        }
                      : {
                          animationDuration: index === selectedIndex ? `${interval}ms` : '200ms',
                          width: dimensionStyle,
                        }
                  }
                />
                {/* Grey Bar BG */}
                <div
                  className={clsx(
                    'size-2 transition-all duration-300',
                    navigationColor === 'black' ? 'bg-black' : 'bg-contrast-200',
                    index === selectedIndex && navigationColor === 'black'
                      ? 'opacity-100'
                      : 'opacity-30',
                    index === selectedIndex && !isPlaying ? 'opacity-100' : 'opacity-30',
                  )}
                  style={vertical ? { height: dimensionStyle } : { width: dimensionStyle }}
                />
              </div>
            </button>
          );
        })}

        {/* Carousel Count - "01/03" */}
        {/* <span
          className={clsx(
            'mt-px ml-4 mr-3 hidden font-[family-name:var(--slideshow-number-font-family,var(--font-family-mono))] text-sm text-[var(--slideshow-number,hsl(var(--background)))] md:block',
            vertical ? 'mt-2' : '',
          )}
        >
          {selectedIndex + 1 < 10 ? `0${selectedIndex + 1}` : selectedIndex + 1}/
          {slides.length < 10 ? `0${slides.length}` : slides.length}
        </span> */}

        {/* Stop / Start Button */}
        {!isProductGallery && (
          <button
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className={clsx(
              'ease-quad flex h-7 w-7 items-center justify-center rounded-lg ring-[var(--slideshow-focus)] transition-[color,_opacity] duration-300 focus-visible:ring-0',
              navigationColor === 'black' ? 'text-black' : 'hover:text-primary text-white',
              vertical ? 'mt-2' : '',
            )}
            onClick={toggleAutoplay}
            type="button"
          >
            {isPlaying ? (
              <Pause className="pointer-events-none" size={16} strokeWidth={1.5} />
            ) : (
              <Play className="pointer-events-none" size={16} strokeWidth={1.5} />
            )}
          </button>
        )}
      </div>
    </section>
  );
}
