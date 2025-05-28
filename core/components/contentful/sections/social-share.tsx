'use client';

import { clsx } from 'clsx';
import { Mail, Printer } from 'lucide-react';
import { EmailShareButton, FacebookShareButton, PinterestShareButton } from 'react-share';

import { Facebook, Pinterest } from '@/vibes/soul/sections/footer/social-icons';
import Placeholder from '~/public/images/Lotus-Media-Placeholder.png';

interface Props {
  align?: 'center' | 'left' | 'right';
  media?: string;
  title: string;
  url: string;
}

export default function SocialShare({ align = 'center', media, url }: Props) {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div
      className={clsx(
        'mx-auto flex max-w-2xl items-center gap-8',
        align === 'center' && 'justify-center',
        align === 'left' && 'justify-start',
        align === 'right' && 'justify-end',
      )}
    >
      <FacebookShareButton
        className="!text-foreground ease-quad hover:!text-primary transition-colors duration-200"
        url={url}
      >
        <Facebook />
      </FacebookShareButton>
      <PinterestShareButton
        className="!text-foreground ease-quad hover:!text-primary transition-colors duration-200"
        media={media || Placeholder.src}
        url={url}
      >
        <Pinterest />
      </PinterestShareButton>
      <EmailShareButton
        body="This recipe from Lotus Cooking looks delicious!"
        className="!text-foreground ease-quad hover:!text-primary transition-colors duration-200"
        subject="Check out this Lotus Cooking Recipe!"
        url={url}
      >
        <Mail className="h-6 w-6" />
      </EmailShareButton>
      <button
        className="!text-foreground ease-quad hover:!text-primary transition-colors duration-200"
        onClick={handlePrint}
        type="button"
      >
        <Printer className="h-6 w-6" />
      </button>
    </div>
  );
}
