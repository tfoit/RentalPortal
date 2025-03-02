const { notifyUser } = require("../services/notificationFunctions");
const Billing = require("../models/Billing");
const cron = require("node-cron");

// Function to check and update overdue payments and notify users
const checkAndUpdateOverduePayments = async () => {
  try {
    const today = new Date();
    const billings = await Billing.find({
      status: { $in: ["unpaid", "partial"] },
      dueDate: { $lt: today },
    }).populate("subBills.tenant"); // Ensure this matches your schema's path

    for (const billing of billings) {
      if (billing.amountRemaining > 0) {
        billing.status = "overdue";
        await billing.save();
        console.log(`Billing ID: ${billing._id} updated to overdue.`);

        for (const subBill of billing.subBills) {
          // Log tenant data to verify fetching from the database
          console.log(`Tenant data for billing ID ${billing._id}:`, subBill.tenant);

          if (!subBill.tenant) {
            console.log(`Tenant not found for subBill in billing ID: ${billing._id}`);
            continue;
          }

          const tenant = subBill.tenant; // Assuming tenant is already populated
          const subject = "Overdue Payment Reminder";
          const message = `<html>
            <body>
              <p>Dear ${tenant.name || "Tenant"},</p>
              <p>Your payment of ${subBill.amount} is overdue since ${billing.dueDate.toLocaleDateString()}. Please settle your bill promptly.</p>
              <p>Best regards,</p>
              <p>Apartment Rental Portal Team</p>
            </body>
          </html>`;

          // Send notification (implementation of notifyUser is assumed)
          await notifyUser({
            userId: tenant._id,
            userEmail: tenant.email,
            subject,
            message,
          });
        }
      }
    }
  } catch (error) {
    console.error("Error checking and updating overdue payments:", error);
  }
};

// Schedule the job to run once a day at 12:00 AM
cron.schedule("0 0 * * *", () => {
  console.log("Running a check on overdue payments once a day.");
  checkAndUpdateOverduePayments();
});
