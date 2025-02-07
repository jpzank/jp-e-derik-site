import React from 'react';

const Overview = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Songs</h3>
          <p className="text-2xl">3</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Monthly Listeners</h3>
          <p className="text-2xl">--</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Recent Events</h3>
          <p className="text-2xl">--</p>
        </div>
      </div>
    </div>
  );
};

export default Overview; 