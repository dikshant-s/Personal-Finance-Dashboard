import React, { useState } from "react";

// Dummy payments data
const dummyPayments = [
  {
    amount: "50.00",
    category: "Groceries",
    paymentMethod: "Credit Card",
    date: "2024-10-05",
    description: "Weekly groceries shopping",
  },
  {
    amount: "1200.00",
    category: "Rent",
    paymentMethod: "Bank Transfer",
    date: "2024-10-01",
    description: "Monthly rent payment",
  },
  {
    amount: "75.00",
    category: "Utilities",
    paymentMethod: "Debit Card",
    date: "2024-10-03",
    description: "Electricity bill for October",
  },
  {
    amount: "20.00",
    category: "Entertainment",
    paymentMethod: "Cash",
    date: "2024-10-08",
    description: "Movie night",
  },
  {
    amount: "300.00",
    category: "Subscriptions",
    paymentMethod: "Credit Card",
    date: "2024-10-10",
    description: "Monthly streaming service",
  },
];

const Expenses = () => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [expenses, setExpenses] = useState(dummyPayments); // Initialize with dummy payments

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (amount && category && paymentMethod && date) {
      const newExpense = { amount, category, paymentMethod, date, description };
      setExpenses([...expenses, newExpense]);
      setAmount("");
      setCategory("");
      setPaymentMethod("");
      setDate("");
      setDescription("");
      setRecurring(false);
    }
  };

  return (
    <div className="bg-gray-900 p-4 rounded-md overflow-hidden">
      <h2 className="text-xl font-bold mb-4">Add Expense</h2>
      <form onSubmit={handleAddExpense} className="mb-6">
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
          <label className="flex items-center col-span-2 text-black">
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
          Add Expense
        </button>
      </form>

      <h2 className="text-xl font-bold mb-4">Expense List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 border border-gray-600">
          <thead>
            <tr className="bg-gray-700">
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Description</th>
              <th className="py-2 px-4 border-b">Category</th>
              <th className="py-2 px-4 border-b">Amount</th>
              <th className="py-2 px-4 border-b">Payment Method</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => (
              <tr key={index} className="hover:bg-gray-600">
                <td className="py-2 px-4 border-b">{expense.date}</td>
                <td className="py-2 px-4 border-b">{expense.description}</td>
                <td className="py-2 px-4 border-b">{expense.category}</td>
                <td className="py-2 px-4 border-b">{expense.amount}</td>
                <td className="py-2 px-4 border-b">{expense.paymentMethod}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => {
                      // Logic to edit expense (not implemented)
                    }}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setExpenses(expenses.filter((_, i) => i !== index));
                    }}
                    className="text-red-500 hover:underline ml-2"
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
