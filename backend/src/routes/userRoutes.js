const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { registerValidation, loginValidation, validate } = require("../middleware/validationMiddleware");

// Specific routes first
router.post("/register", registerValidation, validate, userController.registerUser);
router.post("/login", loginValidation, validate, userController.loginUser);
router.get("/me", authenticateToken, userController.getCurrentUser);
router.put("/profile", authenticateToken, userController.updateUserProfile);
router.put("/privacy", authenticateToken, userController.updatePrivacySettings);
router.put("/complete-profile", authenticateToken, userController.completeUserProfile);
router.get("/", userController.getAllUsers);

// Parameterized routes last (these should come after all specific routes)
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

// Define other user-related routes here...

module.exports = router;
