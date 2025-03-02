import { FILE_API_URL } from "./config";
import { getAuthHeader } from "./authService";

// Upload a file
export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${FILE_API_URL}/upload`, {
      method: "POST",
      headers: {
        ...getAuthHeader(),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to upload file");
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

// Get file by ID
export const getFileById = async (id) => {
  try {
    // Validate ID parameter
    if (!id) {
      throw new Error("Invalid file ID: ID cannot be null or undefined");
    }

    const response = await fetch(`${FILE_API_URL}/${id}`, {
      method: "GET",
      headers: {
        ...getAuthHeader(),
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch file");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching file:", error);
    throw error;
  }
};

// Get file URL
export const getFileUrl = (id) => {
  // Validate ID parameter
  if (!id) {
    console.error("Invalid file ID: ID cannot be null or undefined");
    return null; // or return a default/placeholder URL
  }

  return `${FILE_API_URL}/${id}`;
};
