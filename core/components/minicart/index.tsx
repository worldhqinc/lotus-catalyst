'use client';

import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { Trash, X } from 'lucide-react';
import Image from 'next/image';
import { startTransition, useActionState, useEffect, useOptimistic } from 'react';
import { useFormStatus } from 'react-dom';
import { z } from 'zod';

import { NumberInput } from '@/vibes/soul/form/number-input';
import { Button } from '@/vibes/soul/primitives/button';
import { toast } from '@/vibes/soul/primitives/toaster';
import { Link } from '~/components/link';
import type { CartItem } from '~/components/minicart/_actions/minicart';
import { minicartAction } from '~/components/minicart/_actions/minicart';

interface Props {
  initialItems: CartItem[];
  onClose: () => void;
}

const schema = z.object({
  id: z.string(),
  quantity: z.coerce.number().optional(),
  intent: z.enum(['update', 'remove']),
});

export function Minicart({ initialItems, onClose }: Props) {
  const [{ items, lastResult }, formAction] = useActionState(minicartAction, {
    items: initialItems,
    lastResult: null,
  });

  const [optimisticItems, setOptimisticItems] = useOptimistic<CartItem[], FormData>(
    items,
    (state, formData) => {
      const submission = parseWithZod(formData, { schema });

      if (submission.status !== 'success') return state;

      const { id, quantity, intent } = submission.value;

      switch (intent) {
        case 'update':
          return state.map((item) => (item.id === id ? { ...item, quantity: quantity! } : item));
        case 'remove':
          return state.filter((item) => item.id !== id);
        default:
          return state;
      }
    },
  );

  const [form] = useForm({
    lastResult,
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  useEffect(() => {
    if (form.errors) {
      form.errors.forEach((error) => {
        toast.error(error);
      });
    }
  }, [form.errors]);

  const handleQuantityChange = (id: string, quantity: number) => {
    startTransition(() => {
      const formData = new FormData();
      formData.set('id', id);
      formData.set('quantity', quantity.toString());
      formData.set('intent', 'update');
      formAction(formData);
      setOptimisticItems(formData);
    });
  };

  const handleRemoveItem = (id: string) => {
    startTransition(() => {
      const formData = new FormData();
      formData.set('id', id);
      formData.set('intent', 'remove');
      formAction(formData);
      setOptimisticItems(formData);
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
            <Button className="-ml-2.5" onClick={onClose} size="x-small" variant="ghost">
              <X size={20} />
            </Button>
            <h2 className="font-sans text-base font-medium">Your Cart</h2>
          </div>
          <span className="text-base">{pending ? 'Loading...' : 'Empty'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-secondary flex h-full flex-col">
      <div className="bg-background flex items-center gap-2 border-b border-[#e5e5e5] px-6 py-4">
        <div className="flex flex-1 items-center gap-2">
          <Button className="-ml-2.5" onClick={onClose} size="x-small" variant="ghost">
            <X size={20} />
          </Button>
          <h2 className="font-sans text-base font-medium">Your Cart</h2>
        </div>
        <span className="text-base">{optimisticItems.length} items</span>
      </div>

      <div className="bg-background overflow-y-auto px-6 py-4">
        {optimisticItems.map((item) => (
          <div key={item.id} className="mb-6 flex gap-4">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
              {item.image && (
                <Image
                  alt={item.image.alt}
                  className="object-cover"
                  fill
                  sizes="96px"
                  src={item.image.src}
                />
              )}
            </div>
            <div className="flex flex-1 flex-col gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.subtitle}</p>
                </div>
                <button
                  className="-mr-2 flex items-start p-1 text-[#737373]"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <Trash size={16} strokeWidth={1} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-end gap-2">
                  <span>${item.price}</span>
                  {item.originalPrice && (
                    <span className="text-contrast-400 line-through">${item.originalPrice}</span>
                  )}
                </div>
                <NumberInput
                  className="w-24"
                  value={item.quantity}
                  min={0}
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
                  decrementLabel="Decrease quantity"
                  incrementLabel="Increase quantity"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-background mt-auto flex flex-col gap-4 border-t border-[#e5e5e5] px-6 py-4">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-sm">
            <span>Savings</span>
            <span>${savings}</span>
          </div>
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-medium">${subtotal}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <Link className="flex-1" href="/cart" onClick={onClose}>
            <Button className="w-full" variant="secondary">
              View cart
            </Button>
          </Link>
          <Link className="flex-1" href="/checkout" onClick={onClose}>
            <Button className="w-full">Checkout</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
