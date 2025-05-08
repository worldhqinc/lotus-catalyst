'use client';

import { ComponentPropsWithoutRef, useEffect, useRef, useState } from 'react';
import Headroom from 'react-headroom';

import { Banner } from '@/vibes/soul/primitives/banner';
import { Navigation } from '@/vibes/soul/primitives/navigation';

export interface HeaderProps {
  navigation: ComponentPropsWithoutRef<typeof Navigation>;
  banner?: ComponentPropsWithoutRef<typeof Banner>;
}

export function HeaderSection({ navigation, banner }: HeaderProps) {
  const [bannerElement, setBannerElement] = useState<HTMLElement | null>(null);
  const [bannerHeight, setBannerHeight] = useState(0);
  const [isFloating, setIsFloating] = useState(false);
  const headerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!bannerElement) return;

    const resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      entries.forEach((entry) => {
        setBannerHeight(entry.contentRect.height);
      });
    });

    resizeObserver.observe(bannerElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, [bannerElement]);

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

  return (
    <div>
      <Banner ref={setBannerElement} {...banner}>
        {banner?.children || null}
      </Banner>
      <div className="bg-[var(--header-background,hsl(var(--background)))]" ref={headerRef}>
        <Headroom
          className="[&_.headroom--unpinned]:![transform:translate3d(0,0,0)]"
          onUnfix={() => setIsFloating(false)}
          onUnpin={() => setIsFloating(true)}
          pinStart={bannerHeight}
        >
          <div>
            <Navigation {...navigation} isFloating={isFloating} />
          </div>
        </Headroom>
      </div>
    </div>
  );
}
