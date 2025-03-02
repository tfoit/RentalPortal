// Import necessary modules and models
const Notification = require("../models/Notification");

// Function to create a new notification
exports.createNotification = async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).send({ message: "UserId and message are required." });
    }

    const newNotification = new Notification({
      userId,
      message,
      read: false, // Default to unread
    });

    await newNotification.save();

    res.status(201).send(newNotification);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).send({ message: "Failed to create notification" });
  }
};

// Function to fetch unread notifications for a user
exports.getUnreadNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId, read: false });
    res.json(notifications);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Function to mark a notification as read
exports.markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.notificationId, { read: true }, { new: true });
    res.json(notification);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
