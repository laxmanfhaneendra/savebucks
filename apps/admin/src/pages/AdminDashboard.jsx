import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../lib/api';
import { Skeleton } from '../components/Skeleton';
import { StatCard } from '../components/StatCard';

export default function AdminDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => adminApi.getDashboard(),
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="admin-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="admin-card" style={{ height: 120 }} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-card" style={{ color: '#b91c1c' }}>
        Failed to load dashboard data.
      </div>
    );
  }

  const stats = data?.stats || {};

  return (
    <div className="admin-grid">
      <StatCard title="Total Deals" value={stats.deals?.total || 0} />
      <StatCard title="Pending Deals" value={stats.deals?.pending || 0} />
      <StatCard title="Total Coupons" value={stats.coupons?.total || 0} />
      <StatCard title="Pending Coupons" value={stats.coupons?.pending || 0} />
      <StatCard title="Total Users" value={stats.users?.total || 0} />
      <StatCard title="Total Companies" value={stats.companies?.total || 0} />
    </div>
  );
}
