// This is the Notoification model located in the folder path: /src/models/Notification.js

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  // Add any other fields you expect to store in notifications
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
