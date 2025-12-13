'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Building2, Search, LogOut, User, Settings, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { isAdmin, isManager, isCompanyOwner } from '@/lib/auth';
import { useState, useRef, useEffect } from 'react';

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleLogout = () => {
    logout();
    router.push('/');
    setShowMenu(false);
  };

  const canAccessAdmin = user && (isAdmin(user) || isManager(user));
  const canAccessCompany = user && (isCompanyOwner(user) || isAdmin(user) || isManager(user));

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
          {canAccessAdmin && (
            <Link
              href="/admin"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Quản trị
            </Link>
          )}
          {canAccessCompany && (
            <Link
              href="/company"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Quản lý công ty
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/companies">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>
          </Link>
          
          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Avatar className="h-8 w-8">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt={user.name} />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-600 text-sm font-medium">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </Avatar>
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {user?.name}
                </span>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border py-1 z-50">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => setShowMenu(false)}
                  >
                    <User className="h-4 w-4" />
                    Hồ sơ
                  </Link>
                  {canAccessAdmin && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      onClick={() => setShowMenu(false)}
                    >
                      <Shield className="h-4 w-4" />
                      Quản trị
                    </Link>
                  )}
                  {canAccessCompany && (
                    <Link
                      href="/company"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      onClick={() => setShowMenu(false)}
                    >
                      <Settings className="h-4 w-4" />
                      Quản lý công ty
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <Button variant="outline" className="hidden md:flex">
                Đăng nhập
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
