'use client';

import { Share } from 'lucide-react';
import { useState } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { Button } from '@/vibes/soul/primitives/button';
import { toast } from '@/vibes/soul/primitives/toaster';
import { Modal } from '~/components/modal';
import { ShareWishlistModal } from '~/components/wishlist/modals/share';

interface Props {
  productName: string;
  productUrl: string;
  isMobileUser: Streamable<boolean>;
  modalTitle: string;
  successMessage: string;
  copiedMessage: string;
  closeLabel: string;
}

export const ProductShareButton = ({
  productName,
  productUrl,
  isMobileUser,
  modalTitle,
  successMessage,
  copiedMessage,
  closeLabel,
}: Props) => {
  const [open, setOpen] = useState(false);
  const getShareUrl = () => String(new URL(productUrl, window.location.origin));

  const nativeShare = async () => {
    try {
      await navigator.share({ url: getShareUrl(), title: productName });
      toast.success(successMessage);
    } catch {
      // noop
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      toast.success(copiedMessage);
      setOpen(false);
    } catch {
      // noop
    }
  };

  const ShareButton = (
    <Button size="small" variant="link">
      <Share size={20} strokeWidth={1.5} />
      <span className="text-base">Share</span>
    </Button>
  );

  return (
    <Stream fallback={ShareButton} value={isMobileUser}>
      {(isMobile) => {
        if (isMobile) {
          return (
            <Button onClick={nativeShare} size="small" variant="link">
              <Share size={20} strokeWidth={1.5} />
              <span className="text-base">Share</span>
            </Button>
          );
        }

        return (
          <Modal
            buttons={[
              { type: 'cancel', label: closeLabel },
              { label: 'Copy', variant: 'primary', action: copyToClipboard },
            ]}
            className="max-w-lg min-w-64 @lg:min-w-96"
            isOpen={open}
            setOpen={setOpen}
            title={modalTitle}
            trigger={ShareButton}
          >
            <ShareWishlistModal publicUrl={productUrl} />
          </Modal>
        );
      }}
    </Stream>
  );
};
