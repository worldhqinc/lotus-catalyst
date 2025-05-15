'use client';

import { Mail, Printer } from 'lucide-react';
import {
  EmailShareButton,
  FacebookShareButton,
  PinterestShareButton,
  TwitterShareButton,
} from 'react-share';

import { Facebook, Pinterest, X } from '@/vibes/soul/sections/footer/social-icons';
import Placeholder from '~/public/images/Lotus-Media-Placeholder.png';

interface Props {
  media?: string;
  url: string;
}

export default function SocialShare({ media, url }: Props) {
  const print = () => {
    window.print();
  };

  return (
    <div className="mx-auto flex max-w-2xl justify-center space-x-4 lg:space-x-8">
      <FacebookShareButton
        className="!text-foreground ease-quad hover:!text-primary transition-colors duration-200"
        url={url}
      >
        <Facebook />
      </FacebookShareButton>
      <TwitterShareButton
        className="!text-foreground ease-quad hover:!text-primary transition-colors duration-200"
        url={url}
      >
        <X />
      </TwitterShareButton>
      <PinterestShareButton
        className="!text-foreground ease-quad hover:!text-primary transition-colors duration-200"
        media={media || Placeholder.src}
        url={url}
      >
        <Pinterest />
      </PinterestShareButton>
      <EmailShareButton
        className="!text-foreground ease-quad hover:!text-primary transition-colors duration-200"
        url={url}
      >
        <Mail className="h-6 w-6" />
      </EmailShareButton>
      <button
        className="!text-foreground ease-quad hover:!text-primary transition-colors duration-200"
        onClick={print}
        type="button"
      >
        <Printer className="h-6 w-6" />
      </button>
    </div>
  );
}
