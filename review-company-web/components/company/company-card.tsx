import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RatingDisplay } from '@/components/review/rating-display';
import { MapPin, MessageSquare } from 'lucide-react';
import { Company } from '@/lib/types';

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link href={`/companies/${company.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
              {company.logo_url ? (
                <Image
                  src={company.logo_url}
                  alt={company.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-2xl font-bold text-gray-400">
                  {company.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {company.name}
              </h3>
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{company.address}</span>
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-600 line-clamp-2">
            {company.description || 'Chưa có mô tả'}
          </p>

          <div className="mt-4 flex items-center justify-between">
            {company.avg_rating ? (
              <RatingDisplay rating={company.avg_rating} size="sm" />
            ) : (
              <span className="text-sm text-gray-400">Chưa có đánh giá</span>
            )}
            <Badge variant="secondary" className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {company.total_reviews} reviews
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
