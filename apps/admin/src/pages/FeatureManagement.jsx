import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../lib/api';
import { Table } from '../components/Table';
import { Skeleton } from '../components/Skeleton';

export default function FeatureManagement() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'deals', 'approved', search],
    queryFn: () => adminApi.listDeals({ status: 'approved', search }),
  });

  if (isLoading) {
    return <Skeleton className="admin-card" style={{ height: 220 }} />;
  }

  const rows = (data || []).map((row) => ({
    ...row,
    actions: (
      <button
        className={`admin-button ${row.is_featured ? 'ghost' : 'primary'}`}
        onClick={() => adminApi.featureDeal(row.id, !row.is_featured)}
      >
        {row.is_featured ? 'Unfeature' : 'Feature'}
      </button>
    ),
  }));

  return (
    <div className="admin-section">
      <input
        className="admin-input"
        placeholder="Search approved deals"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Table
        columns={[
          { key: 'title', label: 'Title' },
          { key: 'merchant', label: 'Merchant' },
        ]}
        rows={rows}
        emptyLabel="No deals found."
      />
    </div>
  );
}
