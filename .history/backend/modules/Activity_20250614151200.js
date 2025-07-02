// modules/Activity.js
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true }, // e.g., "Expense", "Investment", etc.
  amount: { type: Number, default: 0 },       // optional amount
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', activitySchema);
