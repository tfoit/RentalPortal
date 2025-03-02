const mongoose = require("mongoose");
const Payment = require("./Payment"); // Assuming your Payment model is in the same directory
const Notification = require("./Notification");

const changeLogEntrySchema = new mongoose.Schema(
  {
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    changeDate: {
      type: Date,
      default: Date.now,
    },
    changeDescription: String,
  },
  { _id: false }
);

const appendixSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["utilityUpdate", "rentAdjustment", "termModification", "leaseExtension", "newClauseAddition"],
    required: true,
  },
  title: String,
  content: String,
  dateAdded: {
    type: Date,
    default: Date.now,
  },
  changes: mongoose.Schema.Types.Mixed,
  versionNumber: Number,
  minorVersion: Number,
});

const contractVersionSchema = new mongoose.Schema(
  {
    versionNumber: {
      type: Number,
      required: true,
    },
    minorVersion: {
      type: Number,
      default: 0,
    },
    startDate: Date,
    endDate: Date,
    rent: Number,
    deposit: Number,
    utilitiesIncluded: Boolean,
    utilities: {
      electricity: Number,
      water: Number,
      gas: Number,
      internet: Number,
      trash: Number,
      advancements: Number,
    },
    totalAmount: Number,
    currency: {
      type: String,
      enum: ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "SEK", "NZD", "PLN"],
      default: "EUR",
    },
    tenants: [
      {
        tenantId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        name: String,
        email: String,
      },
    ],
    amendments: [
      {
        amendmentDate: Date,
        changes: String,
      },
    ],
    appendices: [appendixSchema],
    notes: String,
    changelog: [changeLogEntrySchema],
    payments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
      },
    ],
    notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
      },
    ],
  },
  { timestamps: true }
);

const contractSchema = new mongoose.Schema(
  {
    apartmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Apartment",
      required: true,
    },
    billingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Billing",
    },
    currency: String,
    versions: [contractVersionSchema],
    currentVersion: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
    landlordType: {
      type: String,
      enum: ["agency", "lessor", "owner"],
      required: true,
    },
    landlord: {
      landlordName: {
        // changed from 'name' to match your JSON input
        type: String,
        required: true,
      },
      landlordContact: {
        // changed from 'contactInfo' to match your JSON input
        email: {
          type: String,
          required: true,
        },
        phone: {
          type: String,
          required: true,
        },
      },
    },

    status: {
      type: String,
      enum: ["draft", "pending", "active", "terminated", "expired"],
      default: "draft",
    },
  },
  { timestamps: true, discriminatorKey: "landlordType" }
);

module.exports = mongoose.model("Contract", contractSchema);
