import { subscribe } from './_actions/subscribe';
import NotifyBackInStockModal from './_components/modal';

interface NotifyBackInStockProps {
  productId: string;
  buttonLabel?: string;
  buttonClassName?: string;
  buttonSize?: 'small' | 'medium';
}

export default function NotifyBackInStock({
  productId,
  buttonLabel,
  buttonClassName,
  buttonSize = 'medium',
}: NotifyBackInStockProps) {
  return (
    <NotifyBackInStockModal
      action={subscribe}
      buttonClassName={buttonClassName}
      buttonLabel={buttonLabel}
      buttonSize={buttonSize}
      productId={productId}
    />
  );
}
