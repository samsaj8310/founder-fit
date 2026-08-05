import { useEffect, useRef } from 'react';
import { 
  Chart, 
  RadarController, 
  RadialLinearScale, 
  PointElement, 
  LineElement, 
  Filler, 
  Legend, 
  Tooltip 
} from 'chart.js';

Chart.register(
  RadarController, 
  RadialLinearScale, 
  PointElement, 
  LineElement, 
  Filler, 
  Legend, 
  Tooltip
);


export default function RadarChart({ labels, datasets }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'radar',
      data: {
        labels,
        datasets: datasets.map(ds => ({
          ...ds,
          borderWidth: 2,
          pointRadius: 4,
          fill: true
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#1e293b', font: { size: 11, weight: '700' }, boxWidth: 10 }
          },
          tooltip: {
            backgroundColor: '#1e293b',
            titleFont: { size: 14 }
          }
        },
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: { display: false },
            grid: { color: 'rgba(0,0,0,0.06)' },
            angleLines: { color: 'rgba(0,0,0,0.06)' },
            pointLabels: { color: '#1e293b', font: { size: 9, weight: '700' } }
          }
        }
      }
    });

    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, [labels, datasets]);

  return <div style={{ flex: 1, minHeight: 0, position: 'relative' }}><canvas ref={chartRef} /></div>;
}

