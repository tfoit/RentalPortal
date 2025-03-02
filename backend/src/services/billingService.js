const Billing = require("../models/Billing");
const Contract = require("../models/Contract");
const { notifyUser } = require("./notificationFunctions");
const logger = require("../config/winstonConfig");
const User = require("../models/User");
const Notification = require("../models/Notification");

/**
 * Processes billing for a contract by generating a new bill,
 * splitting it among the tenants, and sending notifications.
 * @param {String} contractId - The ID of the contract to process billing for.
 * @param {String} billingPeriod - The period the billing covers.
 * @param {Date} dueDate - The due date for the bill.
 */
async function processBillingByContract(contractId, billingPeriod, dueDate) {
  try {
    // Fetch the specified contract
    const contract = await Contract.findById(contractId)
      .populate("versions.tenants.tenantId") // Ensure proper population based on your schema
      .exec();

    if (!contract || !contract.active) {
      logger.error("Active contract not found");
      return { error: "Active contract not found" };
    }

    // Determine the latest version of the contract
    const latestVersion = contract.versions.reduce((prev, current) => (prev.versionNumber > current.versionNumber || (prev.versionNumber === current.versionNumber && prev.minorVersion > current.minorVersion) ? prev : current));

    // Calculate the total amount due from the latest contract version
    const totalAmount = calculateTotalAmountFromContractVersion(latestVersion);

    // Calculate the amount each tenant owes
    const splitAmount = totalAmount / (latestVersion.tenants.length || 1);

    logger.info(`Processing billing for contract: ${contractId}. Total amount: ${totalAmount}, Split amount: ${splitAmount}`);

    // Create a new billing record
    const newBilling = await createBillingRecord(contract, latestVersion, totalAmount, splitAmount, billingPeriod, dueDate);

    // Notify tenants about the new bill
    await notifyTenants(latestVersion.tenants, newBilling, splitAmount);

    return { success: true, message: "Billing processed successfully for the contract", newBilling };
  } catch (error) {
    logger.error("Error processing billing by contract:", error);
    return { error: "Error processing billing by contract", details: error.message };
  }
}

/**
 * Helper function to calculate the total amount due from a contract version.
 */
function calculateTotalAmountFromContractVersion(version) {
  const rent = version.rent || 0;
  const totalUtilities = Object.values(version.utilities || {}).reduce((acc, curr) => acc + (curr || 0), 0);
  return rent + totalUtilities;
}

/**
 * Creates a new billing record in the database, now focused on contracts.
 */
async function createBillingRecord(contract, latestVersion, totalAmount, splitAmount, billingPeriod, dueDate) {
  const newBilling = new Billing({
    contract: contract._id,
    contractVersion: `${latestVersion.versionNumber}.${latestVersion.minorVersion}`,
    rent: latestVersion.rent || 0,
    utilities: latestVersion.utilities || {},
    totalAmount,
    amountRemaining: totalAmount,
    currency: latestVersion.currency || contract.currency, // Assuming currency can be specified at both contract and version level
    dueDate,
    billingPeriod,
    subBills: latestVersion.tenants.map((tenant) => ({
      tenant: tenant.tenantId, // Ensure mapping is correct based on your schema
      amount: splitAmount,
    })),
  });

  await newBilling.save();
  return newBilling;
}

/**
 * Notifies tenants about their new bill.
 */
// Assuming these imports are at the top of your file

async function notifyTenants(tenants, billing, splitAmount) {
  const subject = "New Bill Available";
  const getNotificationMessage = (firstName, billingPeriod, amount) => `Dear ${firstName}, your new bill for the period ${billingPeriod} is now available. Your share is ${amount}.`;

  for (const tenant of tenants) {
    try {
      const user = await User.findById(tenant.tenantId).exec();
      if (!user) {
        logger.error(`User not found for tenant ${tenant.tenantId}`);
        continue;
      }

      const message = getNotificationMessage(user.firstName, billing.billingPeriod, splitAmount);
      // Always create an internal notification
      await new Notification({
        userId: user._id,
        message: `${subject}: ${message}`,
        read: false,
      }).save();

      logger.info(`Notified tenant ${tenant.tenantId} about the new bill via internal notification.`);
      logger.info(`User ${user._id} has email notifications set to: ${user.emailNotifications}`);
      // Email notification based on user preference
      if (user.emailNotifications) {
        await notifyUser({
          userId: user._id,
          userEmail: user.email,
          subject,
          message,
        });
      }
    } catch (error) {
      logger.error(`Error notifying tenant ${tenant.tenantId} about the new bill:`, error);
    }
  }
}

module.exports = {
  processBillingByContract,
};
