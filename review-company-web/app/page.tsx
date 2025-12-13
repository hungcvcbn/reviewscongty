import Link from "next/link";
import {
  Building2,
  Star,
  MessageSquare,
  TrendingUp,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CompanyCard } from "@/components/company/company-card";
import { CompanySearch } from "@/components/company/company-search";
import { getTopRatedCompanies, getStatistics } from "@/lib/data";
import {
  FadeIn,
  AnimatedCounter,
  StaggeredList,
  ScrollToTop,
} from "@/components/animations";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const topCompanies = getTopRatedCompanies(6);
  const stats = getStatistics();

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-24 px-4 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl animate-pulse-soft" />
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl animate-pulse-soft"
            style={{ animationDelay: "1s" }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-100/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <FadeIn direction="down" delay={0}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/80 backdrop-blur-sm rounded-full text-blue-700 text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Nền tảng đánh giá công ty số 1 Việt Nam</span>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={100}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Tìm hiểu công ty{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                trước khi quyết định
              </span>
            </h1>
          </FadeIn>

          <FadeIn direction="up" delay={200}>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Đọc review từ nhân viên thực tế về môi trường làm việc, văn hóa
              công ty và cơ hội phát triển.
            </p>
          </FadeIn>

          <FadeIn direction="up" delay={300}>
            <div className="max-w-2xl mx-auto">
              <CompanySearch
                size="lg"
                placeholder="Nhập tên công ty bạn muốn tìm..."
              />
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={400}>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Miễn phí 100%</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Review thực tế từ nhân viên</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Cập nhật liên tục</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-4 bg-white border-b">
        <div className="container mx-auto">
          <FadeIn>
            <StaggeredList
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
              staggerDelay={150}
            >
              {/* Companies Stat */}
              <Card
                className={cn(
                  "group overflow-hidden",
                  "transition-all duration-300 ease-out",
                  "hover:shadow-xl hover:shadow-blue-100/50",
                  "hover:-translate-y-1 hover:border-blue-200"
                )}
              >
                <CardContent className="flex items-center gap-4 p-6">
                  <div
                    className={cn(
                      "p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl",
                      "shadow-lg shadow-blue-200",
                      "transition-transform duration-300",
                      "group-hover:scale-110 group-hover:rotate-3"
                    )}
                  >
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">
                      <AnimatedCounter
                        end={stats.totalCompanies}
                        duration={2000}
                        suffix="+"
                      />
                    </p>
                    <p className="text-sm text-gray-500 font-medium">Công ty</p>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews Stat */}
              <Card
                className={cn(
                  "group overflow-hidden",
                  "transition-all duration-300 ease-out",
                  "hover:shadow-xl hover:shadow-green-100/50",
                  "hover:-translate-y-1 hover:border-green-200"
                )}
              >
                <CardContent className="flex items-center gap-4 p-6">
                  <div
                    className={cn(
                      "p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl",
                      "shadow-lg shadow-green-200",
                      "transition-transform duration-300",
                      "group-hover:scale-110 group-hover:rotate-3"
                    )}
                  >
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">
                      <AnimatedCounter
                        end={stats.totalReviews}
                        duration={2000}
                        suffix="+"
                      />
                    </p>
                    <p className="text-sm text-gray-500 font-medium">Reviews</p>
                  </div>
                </CardContent>
              </Card>

              {/* Rating Stat */}
              <Card
                className={cn(
                  "group overflow-hidden",
                  "transition-all duration-300 ease-out",
                  "hover:shadow-xl hover:shadow-yellow-100/50",
                  "hover:-translate-y-1 hover:border-yellow-200"
                )}
              >
                <CardContent className="flex items-center gap-4 p-6">
                  <div
                    className={cn(
                      "p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl",
                      "shadow-lg shadow-yellow-200",
                      "transition-transform duration-300",
                      "group-hover:scale-110 group-hover:rotate-3"
                    )}
                  >
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">
                      <AnimatedCounter
                        end={stats.averageRating}
                        duration={2000}
                        decimals={1}
                        suffix="/5"
                      />
                    </p>
                    <p className="text-sm text-gray-500 font-medium">
                      Rating trung bình
                    </p>
                  </div>
                </CardContent>
              </Card>
            </StaggeredList>
          </FadeIn>
        </div>
      </section>

      {/* Top Companies Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto">
          <FadeIn>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Công ty được đánh giá cao
                </h2>
                <p className="text-gray-500">
                  Top công ty có rating cao nhất trên nền tảng
                </p>
              </div>
              <Link href="/companies">
                <Button
                  variant="outline"
                  className={cn(
                    "group",
                    "border-blue-200 text-blue-600",
                    "hover:bg-blue-50 hover:border-blue-300",
                    "transition-all duration-200"
                  )}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Xem tất cả
                  <ArrowRight className="h-4 w-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </FadeIn>

          <StaggeredList
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            staggerDelay={100}
          >
            {topCompanies.map((company, index) => (
              <CompanyCard key={company.id} company={company} index={index} />
            ))}
          </StaggeredList>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Tại sao chọn ReviewCongTy?
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Chúng tôi cung cấp thông tin minh bạch và đáng tin cậy để giúp
                bạn đưa ra quyết định nghề nghiệp tốt nhất.
              </p>
            </div>
          </FadeIn>

          <StaggeredList
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            staggerDelay={150}
          >
            <div
              className={cn(
                "text-center p-8 rounded-2xl",
                "bg-gradient-to-br from-blue-50 to-blue-100/50",
                "border border-blue-100",
                "transition-all duration-300",
                "hover:shadow-xl hover:shadow-blue-100/50 hover:-translate-y-1"
              )}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-600 text-white mb-6 shadow-lg shadow-blue-200">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Review thực tế
              </h3>
              <p className="text-gray-600">
                Tất cả review đều từ nhân viên thực tế đã làm việc tại công ty.
              </p>
            </div>

            <div
              className={cn(
                "text-center p-8 rounded-2xl",
                "bg-gradient-to-br from-green-50 to-emerald-100/50",
                "border border-green-100",
                "transition-all duration-300",
                "hover:shadow-xl hover:shadow-green-100/50 hover:-translate-y-1"
              )}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-green-600 text-white mb-6 shadow-lg shadow-green-200">
                <Star className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Đánh giá chi tiết
              </h3>
              <p className="text-gray-600">
                Đánh giá theo nhiều tiêu chí: lương, văn hóa, môi trường làm
                việc.
              </p>
            </div>

            <div
              className={cn(
                "text-center p-8 rounded-2xl",
                "bg-gradient-to-br from-purple-50 to-indigo-100/50",
                "border border-purple-100",
                "transition-all duration-300",
                "hover:shadow-xl hover:shadow-purple-100/50 hover:-translate-y-1"
              )}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-purple-600 text-white mb-6 shadow-lg shadow-purple-200">
                <Building2 className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Thông tin công ty
              </h3>
              <p className="text-gray-600">
                Thông tin đầy đủ về quy mô, ngành nghề và địa chỉ công ty.
              </p>
            </div>
          </StaggeredList>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relativeoverflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gray-50 py-20 px-4 " />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />

        <div className="container mx-auto text-center relative z-10">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Bạn đã từng làm việc tại một công ty?
              </h2>
              <p className="text-blue-700 text-lg mb-10 leading-relaxed">
                Chia sẻ trải nghiệm của bạn để giúp những người khác đưa ra
                quyết định tốt hơn. Review của bạn có thể thay đổi cuộc sống của
                ai đó!
              </p>
              <Link href="/companies">
                <Button
                  size="lg"
                  variant="secondary"
                  className={cn(
                    "text-lg px-8 py-6 h-auto cursor-pointer",
                    "bg-white text-blue-600 hover:bg-blue-50",
                    "shadow-xl shadow-blue-900/20",
                    "transition-all duration-300 mb-10",
                    "hover:scale-105 hover:shadow-2xl hover:shadow-blue-900/30"
                  )}
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Viết review ngay
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}
