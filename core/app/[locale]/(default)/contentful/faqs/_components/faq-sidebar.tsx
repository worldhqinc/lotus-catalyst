'use client';

import { clsx } from 'clsx';
import { useEffect, useState } from 'react';

import { Select } from '@/vibes/soul/form/select';
import { usePathname } from '~/i18n/routing';

interface FaqCategory {
  category: string;
  id: string;
  faqCategory?: string;
}

interface FaqSidebarProps {
  categories: FaqCategory[];
  faqCategoryHeader: string;
}

export function FaqSidebar({ categories, faqCategoryHeader }: FaqSidebarProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(categories[0]?.id ?? null);
  const pathname = usePathname();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;

            setActiveCategory(id);
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
    } else if (categories.length > 0 && categories[0]) {
      const firstCategory = categories[0];

      setActiveCategory(firstCategory.id);
    }

    return () => {
      observer.disconnect();
    };
  }, [categories, pathname]);

  const handleClick = (id: string) => {
    setActiveCategory(id);

    const element = document.getElementById(id);

    if (element) {
      let headerOffset;

      if (window.innerWidth < 1024) {
        headerOffset = 250;
      } else {
        headerOffset = 160;
      }

      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.addEventListener('resize', () => {
        if (window.innerWidth < 1024) {
          headerOffset = 250;
        } else {
          headerOffset = 160;
        }
      });

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  if (categories.length === 0) return null;

  return (
    <>
      <div className="hidden lg:flex lg:flex-col lg:items-start lg:justify-start">
        <div className="after:bg-primary relative py-2.5 pl-3 after:absolute after:top-0 after:left-0 after:h-full after:w-0.75">
          <h3 className="leading-[150%] font-medium tracking-[0.64px] uppercase">
            {faqCategoryHeader}
          </h3>
        </div>
        {categories.map(({ category, id }) => (
          <button
            className={clsx(
              'py-2 pl-3 text-sm transition-colors',
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
      <Select
        className="lg:hidden"
        name="faq-category-select"
        onValueChange={(value: string) => handleClick(value)}
        options={categories.map(({ category, id }) => ({
          label: category,
          value: id,
        }))}
        value={activeCategory ?? ''}
      />
    </>
  );
}
