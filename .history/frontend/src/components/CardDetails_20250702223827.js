import React, { useState } from 'react';

const CardDetails = ({ balance, setBalance }) => {
  const [editing, setEditing] = useState(false);
  const [newBalance, setNewBalance] = useState(balance.toFixed(2));

  const handleSave = () => {
    const parsed = parseFloat(newBalance);
    if (!isNaN(parsed)) {
      setBalance(parsed); // Update balance in parent
      setEditing(false);  // Exit edit mode
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-2xl text-white shadow-md pt-10 pb-10">
      <p className="text-lg font-bold">ACCOUNT BALANCE</p>

      {editing ? (
        <input
          type="number"
          value={newBalance}
          onChange={(e) => setNewBalance(e.target.value)}
          className="mt-2 p-2 rounded text-black w-full"
        />
      ) : (
        <p className="text-3xl font-bold mt-2">₹{balance.toFixed(2)}</p>
      )}

      <div className="flex flex-col pt-5">
        {editing ? (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="bg-white text-purple-600 px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-200 text-purple-600 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="bg-white text-purple-600 mt-4 px-4 py-2 rounded"
          >
            Manage Balance
          </button>
        )}
      </div>
    </div>
  );
};

export default CardDetails;
