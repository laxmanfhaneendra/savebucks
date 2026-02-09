import React from 'react';

export function StatCard({ title, value, caption }) {
  return (
    <div className="admin-card">
      <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: '#64748b' }}>
        {title}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>{value}</div>
      {caption ? <div style={{ marginTop: 8, color: '#94a3b8', fontSize: 12 }}>{caption}</div> : null}
    </div>
  );
}
