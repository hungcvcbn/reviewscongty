import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AuthProvider } from "@/contexts/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://reviewcongty.com'),
  title: {
    default: "ReviewCongTy - Đánh giá công ty Việt Nam",
    template: "%s | ReviewCongTy"
  },
  description: "Nền tảng đánh giá công ty hàng đầu Việt Nam. Tìm hiểu môi trường làm việc, văn hóa công ty và cơ hội phát triển. Đánh giá thực, việc làm thật.",
  keywords: [
    "đánh giá công ty",
    "review công ty",
    "môi trường làm việc",
    "văn hóa công ty",
    "việc làm Việt Nam",
    "đánh giá nhân viên",
    "review công ty Việt Nam",
    "tìm việc làm",
    "công ty tốt",
    "môi trường làm việc tốt"
  ],
  authors: [{ name: "ReviewCongTy" }],
  creator: "ReviewCongTy",
  publisher: "ReviewCongTy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { rel: 'android-chrome-192x192', url: '/icons/android-chrome-192x192.png' },
      { rel: 'android-chrome-512x512', url: '/icons/android-chrome-512x512.png' }
    ]
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: '/',
    siteName: 'ReviewCongTy',
    title: 'ReviewCongTy - Đánh giá công ty Việt Nam',
    description: 'Nền tảng đánh giá công ty hàng đầu Việt Nam. Tìm hiểu môi trường làm việc, văn hóa công ty và cơ hội phát triển.',
    images: [
      {
        url: '/banner.jpg',
        width: 1200,
        height: 630,
        alt: 'ReviewCongTy - Đánh giá công ty Việt Nam',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ReviewCongTy - Đánh giá công ty Việt Nam',
    description: 'Nền tảng đánh giá công ty hàng đầu Việt Nam. Đánh giá thực, việc làm thật.',
    images: ['/banner.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  category: 'Business',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
