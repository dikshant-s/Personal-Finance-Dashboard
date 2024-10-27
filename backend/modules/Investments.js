const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User ' // Reference to the User model
    },
    assetName: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    purchasePrice: {
        type: Number,
        required: true
    },
    currentPrice: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const Investment = mongoose.model('Investment', investmentSchema);
module.exports = Investment
