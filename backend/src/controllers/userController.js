const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const logger = require("../config/winstonConfig");

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    logger.info("Registering user with data:", { username, email });

    const existingUser = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });

    if (existingUser) {
      logger.info("Attempt to register an already existing user", { username });
      return res.status(400).send({ message: "User already exists" });
    } else if (existingEmail) {
      logger.info("Attempt to register an already existing email", { email });
      return res.status(400).send({ message: "Email already exists" });
    }

    let user = new User({
      username,
      email,
      password,
      role: "new",
      status: "new",
    });

    logger.info("User object before saving:", { user });

    user = await user.save();

    logger.info("User registered successfully", { username });
    res.status(201).send({ user, message: "User registered successfully" });
  } catch (error) {
    logger.error("Error registering user", { error: error.message });
    res.status(500).send({ message: "Error registering user", error });
  }
};

// Complete User Profile
exports.completeUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updates = req.body;

    // Ensure the user's status is updated to pending_verification
    updates.status = "pending_verification";

    // Log the update attempt
    logger.info("Completing user profile", { userId, updates });

    // Update the user's profile
    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    // Log the successful update
    logger.info("User profile completed successfully", { username: updatedUser.username });

    // Send the response
    res.status(200).send({ user: updatedUser, message: "Profile updated successfully" });
  } catch (error) {
    // Log the error
    logger.error("Error updating user profile", { error: error.message });

    // Send the error response
    res.status(500).send({ message: "Error updating user profile", error });
  }
};

// Get a user information by ID

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send({ user, message: "User retrieved successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error getting user", error });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error deleting user", error });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users, message: "Users retrieved successfully" });
  } catch (error) {
    console.error("Error getting users:", error); // Log the error for server-side debugging
    const errorMessage = process.env.NODE_ENV === "production" ? "Internal Server Error" : error.message;
    // Send a generic error message in production to avoid exposing details
    res.status(500).json({ message: "Error getting users", error: errorMessage });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send({ user, message: "User updated successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error updating user", error });
  }
};

// Login user and generate token
// Login user and generate token
exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      logger.warn("Invalid login attempt - user not found", { username: req.body.username });
      return res.status(400).send({ message: "Invalid username or password" });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      logger.warn("Invalid login attempt - incorrect password", { username: req.body.username });
      return res.status(400).send({ message: "Invalid username or password" });
    }

    // Generate a token and send it in the response
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Log the successful login attempt
    logger.info("User logged in successfully", { username: req.body.username });

    res.send({ token, userId: user._id, message: "Logged in successfully" });
  } catch (error) {
    logger.error("Error during login", { username: req.body.username, error: error.message });
    res.status(500).send({ message: "Error logging in" });
  }
};

// Add other user-related controller functions here...
