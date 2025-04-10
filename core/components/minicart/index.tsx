'use client';

import { parseWithZod } from '@conform-to/zod';
import { Trash, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { startTransition, useActionState, useEffect, useOptimistic } from 'react';
import { useFormStatus } from 'react-dom';
import { z } from 'zod';

import { NumberInput } from '@/vibes/soul/form/number-input';
import { Button } from '@/vibes/soul/primitives/button';
import { Image } from '~/components/image';
import { Link } from '~/components/link';
import { type CartItem, minicartAction } from '~/components/minicart/_actions/minicart';

import { useRouter } from '~/i18n/routing';
import { CompleteKitchen } from './complete-kitchen';

interface Props {
  cartHref: string;
  initialItems: CartItem[];
  onClose: () => void;
}

const schema = z.object({
  id: z.string(),
  quantity: z.coerce.number().optional(),
  intent: z.enum(['update', 'remove']),
});

export function Minicart({ initialItems, onClose, cartHref }: Props) {
  const t = useTranslations('Minicart');
  const router = useRouter();
  const [{ items, lastResult }, formAction] = useActionState(minicartAction, {
    items: initialItems,
    lastResult: null,
  });

  useEffect(() => {
    if (lastResult?.status === 'success') {
      // This is needed to refresh the Data Cache after the cart has been updated.
      router.refresh();
    }
  }, [lastResult]);

  const [optimisticItems, setOptimisticItems] = useOptimistic<CartItem[], FormData>(
    items,
    (state, formData) => {
      const submission = parseWithZod(formData, { schema });

      if (submission.status !== 'success') return state;

      const { id, quantity, intent } = submission.value;

      if (quantity === undefined) return state;

      switch (intent) {
        case 'update':
          return state.map((item) => (item.id === id ? { ...item, quantity } : item));

        case 'remove':
          return state.filter((item) => item.id !== id);

        default:
          return state;
      }
    },
  );

  const handleRemoveItem = (id: string) => {
    startTransition(() => {
      const formData = new FormData();

      formData.set('id', id);
      formData.set('intent', 'remove');
      formAction(formData);
      setOptimisticItems(formData);
    });
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    startTransition(() => {
      const formData = new FormData();

      formData.set('id', id);
      formData.set('quantity', quantity.toString());
      formData.set('intent', 'update');

      if (quantity === 0) {
        handleRemoveItem(id);
      } else {
        formAction(formData);
        setOptimisticItems(formData);
      }
    });
  };

  const subtotal = optimisticItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const savings = optimisticItems.reduce((acc, item) => {
    if (!item.originalPrice) return acc;

    return acc + (item.originalPrice - item.price) * item.quantity;
  }, 0);

  const { pending } = useFormStatus();

  if (pending || optimisticItems.length === 0) {
    return (
      <div className="bg-surface-secondary flex h-full flex-col">
        <div className="bg-background flex items-center gap-2 border-b border-[#e5e5e5] px-6 py-4">
          <div className="flex flex-1 items-center gap-2">
            <Button
              className="-ml-2.5"
              onClick={onClose}
              shape="circle"
              size="x-small"
              variant="ghost"
            >
              <X size={20} />
            </Button>
            <h2 className="font-sans text-base font-medium">{t('title')}</h2>
          </div>
          <span className="text-sm sm:text-base">{pending ? 'Loading...' : '0 items'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-secondary flex h-full flex-col">
      <div className="bg-background flex items-center gap-2 border-b border-[#e5e5e5] px-6 py-4">
        <div className="flex flex-1 items-center gap-2">
          <Button
            className="-ml-2.5"
            onClick={onClose}
            shape="circle"
            size="x-small"
            variant="ghost"
          >
            <X size={20} />
          </Button>
          <h2 className="font-sans text-base font-medium">{t('title')}</h2>
        </div>
        <span className="text-sm sm:text-base">
          {t('items', { count: optimisticItems.length })}
        </span>
      </div>

      <div className="bg-background space-y-4 overflow-y-auto px-4 py-4 sm:space-y-6 sm:px-6">
        {optimisticItems.map((item) => (
          <div className="flex gap-3 sm:gap-4" key={item.id}>
            <div className="border-surface-image bg-surface-image relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border sm:h-24 sm:w-24">
              {item.image && (
                <Image
                  alt={item.image.alt}
                  className="object-cover"
                  fill
                  sizes="(max-width: 640px) 80px, 96px"
                  src={item.image.src}
                />
              )}
            </div>
            <div className="flex flex-1 flex-col justify-between gap-2 sm:gap-2">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-2">
                  <h3 className="line-clamp-1 font-medium">{item.title}</h3>
                  <p className="text-contrast-400 line-clamp-1 text-xs sm:text-sm">
                    {item.subtitle}
                  </p>
                </div>
                <button
                  className="flex items-start p-1 text-[#737373]"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <Trash size={16} strokeWidth={1} />
                </button>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-end gap-2">
                  <span>${item.price.toFixed(2)}</span>
                  {!!item.originalPrice && (
                    <span className="text-contrast-400 text-sm line-through sm:text-base">
                      ${item.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <NumberInput
                  decrementLabel="Decrease quantity"
                  incrementLabel="Increase quantity"
                  min={0}
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
                  value={item.quantity}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto">
        <CompleteKitchen
          items={optimisticItems}
          nextLabel={t('completeKitchen.nextProducts')}
          previousLabel={t('completeKitchen.previousProducts')}
          subtitle={t('completeKitchen.addToCart')}
          title={t('completeKitchen.title')}
        />

        <div className="bg-background flex flex-col gap-4 border-t border-[#e5e5e5] px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-1">
            {savings > 0 && (
              <div className="flex justify-between text-sm">
                <span>{t('savings')}</span>
                <span>${savings.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>{t('subtotal')}</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            <Link className="flex-1" href={cartHref} onClick={onClose}>
              <Button className="w-full" variant="secondary">
                {t('viewCart')}
              </Button>
            </Link>
            <Link className="flex-1" href="/checkout" onClick={onClose}>
              <Button className="w-full">{t('checkout')}</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
