import React from 'react';

/**
 * A sleek, minimal SVG-based line chart for dashboard engagement metrics.
 * No heavy libraries needed for perfection.
 */
export default function EngagementChart({ data = [], color = '#0D9488' }) {
  if (!data.length) return null;

  const max = Math.max(...data) * 1.2;
  const width = 1000;
  const height = 200;
  const padding = 20;

  // Calculate points
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
    const y = height - (val / max) * (height - padding * 2) - padding;
    return `${x},${y}`;
  }).join(' ');

  // Create path for area fill
  const areaPath = `M ${padding},${height} L ${points} L ${width - padding},${height} Z`;

  return (
    <div className="engagement-chart-wrap" style={{ width: '100%', height: '100%', minHeight: '120px' }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
        preserveAspectRatio="none"
      >
        {/* Gradient for fill */}
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* X-Axis helpers */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#eee" strokeWidth="1" />
        
        {/* Area fill */}
        <path d={areaPath} fill="url(#chartGradient)" className="animate-fade-in" />
        
        {/* Line */}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          style={{
            strokeDasharray: '2000',
            strokeDashoffset: '2000',
            animation: 'drawChart 2s ease forwards'
          }}
        />

        {/* Data Points */}
        {data.map((val, i) => {
          const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
          const y = height - (val / max) * (height - padding * 2) - padding;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill={color}
              stroke="white"
              strokeWidth="2"
              className="chart-dot"
            />
          );
        })}
      </svg>
      
      <style>{`
        @keyframes drawChart {
          to { stroke-dashoffset: 0; }
        }
        .chart-dot {
          opacity: 0;
          animation: fadeIn 0.5s ease forwards;
          animation-delay: calc(var(--i, 0) * 0.1s + 1s);
        }
        .engagement-chart-wrap:hover .chart-dot {
          r: 6;
          transition: r 0.2s ease;
        }
      `}</style>
    </div>
  );
}
