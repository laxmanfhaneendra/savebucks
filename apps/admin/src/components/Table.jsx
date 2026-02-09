import React from 'react';

export function Table({ columns, rows, emptyLabel = 'No records found.' }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="admin-card" style={{ textAlign: 'center', color: '#64748b' }}>
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="admin-card" style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  textAlign: 'left',
                  paddingBottom: 12,
                  borderBottom: '1px solid #e2e8f0',
                  color: '#64748b',
                  fontWeight: 600,
                  fontSize: 12,
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                }}
              >
                {col.label}
              </th>
            ))}
            <th style={{ textAlign: 'right' }} />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              {columns.map((col) => (
                <td key={col.key} style={{ padding: '12px 0', color: '#0f172a' }}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              <td style={{ textAlign: 'right' }}>{row.actions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
