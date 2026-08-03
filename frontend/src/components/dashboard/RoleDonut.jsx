import React, { useEffect, useRef } from 'react';
import { Chart, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

export default function RoleDonut({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) chartInstance.current.destroy();
    
    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.map(d => d.label),
        datasets: [{
          data: data.map(d => d.value),
          backgroundColor: [
            '#00A9D6', '#2E2A8C', '#33C3E6', '#F59E0B', '#10B981', '#64748B'
          ],
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 8,
              padding: 10,
              color: '#1e293b',
              font: { size: 10, weight: '700' }
            }
          },
          tooltip: {
            backgroundColor: '#1e293b',
            titleFont: { size: 13 }
          }
        },
        cutout: '75%'
      }
    });

    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, [data]);

  return <div style={{ flex: 1, minHeight: 0, position: 'relative' }}><canvas ref={chartRef} /></div>;
}

