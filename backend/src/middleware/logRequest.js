function logRequest(req, res, next) {
  console.log("Starting logging middleware:");
  console.log("Request Body:", req.body);
  console.log("Files:", req.files); // For multiple files or non-specified single file
  console.log("File:", req.file); // For single file upload with .single()

  // Continue to the next middleware
  next();
}

module.exports = logRequest;
