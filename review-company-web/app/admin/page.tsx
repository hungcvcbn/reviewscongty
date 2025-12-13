'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, CheckCircle, XCircle, Clock, Plus } from 'lucide-react';
import companiesData from '@/lib/data/companies.json';
import { Company, CompanyStatus } from '@/lib/types';

const companies = companiesData as Company[];

export default function AdminDashboard() {
  const [pendingCompanies, setPendingCompanies] = useState<Company[]>([]);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    active: 0,
    rejected: 0,
  });

  useEffect(() => {
    const pending = companies.filter((c) => c.status === 'PENDING');
    const approved = companies.filter((c) => c.status === 'APPROVED');
    const active = companies.filter((c) => c.status === 'ACTIVE');
    const rejected = companies.filter((c) => c.status === 'REJECTED');

    setPendingCompanies(pending);
    setStats({
      pending: pending.length,
      approved: approved.length,
      active: active.length,
      rejected: rejected.length,
    });
  }, []);

  const getStatusBadge = (status: CompanyStatus) => {
    const variants: Record<CompanyStatus, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      PENDING: { variant: 'secondary', label: 'Chờ duyệt' },
      APPROVED: { variant: 'default', label: 'Đã duyệt' },
      ACTIVE: { variant: 'default', label: 'Đang hoạt động' },
      INACTIVE: { variant: 'outline', label: 'Tạm dừng' },
      DELETED: { variant: 'destructive', label: 'Đã xóa' },
      REJECTED: { variant: 'destructive', label: 'Từ chối' },
    };
    const config = variants[status] || variants.PENDING;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản trị hệ thống</h1>
          <p className="text-gray-600 mt-2">Quản lý công ty và duyệt nội dung</p>
        </div>
        <Link href="/admin/companies/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tạo công ty mới
          </Button>
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Chờ duyệt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-xs text-gray-500">Công ty</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Đã duyệt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.approved}</p>
                <p className="text-xs text-gray-500">Công ty</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Đang hoạt động
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-xs text-gray-500">Công ty</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Từ chối
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <XCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{stats.rejected}</p>
                <p className="text-xs text-gray-500">Công ty</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Companies */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Công ty chờ duyệt</CardTitle>
            <Link href="/admin/companies/pending">
              <Button variant="outline" size="sm">
                Xem tất cả
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {pendingCompanies.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Không có công ty nào chờ duyệt
            </div>
          ) : (
            <div className="space-y-4">
              {pendingCompanies.slice(0, 5).map((company) => (
                <div
                  key={company.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                      {company.logo_url ? (
                        <img
                          src={company.logo_url}
                          alt={company.name}
                          className="h-full w-full object-cover rounded-lg"
                        />
                      ) : (
                        <Building2 className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{company.name}</h3>
                      <p className="text-sm text-gray-500">{company.address}</p>
                      <div className="mt-1">{getStatusBadge(company.status)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/companies/${company.id}`}>
                      <Button variant="outline" size="sm">
                        Xem chi tiết
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
