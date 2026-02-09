import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../lib/api';
import { Table } from '../components/Table';
import { Skeleton } from '../components/Skeleton';

export default function PendingApprovals() {
  const [activeTab, setActiveTab] = useState('deals');
  const [rejectionReason, setRejectionReason] = useState('');

  const dealsQuery = useQuery({
    queryKey: ['admin', 'deals', 'pending'],
    queryFn: () => adminApi.getPendingDeals(),
    enabled: activeTab === 'deals',
  });

  const couponsQuery = useQuery({
    queryKey: ['admin', 'coupons', 'pending'],
    queryFn: () => adminApi.getPendingCoupons(),
    enabled: activeTab === 'coupons',
  });

  const handleApprove = async (item) => {
    if (activeTab === 'deals') {
      await adminApi.reviewDeal({ dealId: item.id, action: 'approve' });
      dealsQuery.refetch();
    } else {
      await adminApi.reviewCoupon({ couponId: item.id, action: 'approve' });
      couponsQuery.refetch();
    }
  };

  const handleReject = async (item) => {
    if (!rejectionReason.trim()) {
      alert('Provide a rejection reason.');
      return;
    }
    if (activeTab === 'deals') {
      await adminApi.reviewDeal({ dealId: item.id, action: 'reject', reason: rejectionReason });
      dealsQuery.refetch();
    } else {
      await adminApi.reviewCoupon({ couponId: item.id, action: 'reject', reason: rejectionReason });
      couponsQuery.refetch();
    }
    setRejectionReason('');
  };

  const rows = (activeTab === 'deals' ? dealsQuery.data : couponsQuery.data) || [];

  if ((activeTab === 'deals' && dealsQuery.isLoading) || (activeTab === 'coupons' && couponsQuery.isLoading)) {
    return <Skeleton className="admin-card" style={{ height: 260 }} />;
  }

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'merchant', label: 'Merchant' },
    { key: 'created_at', label: 'Created', render: (row) => new Date(row.created_at).toLocaleString() },
  ];

  const tableRows = rows.map((row) => ({
    ...row,
    actions: (
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button className="admin-button primary" onClick={() => handleApprove(row)}>Approve</button>
        <button className="admin-button" style={{ background: '#fee2e2', color: '#991b1b' }} onClick={() => handleReject(row)}>Reject</button>
      </div>
    ),
  }));

  return (
    <div className="admin-section">
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          className={`admin-button ${activeTab === 'deals' ? 'primary' : 'ghost'}`}
          onClick={() => setActiveTab('deals')}
        >
          Pending Deals
        </button>
        <button
          className={`admin-button ${activeTab === 'coupons' ? 'primary' : 'ghost'}`}
          onClick={() => setActiveTab('coupons')}
        >
          Pending Coupons
        </button>
      </div>
      <input
        className="admin-input"
        placeholder="Rejection reason (required to reject)"
        value={rejectionReason}
        onChange={(e) => setRejectionReason(e.target.value)}
      />
      <Table columns={columns} rows={tableRows} emptyLabel="No pending approvals." />
    </div>
  );
}
