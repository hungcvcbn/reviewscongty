'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Building2, Search } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">ReviewCongTy</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Trang chủ
          </Link>
          <Link
            href="/companies"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Danh sách công ty
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/companies">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="outline" className="hidden md:flex">
            Đăng nhập
          </Button>
        </div>
      </div>
    </header>
  );
}
