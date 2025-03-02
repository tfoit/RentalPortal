require("dotenv").config({ path: ".env.development" });
const winston = require("winston");

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "warn" : "debug",
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    // File transport
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

module.exports = logger;
