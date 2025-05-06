'use client';

import { clsx } from 'clsx';
import { useEffect, useState } from 'react';

import { usePathname } from '~/i18n/routing';

interface FaqCategory {
  category: string;
  id: string;
}

interface FaqSidebarProps {
  categories: FaqCategory[];
}

export function FaqSidebar({ categories }: FaqSidebarProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;

            setActiveCategory(id);
            window.history.replaceState(null, '', `${pathname}#${id}`);
          }
        });
      },
      {
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0.5,
      },
    );

    categories.forEach(({ id }) => {
      const element = document.getElementById(id);

      if (element) {
        observer.observe(element);
      }
    });

    const hash = window.location.hash.slice(1);

    if (hash) {
      setActiveCategory(hash);
    }

    return () => {
      observer.disconnect();
    };
  }, [categories, pathname]);

  const handleClick = (id: string) => {
    setActiveCategory(id);

    const element = document.getElementById(id);

    if (element) {
      const headerOffset = 128;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  if (categories.length === 0) return null;

  return (
    <div className="mt-8 flex flex-col items-start justify-start lg:sticky lg:top-32 lg:col-span-2 lg:max-h-max">
      {categories.map(({ category, id }) => (
        <button
          className={clsx(
            'py-2 text-sm transition-colors',
            activeCategory === id
              ? 'text-foreground font-medium'
              : 'text-contrast-400 hover:text-foreground',
          )}
          key={id}
          onClick={() => handleClick(id)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
