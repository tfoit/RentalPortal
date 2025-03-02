const Contract = require("../models/Contract"); // Assuming this is the path to your Contract model

// Function to create a new contract
async function createNewContract(contractData) {
  // Implementation for creating a new contract
  const contract = new Contract(contractData);
  await contract.save();
  return contract;
}

// Function to update a contract with a new version
async function updateContractWithNewVersion(contractId, updateData) {
  const contract = await Contract.findById(contractId);
  if (!contract) {
    throw new Error("Contract not found");
  }
  // Increment the currentVersion number
  const newVersionNumber = contract.currentVersion + 1;
  // Create a new version object with the updateData
  const newVersion = {
    ...updateData,
    versionNumber: newVersionNumber, // Make sure this matches your schema requirements
    startDate: new Date(), // Set the start date for the new version (customize as needed)
  };
  // Add the new version to the versions array
  contract.versions.push(newVersion);
  // Update the currentVersion to reflect the new version
  contract.currentVersion = newVersionNumber;
  // Save the updated contract
  await contract.save();
  return contract;
}

// Function to get a contract by its ID
async function getContractById(contractId) {
  // Implementation for fetching a contract by ID
  const contract = await Contract.findById(contractId);
  if (!contract) {
    throw new Error("Contract not found");
  }
  return contract;
}

module.exports = {
  createNewContract,
  updateContractWithNewVersion,
  getContractById,
};
