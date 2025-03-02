// rental_management_backend.js

require("dotenv").config({ path: ".env.development" });

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

const cron = require("node-cron");

// Schedule the task to run daily at midnight
cron.schedule("0 0 * * *", () => {
  console.log("Running daily check for overdue payments...");
  checkAndUpdateOverduePayments();
});

app.use(bodyParser.json());

console.log("Connecting to MongoDB:", process.env.MONGODB_URI);
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

// Import models
const User = require("./src/models/User");
const Apartment = require("./src/models/Apartment");
const Billing = require("./src/models/Billing");
const Payment = require("./src/models/Payment");
const Bid = require("./src/models/Bid");
const Notification = require("./src/models/Notification"); // Adjust path as necessary

// Import services e-mail notification
const { sendEmail } = require("./src/services/notificationFunctions");
const nodemon = require("nodemon");

// User Registration
app.post("/register", async (req, res) => {
  try {
    let user = new User(req.body);
    user = await user.save();

    res.status(201).send({ user, message: "User registered successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error registering user", error });
  }
});

// Create Apartment
app.post("/apartments", async (req, res) => {
  try {
    let apartment = new Apartment(req.body);
    apartment = await apartment.save();
    res.status(201).send(apartment);
  } catch (error) {
    res.status(500).send({ message: "Error adding apartment", error });
  }
});

// Read All Apartments
app.get("/apartments", async (req, res) => {
  try {
    const apartments = await Apartment.find({});
    res.send(apartments);
  } catch (error) {
    res.status(500).send({ message: "Error getting apartments", error });
  }
});

// Read Single Apartment by Id
app.get("/apartments/:id", async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);
    if (!apartment) {
      return res.status(404).send({ message: "Apartment not found" });
    }
    res.send(apartment);
  } catch (error) {
    res.status(500).send({ message: "Error getting apartment", error });
  }
});

// Update Apartment by Id
app.put("/apartments/:id", async (req, res) => {
  try {
    const apartment = await Apartment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!apartment) {
      return res.status(404).send({ message: "Apartment not found" });
    }
    res.send(apartment);
  } catch (error) {
    res.status(400).send({ message: "Error updating apartment", error });
  }
});

// Update utilities for an apartment
app.patch("/apartments/:apartmentId/update-utilities", async (req, res) => {
  try {
    const apartmentId = req.params.apartmentId;
    const updatedUtilities = req.body.utilities;

    const apartment = await Apartment.findById(apartmentId);
    if (!apartment) {
      return res.status(404).send({ message: "Apartment not found" });
    }

    apartment.utilities = updatedUtilities;
    await apartment.save();

    res.status(200).send({ message: "Utilities updated successfully", apartment });
  } catch (error) {
    res.status(500).send({ message: "Error updating utilities", error });
  }
});

