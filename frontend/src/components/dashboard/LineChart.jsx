import React, { useEffect, useRef } from 'react';
import { 
  Chart, 
  LineController, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Tooltip, 
  Legend 
} from 'chart.js';

Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function LineChart({ labels, datasets }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) chartInstance.current.destroy();
    
    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: datasets.map(ds => ({
          ...ds,
          borderWidth: 3,
          pointRadius: 5,
          pointBackgroundColor: ds.borderColor,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointHoverRadius: 8,
          tension: 0.4
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 12, padding: 15, color: '#1e293b', font: { size: 10, weight: '700' } }
          },
          tooltip: {
            backgroundColor: '#1e293b',
            titleFont: { size: 13 }
          }
        },
        scales: {
          y: {
            min: 0,
            max: 100,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { color: '#64748b', font: { size: 9, weight: '600' } }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#1e293b', font: { size: 9, weight: '700' }, maxRotation: 0, autoSkip: false }
          }
        }
      }
    });

    return () => { if (chartInstance.current) chartInstance.current.destroy(); };

  }, [labels, datasets]);

  return <div style={{ flex: 1, minHeight: 0, position: 'relative' }}><canvas ref={chartRef} /></div>;
}

