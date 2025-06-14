import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Activity = () => {
  const [activitySummary, setActivitySummary] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get('https://your-backend-url/api/activities'); // 🔁 Replace with real URL
        const data = res.data;

        // Group and calculate percentage per category
        const total = data.reduce((sum, a) => sum + a.amount, 0);
        const summary = {};

        data.forEach((activity) => {
          if (!summary[activity.category]) {
            summary[activity.category] = 0;
          }
          summary[activity.category] += activity.amount;
        });

        const percentageData = Object.entries(summary).map(([category, amount]) => ({
          category,
          amount,
          percent: ((amount / total) * 100).toFixed(0),
        }));

        setActivitySummary(percentageData);
      } catch (err) {
        console.error('Failed to fetch activity summary:', err);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="bg-indigo-950 p-6 rounded-2xl shadow-md">
      <h3 className="text-white text-lg font-semibold mb-4">Activity</h3>

      {/* Placeholder circle chart */}
      <div className="relative mb-6">
        <div className="w-32 h-32 bg-blue-600 rounded-full mx-auto opacity-80" />
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-2xl">
          {activitySummary.length ? `${activitySummary[0].percent}%` : '...'}
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-4">
        {activitySummary.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between text-gray-400 text-sm">
              <span>{item.category}</span>
              <span>{item.percent}%</span>
            </div>
            <div className="w-full bg-gray-700 h-2 rounded-full">
              <div
                className={`h-2 rounded-full ${index % 2 === 0 ? 'bg-blue-500' : 'bg-purple-500'}`}
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* View all */}
      <button
        onClick={() => navigate('/all-activities')}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-6 w-full hover:bg-blue-500"
      >
        View all activity
      </button>
    </div>
  );
};

export default Activity;
