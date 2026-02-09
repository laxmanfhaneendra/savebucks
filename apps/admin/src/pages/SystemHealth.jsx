import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../lib/api';
import { Skeleton } from '../components/Skeleton';

export default function SystemHealth() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'health'],
    queryFn: () => adminApi.getSystemHealth(),
  });

  if (isLoading) {
    return <Skeleton className="admin-card" style={{ height: 160 }} />;
  }

  return (
    <div className="admin-card">
      <h3 style={{ marginTop: 0 }}>System Health</h3>
      <pre style={{ background: '#0f172a', color: '#f8fafc', padding: 12, borderRadius: 12 }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
