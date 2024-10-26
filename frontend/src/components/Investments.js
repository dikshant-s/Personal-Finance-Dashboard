import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2'; // Assuming you're using Chart.js for charts

const InvestmentPage = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const response = await axios.get('/api/investments'); // Your backend endpoint
        setInvestments(response.data); // Assuming the response has the investments data
      } catch (error) {
        setError('Error fetching investment data');
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, []);

  // Pie chart data (dummy data)
  const pieData = {
    labels: ['Stocks', 'Bonds', 'Mutual Funds', 'ETFs'],
    datasets: [
      {
        data: [300, 50, 100, 40], // Dummy data
        backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0'],
      },
    ],
  };

  // Render loading or error message
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-8 bg-gray-800 text-white ">
      <h2 className="text-2xl mb-4">Investment Overview</h2>

      {/* Pie Chart */}
      <div className="mb-8">
        <h3 className="text-xl mb-2">Investment Allocation</h3>
        <Pie data={pieData} />
      </div>

      {/* Investment Portfolio */}
      <h3 className="text-xl mb-2">Investment Portfolio</h3>
      <table className="min-w-full border border-gray-600">
        <thead>
          <tr>
            <th className="border-b px-4 py-2">Asset Name</th>
            <th className="border-b px-4 py-2">Type</th>
            <th className="border-b px-4 py-2">Quantity</th>
            <th className="border-b px-4 py-2">Purchase Price</th>
            <th className="border-b px-4 py-2">Current Price</th>
            <th className="border-b px-4 py-2">Total Value</th>
            <th className="border-b px-4 py-2">Gain/Loss</th>
          </tr>
        </thead>
        <tbody>
          {investments.map((investment) => (
            <tr key={investment.id}>
              <td className="border-b px-4 py-2">{investment.assetName}</td>
              <td className="border-b px-4 py-2">{investment.type}</td>
              <td className="border-b px-4 py-2">{investment.quantity}</td>
              <td className="border-b px-4 py-2">${investment.purchasePrice}</td>
              <td className="border-b px-4 py-2">${investment.currentPrice}</td>
              <td className="border-b px-4 py-2">${investment.totalValue}</td>
              <td className="border-b px-4 py-2">${investment.gainLoss}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvestmentPage;