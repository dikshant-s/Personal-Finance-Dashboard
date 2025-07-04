import React, { useState, useEffect } from "react";

const CardDetails = ({ balance, setBalance }) => {
  const [editing, setEditing] = useState(false);
  const [newBalance, setNewBalance] = useState(balance.toFixed(2));

  // ✅ Sync local newBalance with updated parent balance
  useEffect(() => {
    setNewBalance(balance.toFixed(2));
  }, [balance]);

  const handleSave = async () => {
    const parsed = parseFloat(newBalance);
    if (!isNaN(parsed)) {
      setBalance(parsed); // update UI

      // Save to backend
      const token = localStorage.getItem("token");
      try {
        await fetch(`${process.env.REACT_APP_API_URL}/balance`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ balance: parsed }),
        });
      } catch (err) {
        console.error("Failed to save balance:", err);
      }

      setEditing(false);
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
