'use client';

import { Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';

import { Input } from '@/vibes/soul/form/input';
import { useRouter } from '~/i18n/routing';

export function FaqSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      setSearchTerm(value);

      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set('search', value);
      } else {
        params.delete('search');
      }

      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <Input
      className="w-full lg:max-w-[204px]"
      onChange={handleSearch}
      placeholder="Search FAQs..."
      prepend={<Search className="h-4 w-4" />}
      type="search"
      value={searchTerm}
    />
  );
}
