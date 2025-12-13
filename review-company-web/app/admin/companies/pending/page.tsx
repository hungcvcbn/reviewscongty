'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import companiesData from '@/lib/data/companies.json';
import { Company, CompanyStatus } from '@/lib/types';

const companies = companiesData as Company[];

export default function PendingCompaniesPage() {
  const [pendingCompanies, setPendingCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const pending = companies.filter((c) => c.status === 'PENDING');
    setPendingCompanies(pending);
  }, []);

  const handleApprove = async (companyId: string) => {
    if (confirm('Bạn có chắc muốn duyệt công ty này?')) {
      // In production, this would call an API
      alert('Đã duyệt công ty thành công (Demo mode)');
      // Update local state
      setPendingCompanies((prev) => prev.filter((c) => c.id !== companyId));
    }
  };

  const handleReject = async (companyId: string) => {
    const reason = prompt('Nhập lý do từ chối:');
    if (reason) {
      // In production, this would call an API
      alert(`Đã từ chối công ty. Lý do: ${reason} (Demo mode)`);
      // Update local state
      setPendingCompanies((prev) => prev.filter((c) => c.id !== companyId));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Công ty chờ duyệt</h1>
          <p className="text-gray-600 mt-2">
            {pendingCompanies.length} công ty đang chờ duyệt
          </p>
        </div>
      </div>

      {pendingCompanies.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Không có công ty nào chờ duyệt</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingCompanies.map((company) => (
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
                        <Badge variant="secondary">Chờ duyệt</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{company.address}</p>
                      {company.description && (
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {company.description}
                        </p>
                      )}
                      <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                        {company.email && (
                          <span>Email: {company.email}</span>
                        )}
                        {company.phone && (
                          <span>Điện thoại: {company.phone}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Link href={`/companies/${company.id}`}>
                      <Button variant="outline" size="sm">
                        Xem chi tiết
                      </Button>
                    </Link>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleApprove(company.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Duyệt
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleReject(company.id)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Từ chối
                    </Button>
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
