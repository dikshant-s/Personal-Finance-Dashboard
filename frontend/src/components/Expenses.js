import React, { useState, useEffect } from "react";

const Expenses = () => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null); // State for editing

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage

      const response = await fetch("http://localhost:8000/expenses", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Include token in the Authorization header
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setExpenses(data); // Update state with fetched expenses
      } else {
        console.error("Failed to fetch expenses");
      }
    };
    fetchExpenses();
  }, []);


  const addExpense = async (newExpense) => {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    const response = await fetch("http://localhost:8000/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Include the token in the Authorization header
      },
      body: JSON.stringify(newExpense),
    });

    if (response.ok) {
      const data = await response.json();
      setExpenses([...expenses, data]); // Update the expenses state with the new expense
    } else {
      const errorData = await response.json();
      console.error('Error adding expense:', errorData.message); // Log any error message from the server
    }
  };


  const editExpense = async (updatedExpense) => {
    const response = await fetch(`http://localhost:8000/expenses/${updatedExpense._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedExpense),
    });
    const data = await response.json();
    setExpenses(expenses.map((expense) => (expense._id === data._id ? data : expense)));
    setEditingExpense(null); // Clear editing state
  };

  const deleteExpense = async (id) => {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage

    const response = await fetch(`http://localhost:8000/expenses/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`, // Include the token in the Authorization header
      },
    });

    if (response.ok) {
      // If the delete was successful, update the state to remove the deleted expense
      setExpenses(expenses.filter((expense) => expense._id !== id));
    } else {
      const errorData = await response.json();
      console.error('Error deleting expense:', errorData.message); // Log any error message from the server
    }
  };

  const handleAddOrUpdateExpense = async (e) => {
    e.preventDefault();
    if (amount && category && paymentMethod && date) {
      const newExpense = { amount, category, paymentMethod, date, description };
      if (editingExpense) {
        await editExpense({ ...newExpense, _id: editingExpense._id });
      } else {
        await addExpense(newExpense);
      }
      setAmount("");
      setCategory("");
      setPaymentMethod("");
      setDate("");
      setDescription("");
      setRecurring(false);
    }
  };

  return (
    <div className="bg-indigo-950 p-4   rounded-2xl overflow-hidden">
      <h2 className="text-xl font-bold mb-4">{editingExpense ? "Edit Expense" : "Add Expense"}</h2>
      <form onSubmit={handleAddOrUpdateExpense} className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border border-gray-600 p-2 rounded-md text-black"
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-600 p-2 rounded-md text-black"
            required
          />
          <input
            type="text"
            placeholder="Payment Method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="border border-gray-600 p-2 rounded-md text-black"
            required
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-600 p-2 rounded-md text-black"
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-600 p-2 rounded-md col-span-2 text-black"
          />
          <label className="flex items-center col-span-2 text-white">
            <input
              type="checkbox"
              checked={recurring}
              onChange={() => setRecurring(!recurring)}
              className="mr-2"
            />
            Set as Recurring Expense
          </label>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white p-2 rounded-md"
        >
          {editingExpense ? "Update Expense" : "Add Expense"}
        </button>
      </form>

      <h2 className="text-xl font-bold mb-4">Expense List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 border border-gray-600">
          <thead>
            <tr className="text-white">
              <th className="border border-gray-600 p-2">Amount</th>
              <th className="border border-gray-600 p-2">Category</th>
              <th className="border border-gray-600 p-2">Payment Method</th>
              <th className="border border-gray-600 p-2">Date</th>
              <th className="border border-gray-600 p-2">Description</th>
              <th className="border border-gray-600 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense._id} className="text-white">
                <td className="border border-gray-600 p-2">{expense.amount}</td>
                <td className="border border-gray-600 p-2">{expense.category}</td>
                <td className="border border-gray-600 p-2">{expense.paymentMethod}</td>
                <td className="border border-gray-600 p-2">{expense.date}</td>
                <td className="border border-gray-600 p-2">{expense.description}</td>
                <td className="border border-gray-600 p-2">
                  <button
                    onClick={() => {
                      setEditingExpense(expense);
                      setAmount(expense.amount);
                      setCategory(expense.category);
                      setPaymentMethod(expense.paymentMethod);
                      setDate(expense.date);
                      setDescription(expense.description);
                    }}
                    className="bg-yellow-500 text-white p-1 rounded-md mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      const confirmed = window.confirm("Are you sure you want to delete this expense?");
                      if (confirmed) {
                        await deleteExpense(expense._id); // Call the existing delete function
                      }
                    }}
                    className="bg-red-600 text-white p-1 rounded-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Expenses;