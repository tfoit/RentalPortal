const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { registerValidation, loginValidation, validate } = require("../middleware/validationMiddleware");

router.post("/register", registerValidation, validate, userController.registerUser);
router.put("/complete-profile", authenticateToken, userController.completeUserProfile);
router.post("/login", loginValidation, validate, userController.loginUser);
router.delete("/:id", userController.deleteUser);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);

// Define other user-related routes here...

module.exports = router;
