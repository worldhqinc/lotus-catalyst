'use client';

import { MouseEvent } from 'react';

import { Link } from '~/components/link';
import { downloadFile } from '~/lib/utils';

export function DownloadableLink({
  href,
  assetUrl,
  assetFilename,
  className,
  children,
}: {
  href: string;
  assetUrl?: string;
  assetFilename?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const handleDownloadClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (assetUrl) {
      void downloadFile(assetUrl, assetFilename);
    }
  };

  return (
    <Link className={className} href={href} onClick={assetUrl ? handleDownloadClick : undefined}>
      {children}
    </Link>
  );
}
