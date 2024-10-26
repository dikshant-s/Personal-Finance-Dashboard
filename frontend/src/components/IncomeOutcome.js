import React from 'react';

const IncomeOutcome = ({ type, amount }) => {
  return (
    <div className="bg-indigo-950 p-4 rounded-2xl shadow-md">
      <h2 className="text-lg">{type}</h2>
      <p className="text-2xl font-bold">{amount}</p>
    </div>
  );
};

export default IncomeOutcome;
