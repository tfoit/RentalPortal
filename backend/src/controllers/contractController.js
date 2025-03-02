// Importing required modules and services
const { createNewContract, updateContractWithNewVersion, getContractById } = require("../services/contractService");
const { generatePDFfile } = require("../services/pdfGenerator"); // Adjust the path as necessary
const { processBillingByContract } = require("../services/billingService"); // Assuming billingService is a separate module
const { uploadPDFtoGridFS } = require("../services/gridfsService"); // Assuming gridfsService is a separate module
const logger = require("../config/winstonConfig");
const Apartment = require("../models/Apartment");
const User = require("../models/User");
const Contract = require("../models/Contract");
const path = require("path");
const fs = require("fs");
const rimraf = require("rimraf");
const util = require("util");
const jsPDF = require("jspdf");
const { HTMLToPDF } = require("jspdf-autotable");
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const ejs = require("ejs"); // Assuming EJS for template rendering
const billingService = require("../services/billingService"); // Assuming billingService is a separate module

const rimrafAsync = util.promisify(rimraf);

// Controller to create a new contract
// Assuming generatePDFContract is properly imported at the top with other imports

exports.createNewContract = async (req, res) => {
  try {
    // Extract contract data from request body
    const { apartmentId, versions, language, ...otherContractData } = req.body;

    // Find the apartment and populate owner information
    const apartment = await Apartment.findById(apartmentId).populate("owner", "firstName lastName");
    if (!apartment) {
      logger.error("Apartment not found");
      return res.status(404).json({ message: "Apartment not found" });
    }

    // Prepare the initial contract version data
    const initialVersion = versions && versions.length > 0 ? versions[0] : {};
    initialVersion.versionNumber = 1;
    initialVersion.minorVersion = 0;

    if (!req.user || !req.user._id) {
      logger.error("User information not available for contract creation.");
      return res.status(403).json({ message: "Unauthorized: User information is required to create a contract." });
    }

    const contractData = {
      ...otherContractData,
      apartmentId,
      versions: [initialVersion],
      currentVersion: "1.00",
      changelog: [
        {
          changedBy: req.user._id,
          changeDate: new Date(),
          changeDescription: "Initial contract created.",
        },
      ],
    };

    // Create the contract object with the initial version and other provided data
    const contractToSave = new Contract(contractData);

    // Save the new contract to the database
    const savedContract = await contractToSave.save();

    // Add the new contract to the apartment's contracts array and save the updated apartment
    apartment.contracts.push(savedContract._id);

    // Update the currentContract field to the newly created contract's ID
    apartment.currentContract = savedContract._id;

    await apartment.save();
    console.log(savedContract);
    // Render the contract HTML with the provided data
    // Note: You may need to adjust this logic based on how your templates are structured
    // and how data is passed to them. This is a conceptual step.
    //const renderedHTML = await renderTemplateWithData(language, contractData);

    // Generate PDF from the rendered HTML and get the path to the saved PDF
    //const pdfPath = await generatePDFfile(renderedHTML, language);
    //console.log("req.user", req);

    // Assuming you have a utility function `uploadPDFtoGridFS`
    //const uploadResult = await uploadPDFtoGridFS(pdfPath, req);

    // Respond with success, saved contract data, and path to the generated PDF
    return res.status(201).json({
      success: true,
      data: savedContract,

      //pdfPath: pdfPath, // Optionally return the path or a URL to access the PDF
    });
  } catch (error) {
    logger.error("Error creating contract: " + error.message);
    return res.status(500).json({ message: "Failed to create contract", error: error.message });
  }
};

// Utility function to render HTML template with data
// Implement this function based on your template engine or string replacement logic
async function renderTemplateWithData(language, contractData) {
  // Define the path to the EJS template
  const templatePath = path.join(__dirname, `../contractTemplates/${language}/rentalAgreement.html`);

  // Read the EJS template file
  let template = await fs.promises.readFile(templatePath, "utf8");

  // Use EJS to render the template with the provided data
  // EJS automatically handles the interpolation of variables in the template
  const renderedHTML = ejs.render(template, contractData);

  // Log the rendered HTML for debugging
  console.log("Rendered HTML:", renderedHTML);

  return renderedHTML;
}

// Controller to perform a major update on a contract
exports.updateContract = async (req, res) => {
  const { contractId } = req.params;
  const updateData = req.body; // Expecting major update data

  try {
    const contract = await Contract.findById(contractId);
    if (!contract) {
      logger.error("Contract not found");
      return res.status(404).json({ message: "Contract not found" });
    }
    logger.info("Contract found");

    const latestVersion = contract.versions[contract.versions.length - 1];

    // Generate a dynamic change description based on differences between updateData and the latest version
    let changeDescription = "Major update applied. Changes: ";
    const changes = [];
    for (const [key, value] of Object.entries(updateData)) {
      if (latestVersion[key] !== value) {
        const oldValue = latestVersion[key] ? latestVersion[key].toString() : "N/A";
        changes.push(`${key} updated from ${oldValue} to ${value}`);
      }
    }
    changeDescription += changes.join("; ");

    const newVersion = {
      ...latestVersion.toObject(),
      _id: mongoose.Types.ObjectId(),
      versionNumber: latestVersion.versionNumber + 1,
      minorVersion: 0,
      appendices: [],
      changelog: [
        ...latestVersion.changelog, // Copy the existing changelog entries
        {
          changedBy: req.user._id, // Assuming you have user information in the request
          changeDate: new Date(),
          changeDescription, // Use the dynamically generated change description
        },
      ],
    };

    // Apply major update changes to the new version
    Object.assign(newVersion, updateData);

    // Add the new version to the versions array
    contract.versions.push(newVersion);

    // Update currentVersion to reflect this major update
    contract.currentVersion = `${newVersion.versionNumber}.00`;

    // Save the updated contract
    await contract.save();

    // Respond with the updated contract information
    return res.status(200).json({
      success: true,
      message: "Contract updated with major version change",
      data: contract,
    });
  } catch (error) {
    logger.error("Error updating contract with major change: " + error.message);
    return res.status(500).json({ message: "Failed to update contract with major change", error: error.message });
  }
};

