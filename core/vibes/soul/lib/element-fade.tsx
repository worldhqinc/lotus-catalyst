'use client';

import { clsx } from 'clsx';
import { useEffect, useRef, useState } from 'react';

export function ElementFade({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
            setIsVisible(true);
            observer.disconnect(); // Stop observing once visible
          }
        });
      },
      {
        threshold: 0.25,
        rootMargin: '-200px 0px',
      },
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={clsx(
        'ease-quad h-full w-full transition-all duration-300',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0',
        className,
      )}
      ref={elementRef}
    >
      {children}
    </div>
  );
}
