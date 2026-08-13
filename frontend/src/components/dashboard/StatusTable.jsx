import React from 'react';

export default function StatusTable({ data = [], columns = [] }) {
  // Fallback for legacy 2-founder data shape
  const renderColumns = columns.length > 0 ? columns : [
    { name: 'Founder A' },
    { name: 'Founder B' }
  ];

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <table className="status-table">
        <thead>
          <tr>
            <th style={{ minWidth: '130px' }}>Metric</th>
            {renderColumns.map((col, idx) => (
              <th key={idx} style={{ textTransform: 'none', whiteSpace: 'nowrap', fontSize: '11px', padding: '6px 8px' }}>
                {typeof col === 'string' ? col : col.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx}>
              <td style={{ fontWeight: 600, color: '#334155', whiteSpace: 'nowrap' }}>{item.label}</td>
              {item.statuses ? (
                item.statuses.map((st, sIdx) => {
                  const statusVal = typeof st === 'object' ? st.status : st;
                  const badgeClass = (statusVal || '').toLowerCase();
                  return (
                    <td key={sIdx} style={{ padding: '6px 8px' }}>
                      <span className={`status-badge badge-${badgeClass}`}>
                        {statusVal}
                      </span>
                    </td>
                  );
                })
              ) : (
                <>
                  <td style={{ padding: '6px 8px' }}>
                    <span className={`status-badge badge-${item.statusA?.toLowerCase()}`}>
                      {item.statusA}
                    </span>
                  </td>
                  <td style={{ padding: '6px 8px' }}>
                    <span className={`status-badge badge-${item.statusB?.toLowerCase()}`}>
                      {item.statusB}
                    </span>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
