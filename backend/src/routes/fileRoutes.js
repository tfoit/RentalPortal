const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadFiles");
const fileController = require("../controllers/fileController");
const { authenticateToken } = require("../middleware/authMiddleware");
const logRequest = require("../middleware/logRequest");

router.post("/upload", authenticateToken, upload.single("file"), fileController.uploadFile);

// Download a file by its ID
router.get("/download/:id", fileController.downloadFileById);

router.get("/:fileId", fileController.getFileAndMetadata);

module.exports = router;
