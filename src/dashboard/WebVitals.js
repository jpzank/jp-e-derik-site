import React, { useState, useEffect } from 'react';
import { metrics } from '../reportWebVitals';

const WebVitals = () => {
  const [vitals, setVitals] = useState(metrics);

  useEffect(() => {
    // Update metrics every 5 seconds
    const interval = setInterval(() => {
      setVitals({...metrics});
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getMetricColor = (metric, value) => {
    // Thresholds based on Google's Core Web Vitals recommendations
    const thresholds = {
      CLS: { good: 0.1, poor: 0.25 },
      FID: { good: 100, poor: 300 },
      FCP: { good: 1800, poor: 3000 },
      LCP: { good: 2500, poor: 4000 },
      TTFB: { good: 800, poor: 1800 }
    };

    if (!thresholds[metric]) return 'text-white';
    
    if (value <= thresholds[metric].good) return 'text-green-400';
    if (value >= thresholds[metric].poor) return 'text-red-400';
    return 'text-yellow-400';
  };

  const getMetricLabel = (metric) => {
    const labels = {
      CLS: 'Cumulative Layout Shift',
      FID: 'First Input Delay (ms)',
      FCP: 'First Contentful Paint (ms)',
      LCP: 'Largest Contentful Paint (ms)',
      TTFB: 'Time to First Byte (ms)'
    };
    return labels[metric] || metric;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Web Vitals</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(vitals).map(([metric, value]) => (
          <div key={metric} className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm mb-1">{getMetricLabel(metric)}</h3>
            <p className={`text-2xl font-bold ${getMetricColor(metric, value)}`}>
              {metric === 'CLS' ? value.toFixed(3) : Math.round(value)}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-6 bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Performance Legend</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-green-400 mr-2"></span>
            <span className="text-sm">Good</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></span>
            <span className="text-sm">Needs Improvement</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-red-400 mr-2"></span>
            <span className="text-sm">Poor</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebVitals; 