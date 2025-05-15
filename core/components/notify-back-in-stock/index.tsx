import { subscribe } from './_actions/subscribe';
import NotifyBackInStockModal from './_components/modal';

interface NotifyBackInStockProps {
  productId: string;
  buttonLabel?: string;
  buttonClassName?: string;
  buttonSize?: 'small' | 'medium';
  textCta?: boolean;
}

export default function NotifyBackInStock({
  productId,
  buttonLabel,
  buttonClassName,
  buttonSize = 'medium',
  textCta = false,
}: NotifyBackInStockProps) {
  return (
    <NotifyBackInStockModal
      action={subscribe}
      buttonClassName={buttonClassName}
      buttonLabel={buttonLabel}
      buttonSize={buttonSize}
      productId={productId}
      textCta={textCta}
    />
  );
}
