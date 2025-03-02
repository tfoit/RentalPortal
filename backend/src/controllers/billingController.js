// This is billingController.js, where we will define the createBilling function to process billing and send notifications to tenants and owners. We will call the processBilling function from the billingService.js module to create a new billing record and send notifications. We will also handle any errors that occur during the billing process.

const { processBilling } = require("../services/billingService.js"); // Import the processBilling function from a service or module

exports.createBilling = async (req, res) => {
  try {
    const { apartmentId, billingData } = req.body;

    // Call the processBilling function to create a new billing record
    const newBilling = await processBilling(apartmentId, billingData);

    res.status(201).send({ message: "Billing processed and notifications sent successfully", newBilling });
  } catch (error) {
    console.error("Error processing billing:", error);
    res.status(500).send({ message: "Error processing billing", error: error.message });
  }
};
