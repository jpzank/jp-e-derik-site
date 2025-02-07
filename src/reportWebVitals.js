import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

let metrics = {
  CLS: 0, // Cumulative Layout Shift
  FID: 0, // First Input Delay
  FCP: 0, // First Contentful Paint
  LCP: 0, // Largest Contentful Paint
  TTFB: 0 // Time to First Byte
};

const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    getCLS(metric => {
      metrics.CLS = metric.value;
      onPerfEntry(metric);
    });
    getFID(metric => {
      metrics.FID = metric.value;
      onPerfEntry(metric);
    });
    getFCP(metric => {
      metrics.FCP = metric.value;
      onPerfEntry(metric);
    });
    getLCP(metric => {
      metrics.LCP = metric.value;
      onPerfEntry(metric);
    });
    getTTFB(metric => {
      metrics.TTFB = metric.value;
      onPerfEntry(metric);
    });
  }
};

export { metrics };
export default reportWebVitals;
