'use client';

import { clsx } from 'clsx';

import { Image } from '~/components/image';
import { Badge } from '~/vibes/soul/primitives/badge';
import { Slideshow } from '~/vibes/soul/sections/slideshow';

export interface ProductGalleryProps {
  badge?: string | null;
  featuredImage?: { alt: string; src: string } | null;
  images: Array<{ alt: string; src: string }>;
  className?: string;
}

export function ProductGallery({ featuredImage, images, className, badge }: ProductGalleryProps) {
  const allImages = [featuredImage, ...images];

  return (
    <div className="relative">
      <div className={clsx('hidden grid-cols-2 gap-4 @2xl:grid', className)}>
        {featuredImage && (
          <div
            className={clsx(
              'bg-surface-image relative col-span-2 aspect-square overflow-hidden rounded-xl',
            )}
          >
            <Image
              alt={featuredImage.alt}
              className="size-full object-cover"
              fill
              sizes="(min-width: 42rem) 50vw, 100vw"
              src={featuredImage.src}
            />
          </div>
        )}
        {images.slice(0, 5).map((image, idx) => (
          <div
            className={clsx('bg-surface-image relative aspect-square overflow-hidden rounded-lg')}
            key={idx}
          >
            <Image
              alt={image.alt}
              className="size-full object-cover"
              fill
              sizes="(min-width: 42rem) 50vw, 100vw"
              src={image.src}
            />
          </div>
        ))}
      </div>
      <div className="@2xl:hidden">
        <Slideshow
          className="aspect-square !h-auto"
          slides={allImages.map((image) => ({
            image: {
              alt: image?.alt ?? '',
              src: image?.src ?? '',
            },
            title: '',
            showDescription: false,
            showCta: false,
          }))}
        />
      </div>
      {!!badge && <Badge className="!bg-background absolute top-2 left-2">{badge}</Badge>}
    </div>
  );
}
