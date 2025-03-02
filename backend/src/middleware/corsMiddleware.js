require("dotenv").config({ path: ".env.development" });.config();
const allowedOrigins = [process.env.FRONTEND_URL]; // You can add more origins as needed

/**
 * Middleware function for handling CORS (Cross-Origin Resource Sharing).
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const corsMiddleware = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    res.setHeader("Access-Control-Allow-Credentials", true);
  }

  // If the request is an OPTIONS request, end it after setting headers
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
};

module.exports = corsMiddleware;
