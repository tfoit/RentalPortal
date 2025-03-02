// updateUserRoleService.js
const User = require("../models/User"); // Adjust the path as necessary

async function updateUserRole(userId, newRole) {
  // Validate the new role
  const validRoles = ["admin", "tenant", "owner", "manager", "agency", "not renting", "regular", "new"];
  if (!validRoles.includes(newRole)) {
    return { success: false, message: "Invalid role." };
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, message: "User not found." };
    }

    user.role = newRole;
    await user.save();

    return { success: true, message: "User role updated successfully." };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { success: false, message: "Error updating user role." };
  }
}

module.exports = { updateUserRole };
