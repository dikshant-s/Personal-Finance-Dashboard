import React, { useState } from 'react';

const transactions = [
  { name: 'Adobe After Effect', date: 'Sat, 20 Apr 2020', amount: '$80.09', status: 'Deposited' },
  { name: 'McDonald\'s', date: 'Fri, 19 Apr 2020', amount: '$7.03', status: 'Deposited' },
  { name: 'Levi\'s', date: 'Tue, 19 Apr 2020', amount: '$30.09', status: 'Deposited' },
];

const TransactionTable = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter transactions based on search query
  const filteredTransactions = transactions.filter(transaction =>
    transaction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-indigo-950 text-white p-5 rounded-2xl shadow-md h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Recent Transactions</h2>
        <div className="flex space-x-2">
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-1.5 rounded-md bg-gray-800 text-white placeholder-gray-400 text-sm outline-none"
          />
          <input 
            type="text" 
            placeholder="Date Range" 
            className="p-1.5 rounded-md bg-gray-800 text-white placeholder-gray-400 text-sm outline-none"
          />
        </div>
      </div>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-gray-400 border-b border-gray-600">
            <th className="py-2">Name</th>
            <th className="py-2">Date</th>
            <th className="py-2">Amount</th>
            <th className="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction, index) => (
              <tr key={index} className="border-b border-gray-600 hover:bg-gray-600">
                <td className="py-2 flex items-center space-x-3">
                  <div className="bg-gray-800 p-2 rounded-full"></div>
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
    </div>
  );
};

export default TransactionTable;