app.post("/apartments/:apartmentId/process-billing", async (req, res) => {
  try {
    const apartmentId = req.params.apartmentId;
    const apartment = await Apartment.findById(apartmentId).populate("tenants");

    if (!apartment || apartment.tenants.length === 0) {
      return res.status(404).send({ message: "Apartment not found or no tenants" });
    }

    const { price: rent, utilities } = apartment;
    if (isNaN(rent) || Object.values(utilities).some((val) => isNaN(val))) {
      return res.status(400).send({ message: "Invalid rent or utility values" });
    }

    const totalAmount = rent + utilities.electricity + utilities.advancements + utilities.internet;
    const splitAmount = totalAmount / apartment.tenants.length;

    const newBilling = new Billing({
      apartment: apartmentId,
      rent,
      totalAmount,
      amountRemaining: totalAmount,
      ...req.body,
      subBills: apartment.tenants.map((tenant) => ({
        tenant: tenant._id,
        amount: splitAmount,
      })),
    });
    await newBilling.save();

    // Update apartment document with the new billing record
    apartment.billing.push(newBilling._id);
    await apartment.save();

    // Notify each tenant about the new bill
    apartment.tenants.forEach((tenant) => {
      // Structured message with breakdown of rent and utilities
      const emailMessage = `
      New Billing Notification
      <p>A new bill has been generated for your apartment at <strong>${apartment.location}</strong>.</p>
      <p>Here is the breakdown of the total amount due:</p>
      <ul>
          <li>Rent: ${rent} USD</li>
          <li>Electricity: ${utilities.electricity} USD</li>
          <li>Internet: ${utilities.internet} USD</li>
          <li>Advancements: ${utilities.advancements} USD</li>
      </ul>
      <p>Your share of the total amount (${totalAmount} USD) is <strong>${splitAmount} USD</strong>.</p>
      <p>Please review your billing details and make the necessary payment by the due date to avoid any late fees.</p>
      <p>If you have any questions or need further details, please do not hesitate to contact us.</p>
      <p>Best regards,</p>
      <p>The Management Team</p>
  `;

      notifyUser({
        userId: tenant._id,
        userEmail: tenant.email,
        subject: "New Billing Notification",
        message: emailMessage,
      });
    });

    res.status(201).send({ message: "Billing processed and notifications sent successfully", newBilling });
  } catch (error) {
    console.error("Error processing billing:", error);
    res.status(500).send({ message: "Error processing billing", error: error.message });
  }
});

// Register tenant for an apartment
app.patch("/users/:userId/register-tenant", async (req, res) => {
  const userId = req.params.userId;
  const { apartmentId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    user.role = "tenant";
    user.apartment = apartmentId;
    await user.save();

    res.status(200).send({ message: "User registered as a tenant successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error registering user as a tenant", error });
  }
});

// Add tenant to apartment
app.patch("/apartments/:apartmentId/add-tenant", async (req, res) => {
  try {
    const apartmentId = req.params.apartmentId;
    const tenantId = req.body.tenantId;

    const apartment = await Apartment.findById(apartmentId);

    if (!apartment) {
      return res.status(404).send({ message: "Apartment not found" });
    }

    if (!apartment.tenants.includes(tenantId)) {
      apartment.tenants.push(tenantId);
      await apartment.save();
    }

    res.status(200).send({ message: "Tenant added to the apartment successfully", apartment });
  } catch (error) {
    res.status(500).send({ message: "Error adding tenant to the apartment", error });
  }
});

// Add payment to billing record and update billing status
app.post("/payments/make-payment", async (req, res) => {
  try {
    const { tenantId, apartmentId, amountPaid, paymentType } = req.body;

    if (amountPaid <= 0) {
      return res.status(400).send({ message: "Invalid payment amount" });
    }

    // Fetch the latest unpaid billing for the given apartment
    const billing = await Billing.findOne({ apartment: apartmentId, status: { $ne: "paid" } }).sort({ dueDate: 1 });

    if (!billing) {
      return res.status(404).send({ message: "No unpaid billing found for the apartment" });
    }

    // Find the corresponding sub-bill for the tenant
    const subBillIndex = billing.subBills.findIndex((sub) => sub.tenant.toString() === tenantId);
    if (subBillIndex === -1) {
      return res.status(404).send({ message: "Sub-bill not found for the tenant" });
    }

    let subBill = billing.subBills[subBillIndex];
    let overpayment = 0;

    if (amountPaid > subBill.amount) {
      overpayment = amountPaid - subBill.amount;
      subBill.amount = 0;
      subBill.status = "paid";
    } else {
      subBill.amount -= amountPaid;
      subBill.status = subBill.amount <= 0 ? "paid" : "partial";
    }

    // Create and save the payment
    const newPayment = new Payment({
      tenant: tenantId,
      apartment: apartmentId,
      billing: billing._id,
      amount: amountPaid - overpayment,
      paymentDate: new Date(),
      paymentSource: "portal", // Indicate payment is made through the portal
    });
    await newPayment.save();

    // Update master bill
    billing.amountRemaining -= amountPaid - overpayment;
    billing.payments.push(newPayment._id);
    billing.status = billing.amountRemaining <= 0 ? "paid" : "partial";
    await billing.save();

    // Update tenant's user document
    const tenant = await User.findById(tenantId);
    if (tenant) {
      if (overpayment > 0) {
        tenant.accountBalance += overpayment;
      }
      tenant.payments.push(newPayment._id);
      await tenant.save();
    }

    res.status(200).send({ message: "Payment recorded and reconciled successfully", overpayment: overpayment });
  } catch (error) {
    console.error("Error recording payment:", error);
    res.status(500).send({ message: "Error recording payment", error: error.message });
  }
});

