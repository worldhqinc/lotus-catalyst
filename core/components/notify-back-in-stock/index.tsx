import { subscribe } from './_actions/subscribe';
import NotifyBackInStockModal from './_components/modal';

interface NotifyBackInStockProps {
  productId: string;
  ctaLabel?: string;
}

export default function NotifyBackInStock({ productId, ctaLabel }: NotifyBackInStockProps) {
  return <NotifyBackInStockModal action={subscribe} ctaLabel={ctaLabel} productId={productId} />;
}
