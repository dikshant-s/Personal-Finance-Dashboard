import React, { useState } from 'react';

const BankAccount = ({ addTransaction }) => {
  const [accountNumber, setAccountNumber] = useState('');
  const [transactionName, setTransactionName] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionDate, setTransactionDate] = useState('');

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (transactionName && transactionAmount && transactionDate) {
      addTransaction({
        name: transactionName,
        amount: `$${transactionAmount}`,
        date: transactionDate,
        status: 'Deposited', // or 'Withdrawn' based on your logic
      });
      // Reset form fields
      setTransactionName('');
      setTransactionAmount('');
      setTransactionDate('');
    }
  };

  return (
    <div className="bg-indigo-950 text-white p-5 rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold">Add Bank Account Details</h2>
      <form onSubmit={handleAddTransaction} className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Account Number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          className="p-2 rounded-md bg-gray-800 placeholder-gray-400 outline-none"
        />
        <input
          type="text"
          placeholder="Transaction Name"
          value={transactionName}
          onChange={(e) => setTransactionName(e.target.value)}
          className="p-2 rounded-md bg-gray-800 placeholder-gray-400 outline-none"
        />
        <input
          type="text"
          placeholder="Amount"
          value={transactionAmount}
          onChange={(e) => setTransactionAmount(e.target.value)}
          className="p-2 rounded-md bg-gray-800 placeholder-gray-400 outline-none"
        />
        <input
          type="date"
          value={transactionDate}
          onChange={(e) => setTransactionDate(e.target.value)}
          className="p-2 rounded-md bg-gray-800 outline-none"
        />
        <button type="submit" className="bg-green-500 text-white p-2 rounded-md">Add Transaction</button>
      </form>
    </div>
  );
};

export default BankAccount;