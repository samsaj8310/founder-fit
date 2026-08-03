import React from 'react';

export default function StatusTable({ data, type = 'capability' }) {
  return (
    <table className="status-table">
      <thead>
        <tr>
          <th>Metric</th>
          <th>Founder A</th>
          <th>Founder B</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, idx) => (
          <tr key={idx}>
            <td>{item.label}</td>
            <td>
              <span className={`status-badge badge-${item.statusA.toLowerCase()}`}>
                {item.statusA}
              </span>
            </td>
            <td>
              <span className={`status-badge badge-${item.statusB.toLowerCase()}`}>
                {item.statusB}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
