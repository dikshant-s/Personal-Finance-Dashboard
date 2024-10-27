const mongoose = require('mongoose');

const savingsGoalSchema = new mongoose.Schema({
    goalName: {
        type: String,
        required: true,
        trim: true
    },
    targetAmount: {
        type: Number,
        required: true
    },
    currentSavings: {
        type: Number,
        default: 0 // Default to 0 if user hasn't saved yet
    },
    deadline: {
        type: String
    },
    description: {
        type: String,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true // Ensure userId is provided
    }
});

const SavingGoals = mongoose.model('SavingGoals', savingsGoalSchema);
module.exports = SavingGoals;
