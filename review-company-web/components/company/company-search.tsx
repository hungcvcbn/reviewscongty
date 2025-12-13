'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    // Small delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 200));
    
    if (onSearch) {
      onSearch(query);
    } else {
      router.push(`/companies?search=${encodeURIComponent(query)}`);
    }
    
    setIsSearching(false);
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
    if (onSearch) {
      onSearch('');
    }
  };

  const isLarge = size === 'lg';
  const inputClasses = isLarge 
    ? 'h-14 text-lg pl-14 pr-12' 
    : 'h-11 pl-11 pr-10';
  const iconClasses = isLarge 
    ? 'h-6 w-6 left-4' 
    : 'h-5 w-5 left-3.5';
  const buttonClasses = isLarge 
    ? 'h-14 px-8 text-lg min-w-[140px]' 
    : 'h-11 px-6 min-w-[100px]';

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 w-full">
      <div 
        className={cn(
          'relative flex-1',
          'transition-all duration-300',
          isFocused && 'scale-[1.01]'
        )}
      >
        {/* Search Icon */}
        <Search
          className={cn(
            'absolute top-1/2 -translate-y-1/2 z-10',
            'transition-all duration-200',
            iconClasses,
            isFocused ? 'text-blue-600' : 'text-gray-400'
          )}
        />
        
        {/* Input */}
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            inputClasses,
            'rounded-xl border-2',
            'transition-all duration-200',
            'placeholder:text-gray-400',
            isFocused 
              ? 'border-blue-500 ring-4 ring-blue-100 shadow-lg' 
              : 'border-gray-200 hover:border-gray-300 shadow-sm'
          )}
          aria-label="Tìm kiếm công ty"
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className={cn(
              'absolute top-1/2 -translate-y-1/2 z-10',
              'p-1.5 rounded-full',
              'text-gray-400 hover:text-gray-600',
              'hover:bg-gray-100',
              'transition-all duration-200',
              'animate-fade-in',
              isLarge ? 'right-4' : 'right-3'
            )}
            aria-label="Xóa tìm kiếm"
          >
            <X className={isLarge ? 'h-5 w-5' : 'h-4 w-4'} />
          </button>
        )}
      </div>

      {/* Search Button */}
      <Button 
        type="submit" 
        disabled={isSearching}
        className={cn(
          buttonClasses,
          'rounded-xl',
          'bg-blue-600 hover:bg-blue-700',
          'shadow-lg shadow-blue-200',
          'transition-all duration-200',
          'hover:shadow-xl hover:shadow-blue-300',
          'hover:-translate-y-0.5',
          'disabled:opacity-70 disabled:cursor-not-allowed'
        )}
      >
        {isSearching ? (
          <Loader2 className={cn('animate-spin', isLarge ? 'h-5 w-5' : 'h-4 w-4')} />
        ) : (
          <>
            <Search className={cn('mr-2', isLarge ? 'h-5 w-5' : 'h-4 w-4')} />
            Tìm kiếm
          </>
        )}
      </Button>
    </form>
  );
}
