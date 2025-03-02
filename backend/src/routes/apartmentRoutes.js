const express = require("express");
const router = express.Router();
const apartmentController = require("../controllers/apartmentController");
const upload = require("../middleware/uploadFiles");
const { authenticateToken } = require("../middleware/authMiddleware");

// Use this middleware before your Multer middleware
//router.post("/create-apartment", logRequest, upload.single("file"), logRequest, apartmentController.createApartment);

router.post(
  "/create-apartment",
  authenticateToken,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "pdfBlueprints", maxCount: 1 },
    { name: "videos", maxCount: 1 },
  ]),
  apartmentController.createApartment
);

router.get("/get-apartment/:id", apartmentController.getApartment);
// Route to get all apartments
router.get("/get-all-apartments", apartmentController.getAllApartments);
// Route to update an apartment
router.put("/update-apartment/:id", authenticateToken, apartmentController.updateApartment);
// Route to delete an apartment
router.delete("/delete-apartment/:id", authenticateToken, apartmentController.deleteApartment);

// New route to get apartment media
router.get("/get-apartment-media/:id/:mediaType", apartmentController.getApartmentMedia);

// Define other user-related routes here...

// Route to rent an apartment
router.post("/rent-apartment", authenticateToken, apartmentController.rentApartment);

// Route to move out of an apartment
router.post("/terminate-tenancy", authenticateToken, apartmentController.terminateApartment);

// Route to update tenants in an apartment
router.post("/update-tenants/:apartmentId", authenticateToken, apartmentController.updateTenants);

module.exports = router;