// Bidding engine endpoints
app.post("/bids", async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.body.apartment);

    if (!apartment) {
      return res.status(404).send({ message: "Apartment not found" });
    }

    if (apartment.bidAccepted) {
      return res.status(400).send({ message: "A bid has already been accepted for this apartment" });
    }

    const bid = new Bid(req.body);
    await bid.save();
    res.status(201).send(bid);
  } catch (error) {
    res.status(400).send({ message: "Error placing bid", error });
  }
});

app.get("/apartments/:apartmentId/bids", async (req, res) => {
  try {
    const bids = await Bid.find({ apartment: req.params.apartmentId }).populate("bidder");
    res.send(bids);
  } catch (error) {
    res.status(500).send({ message: "Error fetching bids", error });
  }
});

app.patch("/bids/:bidId/accept", async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.bidId);
    if (!bid) {
      return res.status(404).send({ message: "Bid not found" });
    }

    const apartment = await Apartment.findById(bid.apartment);
    if (apartment.bidAccepted) {
      return res.status(400).send({ message: "A bid has already been accepted for this apartment" });
    }

    bid.status = "accepted";
    await bid.save();

    apartment.bidAccepted = true;
    await apartment.save();

    res.send({ message: "Bid accepted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error accepting bid", error });
  }
});

app.patch("/bids/:bidId/reject", async (req, res) => {
  try {
    const bidId = req.params.bidId;
    const bid = await Bid.findById(bidId).populate("apartment");

    if (!bid) {
      return res.status(404).send({ message: "Bid not found" });
    }

    if (bid.status !== "pending") {
      return res.status(400).send({ message: "Bid cannot be rejected at this stage" });
    }

    bid.status = "rejected";
    await bid.save();

    res.send({ message: "Bid rejected successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error rejecting bid", error });
  }
});

app.get("/apartments/:apartmentId/bidhistory", async (req, res) => {
  try {
    const bids = await Bid.find({ apartment: req.params.apartmentId }).populate("bidder", "username").sort({ createdAt: -1 });
    res.send(bids);
  } catch (error) {
    res.status(500).send({ message: "Error fetching bid history", error });
  }
});

// POST /rent-apartment
app.post("/rent-apartment", async (req, res) => {
  const { apartmentId, tenantId } = req.body;

  try {
    // Retrieve the apartment and tenant from the database
    const apartment = await Apartment.findById(apartmentId);
    const tenant = await User.findById(tenantId);

    if (!apartment || !tenant) {
      return res.status(404).send({ message: "Apartment or Tenant not found" });
    }

    // Update apartment status and tenants list
    apartment.bidAccepted = true;
    apartment.tenants.push(tenantId);

    // Optionally, update the tenant's apartment history
    tenant.apartmentHistory.push({
      apartment: apartmentId,
      moveInDate: new Date(), // Assume move-in date is now
      // moveOutDate can be added upon moving out
    });

    // Save the updated documents
    await apartment.save();
    await tenant.save();

    res.status(200).send({ message: "Apartment rented successfully", apartment, tenant });
  } catch (error) {
    res.status(500).send({ message: "Error renting apartment", error });
  }
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "_id  username role apartment");
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: "Error fetching users", error });
  }
});

