'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Image } from '~/components/image';
import { Link } from '~/components/link';
import { Button } from '~/vibes/soul/primitives/button';
import { type CartItem } from './_actions/minicart';

interface Props {
  items: CartItem[];
  title?: string;
  subtitle?: string;
  nextLabel?: string;
  previousLabel?: string;
}

interface RelatedProduct {
  id: string;
  title: string;
  subtitle?: string;
  price: number;
  originalPrice?: number;
  image?: {
    src: string;
    alt: string;
  };
  href: string;
}

// Mock data for testing
const mockRelatedProducts: RelatedProduct[] = [
  {
    id: '1',
    title: 'The Perfectionist™ Pro',
    subtitle: 'Professional Air Fryer and Convection Oven',
    price: 499,
    originalPrice: 599,
    image: {
      src: 'https://cdn11.bigcommerce.com/s-qfzerv205w/images/stencil/original/products/115/489/Perfectionist-Pro-Main__37487.1603748583.png',
      alt: 'The Perfectionist Pro Air Fryer',
    },
    href: '/product/perfectionist-pro',
  },
  {
    id: '2',
    title: 'The Sous Master',
    subtitle: 'Smart Sous Vide Precision Cooker',
    price: 299,
    originalPrice: 399,
    href: '/product/sous-master',
  },
  {
    id: '3',
    title: 'The Kitchen Command™',
    subtitle: 'Smart Kitchen Hub and Display',
    price: 799,
    originalPrice: 999,
    href: '/product/kitchen-command',
  },
];

export function CompleteKitchen({
  items,
  title = 'Complete the kitchen',
  subtitle = 'Add to cart',
  nextLabel = 'Next products',
  previousLabel = 'Previous products',
}: Props) {
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Temporarily using mock data instead of API call
    setRelatedProducts(mockRelatedProducts);
    setIsLoading(false);
  }, [items]);

  if (isLoading || relatedProducts.length === 0) {
    return null;
  }

  const productsToShow = relatedProducts.slice(currentIndex, currentIndex + 1);
  const canGoNext = currentIndex < relatedProducts.length - 1;
  const canGoPrevious = currentIndex > 0;

  return (
    <div className="space-y-2 px-4 py-4 sm:px-6">
      <div className="flex items-center justify-between">
        <h2 className="font-sans text-base font-medium">{title}</h2>
        <div className="flex gap-1">
          <Button
            disabled={!canGoPrevious}
            onClick={() => setCurrentIndex((prev) => prev - 1)}
            shape="circle"
            size="small"
            variant="ghost"
          >
            <ChevronLeft size={24} strokeWidth={1.5} />
            <span className="sr-only">{previousLabel}</span>
          </Button>
          <Button
            disabled={!canGoNext}
            onClick={() => setCurrentIndex((prev) => prev + 1)}
            shape="circle"
            size="small"
            variant="ghost"
          >
            <ChevronRight size={24} strokeWidth={1.5} />
            <span className="sr-only">{nextLabel}</span>
          </Button>
        </div>
      </div>
      <div className="bg-background rounded-lg p-4">
        {productsToShow.map((product) => (
          <div className="flex gap-3 sm:gap-4" key={product.id}>
            <div className="border-surface-image bg-surface-image relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border sm:h-24 sm:w-24">
              {product.image && (
                <Image
                  alt={product.image.alt}
                  className="object-cover"
                  fill
                  sizes="(max-width: 640px) 80px, 96px"
                  src={product.image.src}
                />
              )}
            </div>
            <div className="flex flex-1 flex-col justify-between gap-2">
              <div className="flex flex-col gap-2">
                <h3 className="line-clamp-1 font-medium">{product.title}</h3>
                {product.subtitle && (
                  <p className="text-contrast-400 line-clamp-1 text-xs sm:text-sm">
                    {product.subtitle}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-end gap-2">
                  <span>${product.price.toFixed(2)}</span>
                  {!!product.originalPrice && (
                    <span className="text-contrast-400 text-sm line-through sm:text-base">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <Link href={product.href}>
                  <Button variant="link">{subtitle}</Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
