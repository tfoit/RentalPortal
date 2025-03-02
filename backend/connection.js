const mongoose = require("mongoose");
const connectionString = "mongodb://seeyaa:1seeyaa64258spie@localhost:27017/RentalDB?replicaSet=rs0"; // Update as needed

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: "admin", // Or the relevant database if not 'admin'
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Connection error: ", err));
