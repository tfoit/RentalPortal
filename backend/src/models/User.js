const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { encrypt, decrypt } = require("../services/encryptiondecryptionService");

const apartmentHistorySchema = new mongoose.Schema({
  apartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Apartment",
  },
  moveInDate: { type: Date, required: true },
  moveOutDate: Date,
});

const userSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true, get: decrypt, set: encrypt },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  gender: {
    type: String,
    enum: ["male", "female", "non-binary", "prefer-not-to-say"],
    required: false,
  },
  dateOfBirth: { type: Date, required: false },
  socialsecurityNumber: { type: String, required: false, get: decrypt, set: encrypt },
  passportNumber: { type: String, required: false, get: decrypt, set: encrypt },
  nationality: { type: String, required: false },
  language: { type: String, required: false },
  phoneNumber: { type: String, required: false, get: decrypt, set: encrypt },
  role: {
    type: String,
    enum: ["admin", "tenant", "owner", "manager", "agency", "not renting", "regular", "new"],
    default: "new",
  },
  status: {
    type: String,
    enum: ["active", "inactive", "pending_verification", "new"],
    default: "new",
  },
  apartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Apartment",
  },
  apartmentHistory: [apartmentHistorySchema],
  payments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
  ],
  accountBalance: {
    type: Number,
    default: 0,
  },
  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },
  address: {
    street: { type: String, required: false },
    city: { type: String, required: false },
    zipCode: { type: String, required: false },
  },
  privacySettings: {
    allowContactFromOtherUsers: { type: Boolean, default: true },
  },
  version: { type: Number, default: 1 },
});

// Password hashing middleware
userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Ensure mongoose uses getters when converting document to JSON
userSchema.set("toJSON", { getters: true });
userSchema.set("toObject", { getters: true });

module.exports = mongoose.model("User", userSchema);
