require("dotenv").config({ path: ".env.development" });
const { GridFSBucket } = require("mongodb");
const stream = require("stream");

/**
 * Uploads a file to MongoDB GridFS storage.
 *
 * @param {Object} file - The file object from Multer, containing the buffer and originalname.
 * @param {Object} req - The Express request object, used to access app settings and user info.
 * @returns {Promise<Object>} A promise that resolves with the file upload details.
 */
// Refactored uploadFileToGridFS function to use async/await and promises

async function uploadFileToGridFS(req, file) {
  // Get the GridFS bucket from the app settings
  const bucket = req.app.get("gfs");

  const bucketName = req.app.get("gfsBucketName");

  console.log("Bucket Name:", bucketName);
  if (!bucket) {
    throw new Error("GridFS bucket is unavailable.");
  }

  return new Promise((resolve, reject) => {
    const fileName = file.originalname;
    const contentType = file.mimetype;
    const buckerName = bucketName;

    // Creating a readable stream from the file buffer
    const readStream = new stream.Readable({
      read() {
        this.push(file.buffer);
        this.push(null); // Indicates the end of the stream
      },
    });

    // Create an upload stream to write the file to GridFS
    const uploadStream = bucket.openUploadStream(fileName, {
      contentType: contentType, // Add the content type to the file's metadata
      metadata: {
        uploadedAt: new Date(),
        uploaderId: req.user._id, // Assumes req.user is populated by authentication middleware
      },
    });

    readStream
      .pipe(uploadStream)
      .on("error", (error) => {
        console.error(`Error uploading ${fileName}:`, error);
        reject(error);
      })
      .on("finish", () => {
        console.log(`Successfully uploaded ${fileName} to GridFS in the '${bucketName}' bucket.`);
        resolve({
          fileId: uploadStream.id,
          fileName: fileName,
          size: file.size,
          bucketName: bucketName,
          contentType: contentType, // Add the content type to the response
          metadata: uploadStream.options.metadata,
        });
      });
  });
}

module.exports = { uploadFileToGridFS };