// User Login
app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(400).send({ message: "Invalid username or password" });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) {
      return res.status(400).send({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.send({ token, message: "Logged in successfully" });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).send({ message: "Error logging in", error });
  }
});

// Reconile payment with billing record

app.patch("/payments/reconcile/:billingId", async (req, res) => {
  const { billingId } = req.params;
  const { amountPaid, tenantId, paymentType } = req.body;

  try {
    const billing = await Billing.findById(billingId);
    if (!billing) {
      return res.status(404).send({ message: "Billing record not found" });
    }

    const tenant = await User.findById(tenantId);
    if (!tenant) {
      return res.status(404).send({ message: "Tenant not found" });
    }

    // Find the corresponding sub-bill for the tenant
    const subBillIndex = billing.subBills.findIndex((sub) => sub.tenant.toString() === tenantId);
    if (subBillIndex === -1) {
      return res.status(404).send({ message: "Tenant sub-bill not found" });
    }

    let subBill = billing.subBills[subBillIndex];
    let overpayment = 0;

    if (amountPaid > subBill.amount) {
      overpayment = amountPaid - subBill.amount;
      subBill.amount = 0;
      subBill.status = "paid";
      tenant.accountBalance += overpayment; // Credit overpayment to tenant's account balance
      await tenant.save();
    } else {
      subBill.amount -= amountPaid;
      subBill.status = subBill.amount === 0 ? "paid" : "partial";
    }

    // Adjust billing amount remaining and status
    billing.amountRemaining -= amountPaid;
    if (billing.amountRemaining <= 0) {
      billing.amountRemaining = 0;
      billing.status = "paid";
    }

    // Create and save the new payment record before linking it to the billing
    const newPayment = new Payment({
      tenant: tenantId,
      apartment: billing.apartment,
      billing: billing._id,
      amount: amountPaid,
      paymentType,
      paymentDate: new Date(),
      paymentSource: "reconsile", // Indicate payment is made through reconciliation
      status: billing.amountRemaining <= 0 ? "paid" : "partial",
    });
    await newPayment.save();

    // Now link the payment to the billing after it has been created
    billing.payments.push(newPayment._id);
    await billing.save();

    res.status(200).send({ message: "Payment reconciled successfully", billing, newPayment });
  } catch (error) {
    console.error("Error reconciling payment:", error);
    res.status(500).send({ message: "Error reconciling payment", error: error.message });
  }
});

// Function to send notifications to users
const notifyUser = async ({ userId, userEmail, subject, message }) => {
  // Send an email notification if userEmail is provided
  if (userEmail) {
    await sendEmail({
      to: userEmail,
      subject: subject,
      html: message,
    }).catch((error) => console.error("Error sending email:", error));
  }

  // Create an internal notification if userId is provided
  if (userId) {
    const newNotification = new Notification({
      userId,
      message: `${subject}: ${message}`,
      read: false,
    });

    await newNotification.save().catch((error) => console.error("Error saving notification:", error));
  }
};

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
          const message = `Dear ${tenant.name || "Tenant"},

  Your payment of ${subBill.amount} is overdue since ${billing.dueDate.toLocaleDateString()}. Please settle your bill promptly.

  Best regards,
  Apartment Rental Portal Team`;

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

checkAndUpdateOverduePayments(); // Run the function immediately to check for overdue payments

// Function to notify tenants via e-mail about a new bill
const notifyNewBill = async (userEmail, billDetails) => {
  await sendEmail({
    to: userEmail,
    subject: "New Bill Notification",
    text: `Dear Tenant, a new bill for ${billDetails.amount} is due on ${billDetails.dueDate}. Please login to your portal to view and pay your bill.`,
  });
};

// Endpoint to create a new notification
app.post("/notifications", async (req, res) => {
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
});

// Fetch unread notifications for a user
app.get("/notifications/:userId", async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId, read: false });
    res.json(notifications);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Mark a notification as read
app.patch("/notifications/:notificationId", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.notificationId, { read: true }, { new: true });
    res.json(notification);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
