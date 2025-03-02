
// Description: Model for bid information

const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
    apartment: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Apartment', 
        required: true 
    },
    bidder: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        required: true, 
        default: 'pending', 
        enum: ['pending', 'accepted', 'rejected'] 
    },
    // Add other fields as needed
}, { timestamps: true }); // Enable timestamps for bid history

module.exports = mongoose.model('Bid', bidSchema);
