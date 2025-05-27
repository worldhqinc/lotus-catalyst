import { subscribe } from './_actions/subscribe';
import NotifyBackInStockModal from './_components/modal';

interface NotifyBackInStockProps {
  sku: string;
  buttonLabel?: string;
  buttonClassName?: string;
  buttonSize?: 'small' | 'medium';
  textCta?: boolean;
}

export default function NotifyBackInStock({
  sku,
  buttonLabel,
  buttonClassName,
  buttonSize = 'small',
  textCta = false,
}: NotifyBackInStockProps) {
  return (
    <NotifyBackInStockModal
      action={subscribe}
      buttonClassName={buttonClassName}
      buttonLabel={buttonLabel}
      buttonSize={buttonSize}
      sku={sku}
      textCta={textCta}
    />
  );
}
