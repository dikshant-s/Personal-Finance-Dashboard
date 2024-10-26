const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  amount: { type: String, required: true },
  category: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String, default: "" },
});

const Expense = mongoose.model("Expense", expenseSchema);
module.exports = Expense;

  