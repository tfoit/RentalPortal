// Enhanced Function to send notifications to users
const logger = require("../config/winstonConfig");
const Notification = require("../models/Notification");
const { sendEmail } = require("./emailService");

async function notifyUser({ userId, userEmail, subject, message }) {
  // Internal notification is handled outside this function for clarity and separation of concerns

  // Proceed to send an email if the userEmail is provided. User's email notification preference check is handled externally.
  if (userEmail) {
    try {
      await sendEmail({
        to: userEmail,
        subject,
        html: `<p>${message}</p>`, // Using HTML for email formatting
      });
      logger.info(`Notified user ${userId} via email.`);
    } catch (error) {
      logger.error(`Error notifying user ${userId} via email:`, error);
    }
  }
}

module.exports = {
  notifyUser,
};
