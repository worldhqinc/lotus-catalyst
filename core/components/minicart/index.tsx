import { Trash, X } from 'lucide-react';
import Image from 'next/image';

import { NumberInput } from '@/vibes/soul/form/number-input';
import { Button } from '@/vibes/soul/primitives/button';
import { Link } from '~/components/link';

interface CartItem {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image?: {
    src: string;
    alt: string;
  };
}

interface Props {
  items: CartItem[];
  onClose: () => void;
  onQuantityChange: (id: string, quantity: number) => void;
}

export function Minicart({ items, onClose, onQuantityChange }: Props) {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const savings = items.reduce((acc, item) => {
    if (!item.originalPrice) return acc;
    return acc + (item.originalPrice - item.price) * item.quantity;
  }, 0);

  return (
    <div className="bg-surface-secondary flex h-full flex-col">
      <div className="bg-background flex items-center gap-2 border-b border-[#e5e5e5] px-6 py-4">
        <div className="flex flex-1 items-center gap-2">
          <Button className="-ml-2.5" onClick={onClose} size="x-small" variant="ghost">
            <X size={20} />
          </Button>
          <h2 className="font-sans text-base font-medium">Your Cart</h2>
        </div>
        <span className="text-base">{items.length} items</span>
      </div>

      <div className="bg-background overflow-y-auto px-6 py-4">
        {items.map((item) => (
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
                <button className="-mr-2 flex items-start p-1 text-[#737373]">
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
                  onChange={(e) => onQuantityChange(item.id, parseInt(e.target.value, 10))}
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
          <Link className="flex-1" href="/cart">
            <Button className="w-full" variant="secondary">
              View cart
            </Button>
          </Link>
          <Link className="flex-1" href="/checkout">
            <Button className="w-full">Checkout</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
