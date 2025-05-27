'use client';

import { ComponentPropsWithoutRef, useEffect, useRef, useState } from 'react';

import { Banner } from '@/vibes/soul/primitives/banner';
import { Navigation } from '@/vibes/soul/primitives/navigation';

export interface HeaderProps {
  navigation: ComponentPropsWithoutRef<typeof Navigation>;
  banner?: ComponentPropsWithoutRef<typeof Banner>;
}

export function HeaderSection({ navigation, banner }: HeaderProps) {
  const [isFloating, setIsFloating] = useState(false);
  const headerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function setHeaderHeightVar() {
      if (headerRef.current) {
        document.body.style.setProperty(
          '--site-header-height',
          `${headerRef.current.offsetHeight}px`,
        );
      }
    }

    setHeaderHeightVar();
    window.addEventListener('resize', setHeaderHeightVar);

    return () => window.removeEventListener('resize', setHeaderHeightVar);
  }, []);

  useEffect(() => {
    function handleScroll() {
      setIsFloating(window.scrollY > 36);
    }

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Banner {...banner}>{banner?.children || null}</Banner>
      <div
        className="sticky top-0 z-20 bg-[var(--header-background,hsl(var(--background)))]"
        ref={headerRef}
      >
        <div>
          <Navigation {...navigation} isFloating={isFloating} />
        </div>
      </div>
    </>
  );
}
