import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../lib/api';
import { Table } from '../components/Table';
import { Skeleton } from '../components/Skeleton';

export default function UserManagement() {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users', search, role],
    queryFn: () => adminApi.listUsers({ search, role }),
  });

  if (isLoading) {
    return <Skeleton className="admin-card" style={{ height: 220 }} />;
  }

  const columns = [
    { key: 'handle', label: 'Handle' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
  ];

  const rows = (data || []).map((row) => ({
    ...row,
    actions: (
      <select
        className="admin-input"
        value={row.role || 'user'}
        onChange={(e) => adminApi.updateUserRole(row.id, e.target.value)}
      >
        <option value="user">User</option>
        <option value="mod">Moderator</option>
        <option value="admin">Admin</option>
      </select>
    ),
  }));

  return (
    <div className="admin-section">
      <div className="admin-grid">
        <input
          className="admin-input"
          placeholder="Search handle"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="admin-input" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">All roles</option>
          <option value="admin">Admin</option>
          <option value="mod">Moderator</option>
          <option value="user">User</option>
        </select>
      </div>
      <Table columns={columns} rows={rows} emptyLabel="No users found." />
    </div>
  );
}
