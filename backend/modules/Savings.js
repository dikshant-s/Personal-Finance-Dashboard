const mongoose = require('mongoose');

const savingsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Savings = mongoose.model('Savings', savingsSchema);
module.exports = Savings;
