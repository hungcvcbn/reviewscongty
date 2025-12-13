import Link from 'next/link';
import { Building2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Building2 className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">ReviewCongTy</span>
            </Link>
            <p className="text-gray-600 text-sm max-w-md">
              Nền tảng đánh giá công ty hàng đầu Việt Nam. Giúp bạn tìm hiểu môi trường làm việc, 
              văn hóa công ty và cơ hội phát triển trước khi quyết định.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Liên kết</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/companies" className="text-sm text-gray-600 hover:text-gray-900">
                  Danh sách công ty
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-gray-600">Liên hệ: contact@reviewcongty.vn</span>
              </li>
              <li>
                <span className="text-sm text-gray-600">Hotline: 1900 xxxx</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} ReviewCongTy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
