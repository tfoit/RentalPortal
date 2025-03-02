// This is the fileController.js, located in the folder path: /src/controllers/fileController.js

const mongoose = require("mongoose");
const logger = require("../config/winstonConfig");
const FileMetadata = require("../models/FileMetadata");
const { uploadFileToGridFS } = require("../services/gridfsService");
const { createAndSaveMetadata } = require("../services/metadataService");
const { log } = require("winston");
const { createStructParentTreeNextKey } = require("pdfkit");
let gfs;

exports.downloadFileById = (req, res) => {
  const gfs = req.app.get("gfs"); // Corrected to use "gfs" instead of "gridFsConnection"
  const { id } = req.params; // Assuming the file ID is passed as a URL parameter

  if (!gfs) {
    return res.status(500).send({ message: "GridFS not initialized" });
  }

  // Convert the string ID to a MongoDB ObjectId
  const objectId = new mongoose.Types.ObjectId(id);

  gfs.find({ _id: objectId }).toArray((err, files) => {
    if (err || !files || files.length === 0) {
      return res.status(404).send({ message: "No file exists with that id." });
    }

    console.log("File found:", files[0]);

    const file = files[0];
    res.type(file.contentType);
    res.setHeader("Content-Disposition", 'attachment; filename="' + file.filename + '"');

    const downloadStream = gfs.openDownloadStream(objectId);
    downloadStream.pipe(res);
  });
};

// Existing imports...

exports.uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "No file uploaded." });
  }

  try {
    // Upload file to GridFS first
    const uploadResult = await uploadFileToGridFS(req, req.file);

    // Extract the user ID from the authenticated user
    const userId = req.user._id;

    console.log(uploadResult); // Add this line to debug
    // Use the centralized function to create and save metadata

    const fileMetadata = await createAndSaveMetadata(uploadResult, userId);

    // Respond with success and metadata details
    res.status(201).send({
      message: "File successfully uploaded to GridFS and metadata stored.",
      fileDetails: uploadResult, // or manually construct this object if needed
      fileMetadata: fileMetadata,
    });
  } catch (error) {
    logger.error("Error processing file upload or updating metadata:", error);
    res.status(500).send({ message: "Error processing file upload or updating metadata", error: error.message });
  }
};

// Main controller function to handle the request
exports.getFileAndMetadata = async (req, res) => {
  try {
    const fileId = req.params.fileId; // Assuming the fileId is passed as a URL parameter

    // Add validation for fileId
    if (!fileId || fileId === "null" || fileId === "undefined") {
      return res.status(400).send({
        message: "Invalid file ID",
        error: "A valid file ID is required",
      });
    }

    const metadata = await getFileMetadata(fileId); // Retrieve metadata using _id
    if (!metadata) {
      return res.status(404).send({ message: "File metadata not found" });
    }
    const fileBuffer = await getFileFromGridFS(req, metadata.gridFsFileId); // Use gridFsFileId from metadata

    res.type(metadata.contentType);
    res.send(fileBuffer);
  } catch (error) {
    console.error("Error serving file:", error);
    res.status(500).send({ message: "Error serving file", error: error.message });
  }
};

async function getFileMetadata(fileId) {
  try {
    // Add additional validation
    if (!fileId || fileId === "null" || fileId === "undefined") {
      throw new Error("Invalid file ID provided");
    }

    const metadata = await FileMetadata.findById(fileId); // Use _id to query metadata
    return metadata;
  } catch (error) {
    console.error("Error fetching file metadata:", error);
    throw error;
  }
}

// Adjusted to take req as an argument
async function getFileFromGridFS(req, gridFsFileId) {
  const gfs = req.app.get("gfs"); // Ensure gfs is initialized
  if (!gfs) {
    console.error("GridFS is not initialized");
    throw new Error("GridFS is not initialized");
  }

  return new Promise((resolve, reject) => {
    let data = [];
    const readstream = gfs.openDownloadStream(gridFsFileId); // Use gridFsFileId to open the stream

    readstream.on("data", (chunk) => {
      data.push(chunk);
    });

    readstream.on("error", (err) => {
      console.error("Error reading file from GridFS:", err);
      reject(err);
    });

    readstream.on("end", () => {
      resolve(Buffer.concat(data)); // Return the file as a buffer
    });
  });
}
