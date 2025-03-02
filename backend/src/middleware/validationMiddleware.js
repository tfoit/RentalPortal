// This validationMiddleware.js file contains the validation rules for the register and login routes. It also contains a middleware to handle validation errors.

const { body, validationResult } = require("express-validator");

exports.registerValidation = [
  body("username").isLength({ min: 5 }).withMessage("Username must be at least 5 characters long"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  body("email").isEmail().withMessage("Email must be valid"),
  // Add more validation rules as needed
];

exports.loginValidation = [
  body("username").notEmpty().withMessage("Username must not be empty"),
  body("password").notEmpty().withMessage("Password must not be empty"),
  // Add more validation rules as needed
];

// Middleware to handle validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  registerValidation: exports.registerValidation,
  loginValidation: exports.loginValidation,
  validate: validate,
};
