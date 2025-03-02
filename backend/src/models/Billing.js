const mongoose = require("mongoose");

const subBillSchema = new mongoose.Schema({
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["unpaid", "paid", "partial", "overdue"],
    default: "unpaid",
  },
  utilities: {
    electricity: Number,
    water: Number,
    gas: Number,
    internet: Number,
    trash: Number,
    advancements: Number,
    // Additional utilities as needed
  },
  // Additional fields as needed
});

const billingSchema = new mongoose.Schema({
  apartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Apartment",
    required: false, // Make apartment field optional or remove it if not necessary
  },
  contract: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contract",
    required: true,
  },
  contractVersion: {
    type: String, // Change to String to support "1.01" versioning
    required: true,
  },
  billingPeriod: {
    start: Date,
    end: Date,
  },
  rent: {
    type: Number,
    required: false,
  },
  currency: {
    type: String,
    enum: ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "SEK", "NZD", "PLN"],
    default: "EUR",
  },
  utilities: {
    electricity: Number,
    water: Number,
    gas: Number,
    internet: Number,
    trash: Number,
    advancements: Number,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  amountRemaining: Number,
  amountPaid: Number,
  dueDate: Date,
  status: {
    type: String,
    enum: ["paid", "unpaid", "partial", "overdue"],
    default: "unpaid",
  },
  subBills: [subBillSchema],
  payments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
  ],
});

module.exports = mongoose.model("Billing", billingSchema);
