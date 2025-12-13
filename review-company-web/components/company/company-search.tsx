'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface CompanySearchProps {
  defaultValue?: string;
  placeholder?: string;
  size?: 'default' | 'lg';
  onSearch?: (query: string) => void;
}

export function CompanySearch({
  defaultValue = '',
  placeholder = 'Tìm kiếm công ty...',
  size = 'default',
  onSearch,
}: CompanySearchProps) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    } else {
      router.push(`/companies?search=${encodeURIComponent(query)}`);
    }
  };

  const inputClasses = size === 'lg' ? 'h-14 text-lg pl-12' : 'h-10 pl-10';
  const iconClasses = size === 'lg' ? 'h-6 w-6 left-4' : 'h-4 w-4 left-3';
  const buttonClasses = size === 'lg' ? 'h-14 px-8 text-lg' : 'h-10 px-4';

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <div className="relative flex-1">
        <Search
          className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${iconClasses}`}
        />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={inputClasses}
        />
      </div>
      <Button type="submit" className={buttonClasses}>
        Tìm kiếm
      </Button>
    </form>
  );
}
