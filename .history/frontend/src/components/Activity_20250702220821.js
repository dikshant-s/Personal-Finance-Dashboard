import React, { useEffect, useState } from "react";

const Activity = () => {
  const [recentExpenses, setRecentExpenses] = useState([]);

  useEffect(() => {
    const fetchRecentExpenses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.REACT_APP_API_URL}/expenses/activity/recent?limit=5`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setRecentExpenses(data);
        } else {
          console.error("Failed to fetch recent activity");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchRecentExpenses();
  }, []);

  return (
    <div className="bg-indigo-950 p-6 rounded-2xl shadow-md">
      <h3 className="text-white text-lg font-semibold mb-4">Recent Activity</h3>

      {/* Expenses list */}
      <ul className="text-white space-y-3 max-h-60 overflow-y-auto scrollbar-thin">
        {recentExpenses.length === 0 ? (
          <p className="text-gray-400">No recent activity found.</p>
        ) : (
          recentExpenses.map((expense) => (
            <li key={expense._id} className="bg-indigo-800 p-3 rounded-md">
              <div className="flex justify-between">
                <span className="font-semibold">{expense.category}</span>
                <span className="text-green-400 font-bold">₹{expense.amount}</span>
              </div>
              <div className="text-sm text-gray-300">{expense.paymentMethod} • {new Date(expense.date).toLocaleDateString()}</div>
              {expense.description && <div className="text-xs text-gray-400 mt-1 italic">{expense.description}</div>}
            </li>
          ))
        )}
      </ul>

      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-6 w-full hover:bg-blue-500">
        View all activity
      </button>
    </div>
  );
};

export default Activity;
