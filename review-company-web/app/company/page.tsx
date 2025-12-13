'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, MessageSquare, Settings, ArrowRight } from 'lucide-react';
import companiesData from '@/lib/data/companies.json';
import companyOwnersData from '@/lib/data/company_owners.json';
import { Company } from '@/lib/types';

interface CompanyOwner {
  id: string;
  company_id: string;
  user_id: string;
  created_at: string;
}
import { isCompanyOwner, isAdmin, isManager } from '@/lib/auth';

const companies = companiesData as Company[];
const companyOwners = companyOwnersData as CompanyOwner[];

export default function CompanyManagementPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [myCompanies, setMyCompanies] = useState<Company[]>([]);

  useEffect(() => {
    if (!authLoading && (!user || (!isCompanyOwner(user) && !isAdmin(user) && !isManager(user)))) {
      router.push('/');
      return;
    }

    if (user) {
      // Find companies owned by this user
      const ownedCompanyIds = companyOwners
        .filter((co) => co.user_id === user.id)
        .map((co) => co.company_id);
      
      const ownedCompanies = companies.filter((c) =>
        ownedCompanyIds.includes(c.id)
      ) as Company[];
      setMyCompanies(ownedCompanies);
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  if (!user || (!isCompanyOwner(user) && !isAdmin(user) && !isManager(user))) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý công ty</h1>
        <p className="text-gray-600 mt-2">Quản lý thông tin công ty và phản hồi review</p>
      </div>

      {myCompanies.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Bạn chưa có công ty nào được gán</p>
            {(isAdmin(user) || isManager(user)) && (
              <Link href="/admin/companies/new">
                <Button>Tạo công ty mới</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {myCompanies.map((company) => (
            <Card key={company.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      {company.logo_url ? (
                        <img
                          src={company.logo_url}
                          alt={company.name}
                          className="h-full w-full object-cover rounded-lg"
                        />
                      ) : (
                        <Building2 className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {company.name}
                        </h3>
                        <Badge
                          variant={
                            company.status === 'ACTIVE'
                              ? 'default'
                              : company.status === 'PENDING'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {company.status === 'ACTIVE'
                            ? 'Đang hoạt động'
                            : company.status === 'PENDING'
                            ? 'Chờ duyệt'
                            : company.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{company.address}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>
                          {company.avg_rating
                            ? `${company.avg_rating.toFixed(1)}/5`
                            : 'Chưa có rating'}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {company.total_reviews} reviews
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Link href={`/companies/${company.id}`}>
                      <Button variant="outline" size="sm">
                        Xem công ty
                      </Button>
                    </Link>
                    <Link href={`/company/${company.id}`}>
                      <Button size="sm">
                        Quản lý
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
