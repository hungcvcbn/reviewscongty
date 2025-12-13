'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RatingDisplay } from '@/components/review/rating-display';
import { MapPin, MessageSquare, ArrowRight } from 'lucide-react';
import { Company } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CompanyCardProps {
  company: Company;
  index?: number;
}

export function CompanyCard({ company, index = 0 }: CompanyCardProps) {
  return (
    <Link 
      href={`/companies/${company.id}`}
      className="block group"
      aria-label={`Xem chi tiết công ty ${company.name}`}
    >
      <Card 
        className={cn(
          'h-full cursor-pointer overflow-hidden',
          'transition-all duration-300 ease-out',
          'hover:shadow-xl hover:shadow-blue-100/50',
          'hover:-translate-y-1 hover:border-blue-200',
          'group-focus-visible:ring-2 group-focus-visible:ring-blue-500 group-focus-visible:ring-offset-2'
        )}
        style={{
          animationDelay: `${index * 100}ms`,
        }}
      >
        <CardContent className="p-6 relative">
          {/* Subtle gradient overlay on hover */}
          <div 
            className={cn(
              'absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-100/0',
              'group-hover:from-blue-50/50 group-hover:to-blue-100/30',
              'transition-all duration-300 ease-out',
              'pointer-events-none'
            )}
          />
          
          <div className="relative z-10">
            <div className="flex items-start gap-4">
              {/* Company Logo with animation */}
              <div 
                className={cn(
                  'relative h-16 w-16 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100',
                  'ring-2 ring-white shadow-sm',
                  'transition-all duration-300 ease-out',
                  'group-hover:scale-105 group-hover:shadow-md group-hover:ring-blue-100'
                )}
              >
                {company.logo_url ? (
                  <Image
                    src={company.logo_url}
                    alt={company.name}
                    fill
                    className={cn(
                      'object-cover transition-transform duration-500',
                      'group-hover:scale-110'
                    )}
                    unoptimized
                  />
                ) : (
                  <div 
                    className={cn(
                      'h-full w-full flex items-center justify-center',
                      'text-2xl font-bold',
                      'bg-gradient-to-br from-blue-500 to-blue-600 text-white',
                      'transition-all duration-300'
                    )}
                  >
                    {company.name.charAt(0)}
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 
                  className={cn(
                    'font-semibold text-gray-900 truncate',
                    'transition-colors duration-200',
                    'group-hover:text-blue-600'
                  )}
                >
                  {company.name}
                </h3>
                <div 
                  className={cn(
                    'flex items-center gap-1.5 text-sm text-gray-500 mt-1.5',
                    'transition-colors duration-200'
                  )}
                >
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{company.address}</span>
                </div>
              </div>

              {/* Arrow indicator on hover */}
              <ArrowRight 
                className={cn(
                  'h-5 w-5 text-blue-600 flex-shrink-0',
                  'opacity-0 -translate-x-2',
                  'transition-all duration-300',
                  'group-hover:opacity-100 group-hover:translate-x-0'
                )}
              />
            </div>

            <p 
              className={cn(
                'mt-4 text-sm text-gray-600 line-clamp-2',
                'transition-colors duration-200'
              )}
            >
              {company.description || 'Chưa có mô tả về công ty này.'}
            </p>

            <div className="mt-4 flex items-center justify-between">
              {company.avg_rating ? (
                <RatingDisplay rating={company.avg_rating} size="sm" animated />
              ) : (
                <span className="text-sm text-gray-400 italic">Chưa có đánh giá</span>
              )}
              <Badge 
                variant="secondary" 
                className={cn(
                  'flex items-center gap-1.5',
                  'transition-all duration-200',
                  'group-hover:bg-blue-100 group-hover:text-blue-700'
                )}
              >
                <MessageSquare className="h-3 w-3" />
                {company.total_reviews} reviews
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
