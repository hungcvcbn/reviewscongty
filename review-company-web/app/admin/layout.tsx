'use client';

import { useAuth } from '@/contexts/auth-context';
import { isAdmin, isManager } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || (!isAdmin(user) && !isManager(user)))) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  if (!user || (!isAdmin(user) && !isManager(user))) {
    return null;
  }

  return <>{children}</>;
}
