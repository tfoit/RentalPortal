const mongoose = require("mongoose");

const fileMetadataSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  contentType: { type: String, required: true },
  size: { type: Number, required: true },
  uploaderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User model for the uploader of the file (assuming a User model exists)
  gridFsFileId: { type: mongoose.Schema.Types.ObjectId, required: true },
  uploadDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FileMetadata", fileMetadataSchema);
