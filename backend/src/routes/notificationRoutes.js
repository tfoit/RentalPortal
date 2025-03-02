const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

// Create a new notification
router.post("/", notificationController.createNotification);

// Fetch unread notifications for a user
router.get("/:userId/unread", notificationController.getUnreadNotifications);

// Mark a notification as read
router.patch("/:notificationId/read", notificationController.markNotificationAsRead);

module.exports = router;
