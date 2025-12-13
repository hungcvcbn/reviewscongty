"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  Building2,
  Search,
  LogOut,
  User,
  Settings,
  Shield,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { isAdmin, isManager, isCompanyOwner } from "@/lib/auth";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Handle click outside for dropdown menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showMobileMenu]);

  const handleLogout = () => {
    logout();
    router.push("/");
    setShowMenu(false);
    setShowMobileMenu(false);
  };

  const canAccessAdmin = user && (isAdmin(user) || isManager(user));
  const canAccessCompany =
    user && (isCompanyOwner(user) || isAdmin(user) || isManager(user));

  const navLinkClass = cn(
    "text-sm font-medium text-gray-600 hover:text-blue-600",
    "transition-all duration-200 ease-out",
    "relative after:absolute after:bottom-[-4px] after:left-0",
    "after:w-0 after:h-0.5 after:bg-blue-600",
    "after:transition-all after:duration-300 after:ease-out",
    "hover:after:w-full"
  );

  const mobileNavLinkClass = cn(
    "flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700",
    "hover:bg-blue-50 hover:text-blue-600",
    "transition-colors duration-200",
    "rounded-lg"
  );

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b transition-all duration-300",
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-gray-200/80"
            : "bg-white/80 backdrop-blur border-transparent"
        )}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="Trang chủ ReviewCongTy"
          >
            <div className="relative">
              <Building2
                className={cn(
                  "h-7 w-7 text-blue-600 transition-transform duration-300",
                  "group-hover:scale-110 group-hover:rotate-3"
                )}
              />
              <div className="absolute inset-0 bg-blue-400 rounded-full opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-blue-600">
              ReviewCongTy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className={navLinkClass}>
              Trang chủ
            </Link>
            <Link href="/companies" className={navLinkClass}>
              Danh sách công ty
            </Link>
            {canAccessAdmin && (
              <Link href="/admin" className={navLinkClass}>
                Quản trị
              </Link>
            )}
            {canAccessCompany && (
              <Link href="/company" className={navLinkClass}>
                Quản lý công ty
              </Link>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Search Button - Mobile */}
            <Link href="/companies" className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                aria-label="Tìm kiếm công ty"
              >
                <Search className="h-5 w-5" />
              </Button>
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className={cn(
                    "flex items-center gap-2 rounded-full p-1",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                    "transition-all duration-200",
                    "hover:bg-gray-100"
                  )}
                  aria-expanded={showMenu}
                  aria-haspopup="true"
                  aria-label="Menu người dùng"
                >
                  <Avatar className="h-9 w-9 ring-2 ring-white shadow-sm">
                    {user?.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.name}
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-medium">
                        {user?.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </Avatar>
                  <span className="hidden lg:block text-sm font-medium text-gray-700 pr-1">
                    {user?.name}
                  </span>
                </button>

                {/* Dropdown Menu */}
                <div
                  className={cn(
                    "absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50",
                    "transition-all duration-200 ease-out origin-top-right",
                    showMenu
                      ? "opacity-100 scale-100 translate-y-0"
                      : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                  )}
                  role="menu"
                >
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                      onClick={() => setShowMenu(false)}
                      role="menuitem"
                    >
                      <User className="h-4 w-4" />
                      Hồ sơ cá nhân
                    </Link>
                    {canAccessAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                        onClick={() => setShowMenu(false)}
                        role="menuitem"
                      >
                        <Shield className="h-4 w-4" />
                        Quản trị hệ thống
                      </Link>
                    )}
                    {canAccessCompany && (
                      <Link
                        href="/company"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                        onClick={() => setShowMenu(false)}
                        role="menuitem"
                      >
                        <Settings className="h-4 w-4" />
                        Quản lý công ty
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-gray-100 pt-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                      role="menuitem"
                    >
                      <LogOut className="h-4 w-4" />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/login" className="hidden md:block">
                <Button
                  variant="outline"
                  className={cn(
                    "border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300",
                    "transition-all duration-200 cursor-pointer",
                    "hover:shadow-md hover:shadow-blue-100"
                  )}
                >
                  Đăng nhập
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-expanded={showMobileMenu}
              aria-label={showMobileMenu ? "Đóng menu" : "Mở menu"}
            >
              <div className="relative w-5 h-5">
                <Menu
                  className={cn(
                    "h-5 w-5 absolute inset-0 transition-all duration-300",
                    showMobileMenu
                      ? "opacity-0 rotate-90"
                      : "opacity-100 rotate-0"
                  )}
                />
                <X
                  className={cn(
                    "h-5 w-5 absolute inset-0 transition-all duration-300",
                    showMobileMenu
                      ? "opacity-100 rotate-0"
                      : "opacity-0 -rotate-90"
                  )}
                />
              </div>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 md:hidden",
          "transition-opacity duration-300",
          showMobileMenu ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setShowMobileMenu(false)}
        aria-hidden="true"
      />

      {/* Mobile Menu Panel */}
      <div
        className={cn(
          "fixed top-16 right-0 bottom-0 w-72 z-40 bg-white md:hidden",
          "shadow-xl border-l border-gray-100",
          "transition-transform duration-300 ease-out",
          showMobileMenu ? "translate-x-0" : "translate-x-full"
        )}
      >
        <nav className="p-4 space-y-2">
          <Link
            href="/"
            className={mobileNavLinkClass}
            onClick={() => setShowMobileMenu(false)}
          >
            <Building2 className="h-5 w-5" />
            Trang chủ
          </Link>
          <Link
            href="/companies"
            className={mobileNavLinkClass}
            onClick={() => setShowMobileMenu(false)}
          >
            <Search className="h-5 w-5" />
            Danh sách công ty
          </Link>
          {canAccessAdmin && (
            <Link
              href="/admin"
              className={mobileNavLinkClass}
              onClick={() => setShowMobileMenu(false)}
            >
              <Shield className="h-5 w-5" />
              Quản trị
            </Link>
          )}
          {canAccessCompany && (
            <Link
              href="/company"
              className={mobileNavLinkClass}
              onClick={() => setShowMobileMenu(false)}
            >
              <Settings className="h-5 w-5" />
              Quản lý công ty
            </Link>
          )}

          <div className="border-t border-gray-100 my-4" />

          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                className={mobileNavLinkClass}
                onClick={() => setShowMobileMenu(false)}
              >
                <User className="h-5 w-5" />
                Hồ sơ cá nhân
              </Link>
              <button
                onClick={handleLogout}
                className={cn(
                  mobileNavLinkClass,
                  "w-full text-red-600 hover:bg-red-50"
                )}
              >
                <LogOut className="h-5 w-5" />
                Đăng xuất
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className={cn(
                mobileNavLinkClass,
                "bg-blue-600 text-white hover:bg-blue-700"
              )}
              onClick={() => setShowMobileMenu(false)}
            >
              <User className="h-5 w-5" />
              Đăng nhập
            </Link>
          )}
        </nav>
      </div>
    </>
  );
}
