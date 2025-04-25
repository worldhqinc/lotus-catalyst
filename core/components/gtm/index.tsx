'use client';

import dynamic from 'next/dynamic';

const GoogleTagManagerScript = dynamic(() => import('./script'), { ssr: false });

export default function LoadGoogleTagManager() {
  return <GoogleTagManagerScript />;
}
