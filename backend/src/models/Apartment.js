const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { encrypt, decrypt } = require("../services/encryptiondecryptionService");

// Create Schema for Apartment
const ApartmentSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  rent: {
    type: Number,
    required: true,
  },
  deposit: {
    type: Number,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  sizeUnit: {
    type: String,
    enum: ["sqm", "sqft"],
    default: "sqm",
  },
  utilities: {
    electricity: {
      type: Number,
      required: true,
    },
    internet: {
      type: Number,
      required: true,
    },
    advancements: {
      type: Number,
      required: true,
    },
  },
  currency: {
    type: String,
    enum: ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "SEK", "NZD", "PLN"],
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["available", "rented", "unavailable"],
    default: "available",
  },
  rentStartDate: {
    type: Date,
  },
  modifiedDate: {
    type: Date,
    default: Date.now,
  },
  media: {
    images: [
      {
        type: Schema.Types.ObjectId,
        ref: "GridFS",
      },
    ],
    pdfBlueprints: [
      {
        type: Schema.Types.ObjectId,
        ref: "GridFS",
      },
    ],
    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "GridFS",
      },
    ],
  },
  amenities: [
    {
      type: String,
    },
  ],
  bidAccepted: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tenants: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  billing: [
    {
      type: Schema.Types.ObjectId,
      ref: "Billing",
    },
  ],
  contracts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Contract",
    },
  ],
  currentContract: {
    type: Schema.Types.ObjectId,
    ref: "Contract",
  },
  buildingDetails: {
    yearBuilt: {
      type: Number,
    },
    floor: {
      type: Number,
    },
    numberOfFloors: {
      type: Number,
    },
    elevators: {
      type: Boolean,
    },
    additionalDetails: {
      parking: {
        type: Boolean,
      },
      security: {
        type: Boolean,
      },
      pool: {
        type: Boolean,
      },
      gym: {
        type: Boolean,
      },
      garden: {
        type: Boolean,
      },
      otherAmenities: [
        {
          type: String,
        },
      ],
    },
  },
});

// Ensure mongoose uses getters when converting document to JSON
ApartmentSchema.set("toJSON", { getters: true });
ApartmentSchema.set("toObject", { getters: true });

module.exports = mongoose.model("Apartment", ApartmentSchema);
