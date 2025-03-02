// This is server.js located in the fodler path: /server.js

require("dotenv").config({ path: ".env.development" });
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const morgan = require("morgan");
const logger = require("./src/config/winstonConfig");

// Import routes
const userRoutes = require("./src/routes/userRoutes");
const apartmentRoutes = require("./src/routes/apartmentRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");
const contractRoutes = require("./src/routes/contractRoutes");
const fileRoutes = require("./src/routes/fileRoutes");
const upload = require("./src/middleware/multerMiddleware");

const app = express();

// Body parser middleware
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Morgan setup for logging HTTP requests
app.use(morgan("combined", { stream: { write: (message) => logger.info(message.trim()) } }));

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:8080", // e.g., "https://yourdomain.com"
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

function connectToMainDB() {
  mongoose
    .connect(process.env.MAIN_MONGODB_URI || "mongodb://seeyaa:1seeyaa64258spie@192.168.2.12:27117/RentalDB?authSource=admin", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => logger.info("Connected to the Main MongoDB"))
    .catch((err) => logger.error("Could not connect to the Main MongoDB: " + err.message));
}

// Function to connect to the GridFS database
function connectToGridFS() {
  const gridFsConnection = mongoose.createConnection(process.env.GRIDFS_MONGODB_URI || "mongodb://seeyaa:1seeyaa64258spie@192.168.2.12:27117/RentalDB_files?authSource=admin", { useNewUrlParser: true, useUnifiedTopology: true });
  const bucketName = process.env.GRIDFS_BUCKET_NAME || "uploads";

  gridFsConnection.once("open", () => {
    const gfs = new mongoose.mongo.GridFSBucket(gridFsConnection.db, { bucketName: process.env.GRIDFS_BUCKET_NAME || "uploads" });
    logger.info("Connected to the GridFS MongoDB");

    // Storing GridFS connection and the gfs instance in Express app for global access
    app.set("gridFsConnection", gridFsConnection);
    app.set("gfs", gfs);
    app.set("gfsBucketName", bucketName);

    console.log("GridFS Connection Status:", gridFsConnection.readyState === 1 ? "Connected" : "Disconnected");
  });

  gridFsConnection.on("error", (err) => logger.error("Could not connect to the GridFS MongoDB: " + err.message));
}

// Initialize database connections
function initializeDBConnections() {
  connectToMainDB();
  connectToGridFS();
}

// Calling the function to initialize all database connections
initializeDBConnections();

// Debugging middleware to log incoming requests and verify connections
app.use((req, res, next) => {
  //console.log("Incoming Request:", req.method, req.path, req.app);
  //console.log("GridFS Connection Status:", gfs ? "Connected" : "Disconnected");
  next();
});

// Setup routes
app.use("/users", userRoutes);
app.use("/apartments", apartmentRoutes);
app.use("/notifications", notificationRoutes);
app.use("/contracts", contractRoutes);
app.use("/files", fileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
