import { subscribe } from './_actions/subscribe';
import NotifyBackInStockModal from './_components/modal';

export default function NotifyBackInStock({ productId }: { productId: string }) {
  return <NotifyBackInStockModal action={subscribe} productId={productId} />;
}
