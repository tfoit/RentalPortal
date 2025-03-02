const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config({ path: ".env.development" });

function authenticateToken(req, res, next) {
  // Usually, the token is sent in the Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN_HERE

  if (token == null) {
    return res.status(401).send({ message: "No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send({ message: "Token is invalid or expired." });
    }

    req.user = user; // Add the decoded user payload to the request
    req.body = { ...req.body, passedWithNext: true }; // Add a property to req.body

    next(); // Proceed to the next middleware
  });
}

module.exports = { authenticateToken };
