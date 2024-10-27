const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // Add userId field
  amount: { type: String, required: true },
  category: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String, default: "" },
});

const Expense = mongoose.model("Expense", expenseSchema);
module.exports = Expense;
