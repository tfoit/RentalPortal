require("dotenv").config({ path: ".env.development" });
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const crypto = require("crypto");
const logger = require("../config/winstonConfig"); // Ensure you have a logger setup, like Winston
const jwt = require("jsonwebtoken");
const { decode } = require("punycode");

const storage = new GridFsStorage({
  url: process.env.GRIDFS_MONGODB_URI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },

  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          logger.error("Error generating file name:", err);
          reject(err);
          return;
        }
        const filename = buf.toString("hex") + "-" + file.originalname;
        // Example metadata
        const metadata = {
          uploaderId: req.user ? req.user._id : "anonymous", // Example: Include uploader's user ID as metadata
          // Any other metadata you want to include
        };

        const fileInfo = {
          filename,
          bucketName: process.env.GRIDFS_BUCKET_NAME || "uploads",
          metadata, // Attach metadata here
        };
        resolve(fileInfo);
      });
    });
  },
});

storage.on("connection", (db) => {
  logger.info("Successfully connected to MongoDB for GridFS storage.");
});

storage.on("connectionFailed", (err) => {
  logger.error("Connection to MongoDB failed for GridFS storage:", err.message);
});

const upload = multer({ storage });

module.exports = upload;
