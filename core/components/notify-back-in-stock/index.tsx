import { subscribe } from './_actions/subscribe';
import NotifyBackInStockModal from './_components/modal';

interface NotifyBackInStockProps {
  productId: string;
  ctaLabel?: string;
  buttonClassName?: string;
  buttonSize?: 'small' | 'medium';
}

export default function NotifyBackInStock({
  productId,
  ctaLabel,
  buttonClassName,
  buttonSize = 'medium',
}: NotifyBackInStockProps) {
  return (
    <NotifyBackInStockModal
      action={subscribe}
      buttonClassName={buttonClassName}
      buttonSize={buttonSize}
      ctaLabel={ctaLabel}
      productId={productId}
    />
  );
}
