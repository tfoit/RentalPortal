const Apartment = require("../models/Apartment");
const User = require("../models/User");
const Contract = require("../models/Contract");
const FileMetadata = require("../models/FileMetadata");
const multer = require("multer");
const mongoose = require("mongoose");
const { processBillingByContract } = require("../services/billingService");
const { uploadFileToGridFS } = require("../services/gridfsService");
const { updateContractWithNewVersion } = require("../services/contractService");
const { updateUserRole } = require("../services/updateUserRoleService");
const ApartmentHistoryService = require("../services/tenantApartmentHistoryService");
const { createAndSaveMetadata } = require("../services/metadataService");
const logger = require("../config/winstonConfig");

exports.createApartment = async (req, res) => {
  try {
    // Log the request body to debug issues
    console.log("Request body:", req.body);

    // Validate owner
    const ownerExists = await User.exists({ _id: req.user._id });
    if (!ownerExists) {
      return res.status(404).send({ message: "Owner not found" });
    }

    // Ensure req.body is not undefined or null
    if (!req.body) {
      return res.status(400).send({ message: "Request body is missing" });
    }

    // Create apartment without media
    let apartmentData = { ...req.body, owner: req.user._id, creationDate: new Date(), media: { images: [], pdfBlueprints: [], videos: [] } };
    const savedApartment = await new Apartment(apartmentData).save();

    // Log the request files to debug issues
    console.log("Request files:", req.files);

    // Process media uploads if files exist
    const { mediaUploads, allFileMetadata } = await processMediaUploads(req);

    // Individual checks for each media type
    if (!mediaUploads.images || mediaUploads.images.length === 0) {
      logger.info("No images were uploaded for apartment:", savedApartment._id);
    }
    if (!mediaUploads.pdfBlueprints || mediaUploads.pdfBlueprints.length === 0) {
      logger.info("No PDF blueprints were uploaded for apartment:", savedApartment._id);
    }
    if (!mediaUploads.videos || mediaUploads.videos.length === 0) {
      logger.info("No videos were uploaded for apartment:", savedApartment._id);
    }

    // Update the apartment with media references
    const updatedApartment = await updateApartmentMedia(savedApartment._id, mediaUploads);

    // Update user role upon successful apartment creation
    const roleUpdateResult = await updateUserRole(req.user._id, "owner");
    if (!roleUpdateResult.success) {
      logger.error("Failed to update user role:", roleUpdateResult.message);
    }

    // Use fileMetadata as needed, for example, in your response:
    res.status(201).send({
      apartment: updatedApartment,
      fileMetadata: allFileMetadata,
      message: "Apartment created successfully",
    });
  } catch (error) {
    logger.error("Error creating apartment:", error);
    res.status(500).send({ message: "Error creating apartment", error: error.message || error });
  }
};

async function processMediaUploads(req) {
  const files = req.files;

  // Log the request files to debug issues
  console.log("Files in processMediaUploads:", files);

  // Ensure files is not undefined or null
  if (!files) {
    return { mediaUploads: {}, allFileMetadata: [] };
  }

  const mediaTypes = Object.keys(files); // ['images', 'pdfBlueprints', 'videos']
  let mediaUploads = {};
  let allFileMetadata = [];

  await Promise.all(
    mediaTypes.map(async (type) => {
      const uploads = await processFiles(files[type], req);
      // Correctly extract fileId from the uploadResult object
      mediaUploads[type] = uploads.map((upload) => upload.uploadResult.fileId);
      // Accumulate metadata for all files
      allFileMetadata = allFileMetadata.concat(uploads.map((upload) => upload.fileMetadata));
    })
  );

  return { mediaUploads, allFileMetadata };
}

