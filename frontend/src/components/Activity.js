import React from 'react';

const Activity = () => {
  return (
    <div className="bg-indigo-950 p-6 rounded-2xl shadow-md">
      <h3 className="text-white text-lg font-semibold mb-4">Activity</h3>
      
      {/* Pie chart or activity chart placeholder */}
      <div className="relative">
        <div className="w-32 h-32 bg-blue-600 rounded-full mx-auto"></div>
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-2xl">
          75%
        </div>
      </div>
      
      {/* Activity breakdown */}
      <div className="mt-6">
        <div className="flex justify-between text-gray-400">
          <span>Daily Payment</span>
          <span>55%</span>
        </div>
        <div className="w-full bg-gray-700 h-1 mb-2">
          <div className="bg-blue-600 h-1" style={{ width: '55%' }}></div>
        </div>
        
        <div className="flex justify-between text-gray-400">
          <span>Hobby</span>
          <span>20%</span>
        </div>
        <div className="w-full bg-gray-700 h-1 mb-2">
          <div className="bg-purple-600 h-1" style={{ width: '20%' }}></div>
        </div>

        {/* Add more categories as needed */}
      </div>

      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4 w-full">
        View all activity
      </button>
    </div>
  );
};

export default Activity;
