const multer = require("multer");

// Define the FileUploadError class
class FileUploadError extends Error {
  constructor(message) {
    super(message);
    this.name = "FileUploadError";
    this.status = 400; // Bad Request
  }
}

const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    "image/jpeg": true,
    "image/png": true,
    "image/gif": true,
    "application/pdf": true,
    "video/mp4": true,
    "video/quicktime": true,
    "text/plain": true,
  };

  if (file.mimetype in allowedTypes) {
    cb(null, true); // Accept file
  } else {
    // Provides a more specific error message
    cb(new FileUploadError("Unsupported file type. Allowed types are JPEG, PNG, GIF, PDF, MP4, QuickTime, and TXT."), false);
  }
};

// Configure multer disk storage
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: (req, file, cb) => {
      // Dynamically set file size limits based on the file type
      if (["video/mp4", "video/quicktime"].includes(file.mimetype)) {
        cb(null, 100 * 1024 * 1024); // Allow up to 200MB for videos
      } else {
        cb(null, 25 * 1024 * 1024); // Default 100MB limit for other types
      }
    },
  },
  // Custom error handling
  onError: (err, next) => {
    console.log(err);
    next(err);
  },
});

module.exports = upload;
