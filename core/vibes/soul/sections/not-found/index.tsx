'use client';

import { Button } from '@/vibes/soul/primitives/button';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { useSearch } from '~/context/search-context';

export interface NotFoundProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

// eslint-disable-next-line valid-jsdoc
/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --not-found-font-family: var(--font-family-body);
 *   --not-found-title-font-family: var(--font-family-heading);
 *   --not-found-title: hsl(var(--foreground));
 *   --not-found-subtitle: hsl(var(--contrast-500));
 * }
 * ```
 */
export function NotFound({
  title = 'Not found',
  subtitle = "Take a look around if you're lost.",
  className = '',
}: NotFoundProps) {
  const { setIsSearchOpen } = useSearch();

  const handleOpenSearch = () => {
    setIsSearchOpen(true);
  };

  return (
    <SectionLayout className={className} containerSize="2xl">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="font-heading text-4xl leading-[100%] tracking-[-0.8px] uppercase @4xl:text-6xl @4xl:leading-[100%] @4xl:tracking-[-1.2px]">
          {title}
        </h1>
        <p className="text-contrast-400 mt-4 leading-[150%]">{subtitle}</p>
        <Button className="mt-8" onClick={handleOpenSearch}>
          Search
        </Button>
      </header>
    </SectionLayout>
  );
}
