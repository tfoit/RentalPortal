const User = require("../models/User"); // User model for interacting with the users collection in the database
const logger = require("../config/winstonConfig"); // Logger instance for logging messages to the console and log files (if configured)
const ApartmentHistoryService = {
  /**
   * Adds a new apartment history record for a move-in operation.
   * @param {String} userId - The ID of the user (tenant) moving in.
   * @param {String} apartmentId - The ID of the apartment being moved into.
   * @param {Date} moveInDate - The date of moving in.
   */
  addMoveInRecord: async (userId, apartmentId, moveInDate = new Date()) => {
    const session = await User.startSession();
    session.startTransaction();
    try {
      await User.findByIdAndUpdate(userId, {
        $push: {
          apartmentHistory: {
            apartment: apartmentId,
            moveInDate: moveInDate,
            moveOutDate: null, // Explicitly setting this as null for clarity
          },
        },
      });

      logger.info("Move-in record added successfully.");
    } catch (error) {
      logger.error("Error adding move-in record:", error);
      throw error; // Rethrow or handle as needed
    }
    await session.commitTransaction();
    session.endSession();
  },

  /**
   * Updates an existing apartment history record with a move-out date.
   * @param {String} userId - The ID of the user (tenant) moving out.
   * @param {String} apartmentId - The ID of the apartment being moved out of.
   * @param {Date} moveOutDate - The date of moving out.
   */
  updateMoveOutRecord: async (userId, apartmentId, moveOutDate = new Date()) => {
    try {
      // Find the user and update the specific apartment history record
      const user = await User.findById(userId);
      const historyRecord = user.apartmentHistory.find((record) => record.apartment.toString() === apartmentId && !record.moveOutDate);

      if (historyRecord) {
        historyRecord.moveOutDate = moveOutDate;
        await user.save();
        logger.info("Move-out record updated successfully.");
      } else {
        logger.warn("No matching move-in record found for the specified user and apartment.");
      }
    } catch (error) {
      logger.error("Error updating move-out record:", error);
      throw error; // Rethrow or handle as needed
    }
  },
};

module.exports = ApartmentHistoryService;
