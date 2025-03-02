// Description: Model for payments made by tenants

const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    tenant: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    apartment: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Apartment', 
        required: true 
    },
    billing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Billing',
        required: true
    },
    amount: { 
        type: Number, 
        required: true 
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    paymentType: {
        type: String,
        enum: ['rent', 'utilities', 'other'],
    },
    status: {
        type: String,
        enum: ['full', 'partial', 'overdue','unpaid'],
    },
    paymentSource: { 
        type: String,
        enum:['portal','reconsile','cash'], 
        required: true
    }
    // Additional fields for tracking partial and overdue payments, if needed
});

module.exports = mongoose.model('Payment', paymentSchema);
