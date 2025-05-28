'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import { useEffect } from 'react';

export function SmoothScrolling({ children }: { children: React.ReactNode }) {
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      lenis.options.duration = 1;
    }
  }, [lenis]);

  return <ReactLenis root>{children}</ReactLenis>;
}