async function processFiles(fileArray, req) {
  const userId = req.user._id; // Extract the user ID from the request

  // Create a function that handles the upload and metadata creation for a single file
  const uploadAndCreateMetadata = async (file) => {
    try {
      // Attempt to upload the file using the GridFS function
      const uploadResult = await uploadFileToGridFS(req, file);

      // Assuming uploadResult contains necessary details for metadata creation
      // Create and save metadata for the uploaded file
      const fileMetadata = await createAndSaveMetadata(uploadResult, userId);

      console.log("UploadResult:", uploadResult); // Check the structure
      console.log("FileMetadata:", fileMetadata); // Check the structure
      // Return both upload details and metadata
      return { uploadResult, fileMetadata };
    } catch (error) {
      console.error(`Failed to upload ${file.originalname}:`, error);
      // Return an error object for this file to handle it appropriately
      return { error: true, message: `Failed to upload ${file.originalname}`, errorDetails: error };
    }
  };

  // Map each file to a promise that handles both upload and metadata creation
  const uploadAndMetadataPromises = fileArray.map(uploadAndCreateMetadata);

  // Wait for all promises to resolve
  const results = await Promise.all(uploadAndMetadataPromises);

  // Optionally, filter out or handle results that encountered errors
  const successfulResults = results.filter((result) => !result.error);
  console.log("Successful results:", successfulResults);
  return successfulResults;
}

async function updateApartmentMedia(apartmentId, mediaUploads) {
  return Apartment.findByIdAndUpdate(
    apartmentId,
    {
      $set: {
        "media.images": mediaUploads.images || [],
        "media.pdfBlueprints": mediaUploads.pdfBlueprints || [],
        "media.videos": mediaUploads.videos || [],
      },
    },
    { new: true }
  );
}

exports.updateApartment = async (req, res) => {
  try {
    const apartment = await Apartment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!apartment) {
      return res.status(404).send({ message: "Apartment not found" });
    }

    res.send({ apartment, message: "Apartment updated successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error updating apartment", error });
  }
};

exports.rentApartment = async (req, res) => {
  const session = await Apartment.startSession();
  session.startTransaction();
  try {
    // Validate tenant
    const tenantExists = await User.exists({ _id: req.body.tenantId });
    if (!tenantExists) {
      return res.status(404).send({ message: "Tenant not found" });
    }

    // Validate apartment availability and status
    const apartment = await Apartment.findById(req.body.apartmentId);
    if (!apartment) {
      logger.warn("Apartment not found");
      return res.status(404).send({ message: "Apartment not found" });
    }
    if (apartment.status !== "available") {
      logger.warn("Apartment not found or not available");
      return res.status(404).send({ message: "Apartment not available" });
    }

    // Update apartment status to rented, start date, end date, and tenant details
    apartment.status = "rented";
    apartment.tenant = req.body.tenantId; // Assuming you have a tenant field in your Apartment model
    apartment.rentStartDate = new Date(); // Assuming you want to track when the apartment was rented
    apartment.rentEndDate = req.body.rentEndDate; // Assuming you want to track when the apartment will be rented until
    apartment.tenants.push(req.body.tenantId); // Assuming you have a tenants array in your Apartment model
    const updatedApartment = await apartment.save();

    // Update user role to tenant, if not already
    if (req.body.tenantId.role !== "tenant") {
      const roleUpdateResult = await updateUserRole(req.body.tenantId, "tenant");
      if (!roleUpdateResult.success) {
        logger.error("Failed to update user role:", roleUpdateResult.message);
      }
    }

    // Update aparmtent history for the tenant
    await ApartmentHistoryService.addMoveInRecord(req.body.tenantId, apartment._id);

    // Finalize the transaction and send response
    await session.commitTransaction();
    session.endSession();

    // Send response
    res.status(200).send({
      apartment: updatedApartment,
      message: "Apartment rented successfully",
    });
  } catch (error) {
    logger.error("Error renting apartment:", error);
    res.status(500).send({ message: "Error renting apartment", error });
  }
};

