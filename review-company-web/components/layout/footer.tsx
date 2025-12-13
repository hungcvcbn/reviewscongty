import Link from 'next/link';
import { Building2, Mail, Phone, Facebook, Twitter, Linkedin, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Footer() {
  const footerLinkClass = cn(
    'text-sm text-gray-600',
    'hover:text-blue-600',
    'transition-colors duration-200',
    'inline-flex items-center gap-1'
  );

  const socialIconClass = cn(
    'p-2 rounded-full',
    'bg-gray-100 text-gray-600',
    'hover:bg-blue-100 hover:text-blue-600',
    'transition-all duration-200',
    'hover:scale-110'
  );

  return (
    <footer className="border-t bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 mb-4 group"
              aria-label="Trang chủ ReviewCongTy"
            >
              <Building2 
                className={cn(
                  'h-7 w-7 text-blue-600',
                  'transition-transform duration-300',
                  'group-hover:scale-110 group-hover:rotate-3'
                )} 
              />
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                ReviewCongTy
              </span>
            </Link>
            <p className="text-gray-600 text-sm max-w-md leading-relaxed mb-6">
              Nền tảng đánh giá công ty hàng đầu Việt Nam. Giúp bạn tìm hiểu môi trường làm việc, 
              văn hóa công ty và cơ hội phát triển trước khi quyết định.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a 
                href="#" 
                className={socialIconClass}
                aria-label="Facebook"
                tabIndex={0}
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a 
                href="#" 
                className={socialIconClass}
                aria-label="Twitter"
                tabIndex={0}
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a 
                href="#" 
                className={socialIconClass}
                aria-label="LinkedIn"
                tabIndex={0}
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-5">Liên kết nhanh</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className={footerLinkClass}>
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/companies" className={footerLinkClass}>
                  Danh sách công ty
                </Link>
              </li>
              <li>
                <Link href="/companies" className={footerLinkClass}>
                  Viết review
                </Link>
              </li>
              <li>
                <Link href="/login" className={footerLinkClass}>
                  Đăng nhập
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-5">Liên hệ</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="mailto:contact@reviewcongty.vn" 
                  className={footerLinkClass}
                >
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  contact@reviewcongty.vn
                </a>
              </li>
              <li>
                <a 
                  href="tel:1900xxxx" 
                  className={footerLinkClass}
                >
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  1900 xxxx
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 flex items-center gap-1">
              © {new Date().getFullYear()} ReviewCongTy. Made with{' '}
              <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500 animate-pulse-soft" />{' '}
              in Vietnam
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="#" className="hover:text-gray-700 transition-colors duration-200">
                Điều khoản sử dụng
              </Link>
              <Link href="#" className="hover:text-gray-700 transition-colors duration-200">
                Chính sách bảo mật
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