// Controller to apply a minor update to a contract via an appendix
// Controller to apply a minor update to a contract and update the changelog
exports.applyMinorUpdateWithAppendix = async (req, res) => {
  const { contractId } = req.params;
  const { appendixData } = req.body; // Assuming appendixData includes utility changes

  try {
    const contract = await Contract.findById(contractId);
    if (!contract) {
      logger.error("Contract not found");
      return res.status(404).json({ message: "Contract not found" });
    }

    if (contract.versions.length === 0) {
      throw new Error("No versions found in contract to update");
    }

    const latestVersion = contract.versions[contract.versions.length - 1];

    // Prepare a record of previous utilities before applying updates
    const previousUtilities = { ...latestVersion.utilities };

    // Check if appendixData includes changes to utilities and apply them
    if (appendixData.changes && appendixData.type === "utilityUpdate") {
      Object.keys(appendixData.changes).forEach((changeKey) => {
        if (!latestVersion.utilities) {
          latestVersion.utilities = {}; // Initialize utilities if not present
        }
        // Apply the update to the utilities
        latestVersion.utilities[changeKey] = appendixData.changes[changeKey];
      });
    }

    // Create a description of the changes for the changelog
    const changeDescriptions = Object.keys(appendixData.changes)
      .map((changeKey) => `${changeKey} updated from ${previousUtilities[changeKey] || "N/A"} to ${appendixData.changes[changeKey]}`)
      .join("; ");

    // Append the new appendix
    latestVersion.appendices.push({
      ...appendixData,
      _id: mongoose.Types.ObjectId(), // Ensure a unique ID for the new appendix
    });

    // Increment the minor version
    latestVersion.minorVersion += 1;

    // Update the changelog to include detailed change descriptions
    latestVersion.changelog.push({
      changedBy: req.user._id, // Assuming you have user information in the request
      changeDate: new Date(),
      changeDescription: `Minor update applied: ${appendixData.title}. Changes: ${changeDescriptions}`,
    });

    // Update currentVersion to reflect this minor update
    contract.currentVersion = `${latestVersion.versionNumber}.${latestVersion.minorVersion.toString().padStart(2, "0")}`;

    await contract.save();

    return res.status(200).json({
      success: true,
      message: "Minor update applied successfully to contract, utilities updated, changelog updated",
      data: contract,
    });
  } catch (error) {
    logger.error("Error applying minor update with appendix: " + error.message);
    return res.status(500).json({ message: "Failed to apply minor update with appendix", error: error.message });
  }
};

// Controller to process billing based on a contract
exports.processBillingByContract = async (req, res) => {
  const { contractId } = req.params; // Now using contractId passed as a URL parameter
  const { billingPeriod, dueDate } = req.body; // Extract billing data from the request body

  try {
    // Fetch the specified contract, assuming it's active
    const contract = await Contract.findById(contractId)
      .populate("versions.tenants.tenantId") // Adjust populate to match your schema
      .exec();

    if (!contract || !contract.active) {
      return res.status(404).send({ message: "Active contract not found" });
    }

    // Determine the latest version of the contract
    const latestVersion = contract.versions.reduce((latest, version) => (version.versionNumber > latest.versionNumber || (version.versionNumber === latest.versionNumber && version.minorVersion > latest.minorVersion) ? version : latest), contract.versions[0]);

    // Check for any relevant amendments or appendices that affect billing
    // Implement logic as needed based on your contract structure

    // Call the billing service to process billing with the latest contract details
    // Ensure your billing service is adapted to process billing based on a contract's details
    await billingService.processBillingByContract(contractId, billingPeriod, dueDate, latestVersion);

    res.status(201).send({ message: "Billing processed successfully for the contract" });
  } catch (error) {
    console.error("Error processing billing by contract:", error);
    res.status(500).send({ message: "Error processing billing for the contract", error: error.message });
  }
};

// Example: Fetch a specific version with file
exports.getContractVersion = async (req, res) => {
  const { contractId, versionNumber } = req.params;

  const contract = await Contract.findOne({ _id: contractId, "versions.versionNumber": versionNumber });

  if (contract) {
    const targetVersion = contract.versions.find((v) => v.versionNumber === versionNumber);
    if (targetVersion.contractFile) {
      const readstream = app.locals.gfs.createReadStream({ _id: targetVersion.contractFile.fileId });
      res.set("Content-Type", "application/pdf");
      readstream.pipe(res);
    } else {
      // Handle the case where this version does not have a file.
    }
  } else {
    res.status(404).send("Not found");
  }
};
