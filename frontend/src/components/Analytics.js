import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', Income: 40000, Outcome: 24000 },
  { name: 'Feb', Income: 30000, Outcome: 13980 },
  { name: 'Mar', Income: 20000, Outcome: 9800 },
  // Add more data...
];

const Analytics = () => {
  return (
    <div className="bg-indigo-950 p-4 px-6 rounded-2xl shadow-md">
      <h2 className="text-lg mb-4">Analytics</h2>
      <ResponsiveContainer width="102%" height={200} >
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="Income" stroke="#8884d8" />
          <Line type="monotone" dataKey="Outcome" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Analytics;