exports.terminateApartment = async (req, res) => {
  const session = await User.startSession();
  try {
    session.startTransaction();

    const tenantId = mongoose.Types.ObjectId(req.body.tenantId);
    const apartmentId = req.body.apartmentId;

    // Fetch the user and validate
    const user = await User.findById(tenantId).session(session);
    if (!user || !user.apartmentHistory) {
      throw new Error("User not found or apartment history missing");
    }

    // Fetch the apartment and validate
    const apartment = await Apartment.findById(apartmentId).session(session);
    if (!apartment) {
      throw new Error("Apartment not found");
    }
    if (apartment.status !== "rented") {
      throw new Error("Apartment not rented");
    }

    // Remove the tenant from the apartment
    apartment.tenants.pull(tenantId); // This removes the specific tenantId from the tenants array

    // If no tenants remain, update the apartment status
    if (apartment.tenants.length === 0) {
      apartment.status = "available";
      apartment.rentStartDate = null;
      apartment.rentEndDate = null;
    }

    // Update the tenant's move-out date in their history
    const historyEntry = user.apartmentHistory.find((entry) => entry.apartment.toString() === apartmentId && !entry.moveOutDate);
    if (historyEntry) {
      historyEntry.moveOutDate = new Date();
    } else {
      throw new Error("Appropriate apartment history entry not found");
    }

    await user.save({ session });
    await apartment.save({ session });

    await session.commitTransaction();
    res.status(200).send({ message: "Tenancy terminated successfully for the specified tenant." });
  } catch (error) {
    await session.abortTransaction();
    logger.error(`Error terminating tenancy: ${error}`);
    res.status(500).send({ message: "Error terminating tenancy", error: error.toString() });
  } finally {
    session.endSession();
  }
};

exports.getAllApartments = async (req, res) => {
  try {
    const apartments = await Apartment.find();
    res.send(apartments);
  } catch (error) {
    res.status(500).send({ message: "Error getting apartments", error });
  }
};

exports.deleteApartment = async (req, res) => {
  try {
    const apartment = await Apartment.findByIdAndDelete(req.params.id);
    if (!apartment) {
      return res.status(404).send({ message: "Apartment not found" });
    }

    res.send({ message: "Apartment deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error deleting apartment", error });
  }
};

exports.getApartment = async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);
    if (!apartment) {
      return res.status(404).send({ message: "Apartment not found" });
    }

    res.send(apartment);
  } catch (error) {
    res.status(500).send({ message: "Error getting apartment", error });
  }
};

exports.updateTenants = async (req, res) => {
  const { apartmentId } = req.params;
  const { newTenantId, replacingTenantId } = req.body;

  try {
    const apartment = await Apartment.findById(apartmentId);
    if (!apartment) {
      return res.status(404).json({ message: "Apartment not found." });
    }

    // Verify the new tenant exists in your system
    const newTenant = await User.findById(newTenantId); // Assuming User model for tenants
    if (!newTenant) {
      return res.status(404).json({ message: "New tenant not found." });
    }

    // Check if the new tenant is already associated with this apartment
    const newTenantIsAlreadyInApartment = apartment.tenants.some((tenant) => tenant.toString() === newTenantId);
    if (newTenantIsAlreadyInApartment) {
      return res.status(400).json({ message: "New tenant is already in the apartment." });
    }

    // Update the apartment model with the new tenant
    // This logic might vary depending on whether you're adding or replacing a tenant
    if (replacingTenantId) {
      const index = apartment.tenants.findIndex((t) => t === replacingTenantId);
      if (index !== -1) apartment.tenants[index] = newTenantId;
      else return res.status(404).json({ message: "Tenant to replace not found." });
    } else {
      apartment.tenants.push(newTenantId); // Simply add the new tenant
    }

    await apartment.save();

    res.status(200).json({ message: "Tenant updated successfully and contract version incremented." });
  } catch (error) {
    console.error("Error updating tenants:", error);
    res.status(500).json({ message: "Error updating tenants", error: error.message });
  }
};
