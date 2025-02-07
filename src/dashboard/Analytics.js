import React, { useState, useEffect, useCallback } from 'react';

const Analytics = () => {
  const [pageViews, setPageViews] = useState({});
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [error, setError] = useState(null);

  const fetchAnalyticsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Get the date range based on selected timeRange
      const endDate = new Date();
      const startDate = new Date();
      switch (timeRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
        default:
          startDate.setDate(endDate.getDate() - 7);
      }

      // Using gtag to get page views
      window.gtag('get', process.env.REACT_APP_GA_MEASUREMENT_ID, 'page_view', (pageViews) => {
        setPageViews(pageViews || {
          '/': 0,
          '/admin': 0,
          '/music': 0,
          '/about': 0
        });
      });

      // Using gtag to get events
      window.gtag('get', process.env.REACT_APP_GA_MEASUREMENT_ID, 'event', (events) => {
        const formattedEvents = events ? Object.entries(events).map(([name, count]) => ({
          name,
          count: parseInt(count)
        })) : [
          { name: 'Button Click - Play Music', count: 0 },
          { name: 'Social Share', count: 0 },
          { name: 'Contact Form Submit', count: 0 },
          { name: 'Video Play', count: 0 }
        ];
        setEvents(formattedEvents);
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to fetch analytics data. Please make sure you have proper access and credentials.');
      
      // Fallback to sample data for development/demo purposes
      setPageViews({
        '/': 0,
        '/admin': 0,
        '/music': 0,
        '/about': 0
      });

      setEvents([
        { name: 'Button Click - Play Music', count: 0 },
        { name: 'Social Share', count: 0 },
        { name: 'Contact Form Submit', count: 0 },
        { name: 'Video Play', count: 0 }
      ]);
    }
    setLoading(false);
  }, [timeRange]);

  useEffect(() => {
    if (!window.gtag) {
      console.error('Google Analytics not loaded');
      setError('Google Analytics not initialized properly');
      return;
    }
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Analytics</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-gray-800 text-white rounded px-3 py-1 border border-gray-700"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-900/50 text-red-200 p-4 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading analytics data...</p>
        </div>
      ) : (
        <>
          {/* Page Views Section */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Page Views</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(pageViews).map(([page, views]) => (
                <div key={page} className="bg-gray-900 p-4 rounded-lg">
                  <div className="text-gray-400 mb-1">{page}</div>
                  <div className="text-2xl font-bold">{views}</div>
                </div>
              ))}
            </div>
          </div>

          {/* User Interactions Section */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">User Interactions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map((event, index) => (
                <div key={index} className="bg-gray-900 p-4 rounded-lg">
                  <div className="text-gray-400 mb-1">{event.name}</div>
                  <div className="text-2xl font-bold">{event.count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visualization Section */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Interaction Trends</h3>
            <div className="h-64 flex items-end space-x-4">
              {events.map((event, index) => {
                const height = (event.count / Math.max(...events.map(e => e.count))) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-blue-600 rounded-t"
                      style={{ height: `${height}%` }}
                    ></div>
                    <div className="text-xs mt-2 text-gray-400 text-center">
                      {event.name.split(' ').map(word => <div key={word}>{word}</div>)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics; 