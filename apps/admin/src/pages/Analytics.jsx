import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../lib/api';
import { Skeleton } from '../components/Skeleton';

export default function Analytics() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: () => adminApi.getAnalytics(),
  });

  if (isLoading) {
    return <Skeleton className="admin-card" style={{ height: 200 }} />;
  }

  if (error) {
    return (
      <div className="admin-card" style={{ color: '#b91c1c' }}>
        Failed to load analytics.
      </div>
    );
  }

  const topContributors = data?.topContributors || [];

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h3 style={{ marginTop: 0 }}>Top Contributors</h3>
        {topContributors.length === 0 ? (
          <div style={{ color: '#64748b' }}>No contributor data yet.</div>
        ) : (
          <ol style={{ paddingLeft: 20, margin: 0 }}>
            {topContributors.map((c) => (
              <li key={c.id} style={{ marginBottom: 8 }}>
                {c.handle || c.email || c.id} — {c.karma || 0} karma
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
