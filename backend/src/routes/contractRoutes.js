// This is the contractRoutes.js file located in src/routes/contractRoutes.js:
const { authenticateToken } = require("../middleware/authMiddleware");
const express = require("express");
const contractController = require("../controllers/contractController");
const router = express.Router();

router.post("/new-contract", authenticateToken, contractController.createNewContract);
router.put("/:contractId", authenticateToken, contractController.updateContract);
//router.get("/:contractId", contractController.getContract);
//router.post("/:contractId/appendix", contractController.addAppendix);
router.put("/:contractId/appendix", authenticateToken, contractController.applyMinorUpdateWithAppendix);

router.post("/:contractId/billing", contractController.processBillingByContract);

// Get contract by ID
router.get("/:contractId", contractController.getContractVersion);

module.exports = router;
