// src/services/metadataService.js
const mongoose = require("mongoose");
const FileMetadata = require("../models/FileMetadata");
const logger = require("../config/winstonConfig");

/**
 * Creates and saves file metadata in the database.
 * @param {Object} fileDetails - Details of the file uploaded to GridFS.
 * @param {mongoose.Types.ObjectId} userId - The user ID of the uploader.
 * @returns {Promise<FileMetadata>} - The saved file metadata document.
 */
async function createAndSaveMetadata(fileDetails, userId) {
  try {
    const newFileMetadata = new FileMetadata({
      fileName: fileDetails.fileName,
      contentType: fileDetails.contentType,
      size: fileDetails.size,
      uploaderId: mongoose.Types.ObjectId(userId),
      gridFsFileId: mongoose.Types.ObjectId(fileDetails.fileId),
    });

    // Save the new metadata document to the database
    const fileMetadata = await newFileMetadata.save();
    return fileMetadata;
  } catch (error) {
    logger.error("Error creating or saving file metadata:", error);
    throw error; // Rethrow the error to handle it in the calling context
  }
}

module.exports = { createAndSaveMetadata };
