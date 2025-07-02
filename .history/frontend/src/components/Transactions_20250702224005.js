import React, { useState, useEffect } from 'react';

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecentExpenses = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.REACT_APP_API_URL}/expenses/activity/recent?limit=5`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch recent transactions');
        }

        const data = await res.json();

        const formatted = data.map((tx) => ({
          name: tx.category || 'N/A',
          date: new Date(tx.date).toLocaleDateString('en-IN', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
          amount: `₹${parseFloat(tx.amount).toFixed(2)}`,
          status: tx.paymentMethod || 'Unknown',
        }));

        setTransactions(formatted);
        setError('');
      } catch (err) {
        console.error('Error:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentExpenses();
  }, []);

  const filteredTransactions = transactions.filter((tx) =>
    tx.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-indigo-950 text-white p-5 rounded-2xl shadow-md h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Recent Transactions</h2>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-1.5 rounded-md bg-gray-800 text-white placeholder-gray-400 text-sm outline-none"
        />
      </div>

      {loading ? (
        <div className="text-gray-300 text-center py-8">Loading transactions...</div>
      ) : error ? (
        <div className="text-red-400 text-center py-8">{error}</div>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-gray-600">
              <th className="py-2">Name</th>
              <th className="py-2">Date</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Method</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction, index) => (
                <tr key={index} className="border-b border-gray-600 hover:bg-gray-600">
                  <td className="py-2 flex items-center space-x-3">
                    <div className="bg-gray-800 p-2 rounded-full" />
                    <span>{transaction.name}</span>
                  </td>
                  <td className="py-2">{transaction.date}</td>
                  <td className="py-2">{transaction.amount}</td>
                  <td className="py-2">
                    <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs">
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-400">No transactions found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionTable;
