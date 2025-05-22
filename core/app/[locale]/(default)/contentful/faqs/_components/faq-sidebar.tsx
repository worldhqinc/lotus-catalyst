'use client';

import { clsx } from 'clsx';
import { useEffect, useState } from 'react';

import { SelectField } from '@/vibes/soul/form/select-field';
import { usePathname } from '~/i18n/routing';

interface FaqCategory {
  category: string;
  id: string;
  faqCategory: string;
  faqParentCategory: string;
}

interface FaqSidebarProps {
  categories: FaqCategory[];
}

export function FaqSidebar({ categories }: FaqSidebarProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(categories[0]?.id ?? null);
  const pathname = usePathname();

  // Group categories by faqCategory
  const groupedCategories = categories.reduce<Record<string, FaqCategory[]>>((acc, category) => {
    const group = acc[category.faqCategory] || [];

    return {
      ...acc,
      [category.faqCategory]: [...group, category],
    };
  }, {});

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
      const headerOffset = window.innerWidth < 1024 ? 250 : 160;
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
    <>
      <div className="hidden lg:flex lg:flex-col lg:items-start lg:justify-start">
        {Object.entries(groupedCategories).map(([faqCategory, categoryGroup]) => {
          // Check if any faqParentCategory in this group is active
          const isCategoryActive = categoryGroup.some(({ id }) => id === activeCategory);

          return (
            <div className="w-full" key={faqCategory}>
              <div
                className={clsx(
                  'relative py-2.5 pl-3 after:absolute after:top-0 after:left-0 after:h-full after:w-0.75',
                  isCategoryActive ? 'after:bg-primary' : 'after:bg-transparent',
                )}
              >
                <h3 className="leading-[150%] font-medium tracking-[0.64px] uppercase">
                  {faqCategory}
                </h3>
              </div>
              <ul className="flex flex-col items-start">
                {categoryGroup.map(({ faqParentCategory, id }) => (
                  <li key={id}>
                    <button
                      className={clsx(
                        'py-2 pl-3 text-sm transition-colors',
                        activeCategory === id
                          ? 'text-foreground font-medium'
                          : 'text-contrast-400 hover:text-foreground',
                      )}
                      onClick={() => handleClick(id)}
                    >
                      {faqParentCategory}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <SelectField
        className="lg:hidden"
        hideLabel
        label="Select a category"
        name="faq-category-select"
        onValueChange={(value: string) => handleClick(value)}
        options={categories.map(({ faqParentCategory, id }) => ({
          label: faqParentCategory,
          value: id,
        }))}
        placeholder="Select a category"
        value={activeCategory ?? ''}
      />
    </>
  );
}
