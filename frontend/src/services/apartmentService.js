import { API_URL } from "./config";
import { getAuthHeader } from "./authService";

// Get all apartments
export const getApartments = async () => {
  try {
    const response = await fetch(`${API_URL}/apartments/get-all-apartments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch apartments");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching apartments:", error);
    throw error;
  }
};

// Get apartment by ID
export const getApartmentById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/apartments/get-apartment/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch apartment");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching apartment:", error);
    throw error;
  }
};

// Create new apartment
export const createApartment = async (apartmentData) => {
  try {
    const response = await fetch(`${API_URL}/apartments/create-apartment`, {
      method: "POST",
      headers: {
        ...getAuthHeader(),
      },
      body: apartmentData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create apartment");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating apartment:", error);
    throw error;
  }
};

// Update apartment
export const updateApartment = async (id, apartmentData) => {
  try {
    const response = await fetch(`${API_URL}/apartments/update-apartment/${id}`, {
      method: "PUT",
      headers: {
        ...getAuthHeader(),
      },
      body: apartmentData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update apartment");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating apartment:", error);
    throw error;
  }
};

// Update apartment media
export const updateApartmentMedia = async (id, mediaData) => {
  try {
    const response = await fetch(`${API_URL}/apartments/update-apartment-media/${id}`, {
      method: "POST",
      headers: {
        ...getAuthHeader(),
      },
      body: mediaData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update apartment media");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating apartment media:", error);
    throw error;
  }
};

// Delete apartment
export const deleteApartment = async (id) => {
  try {
    const response = await fetch(`${API_URL}/apartments/delete-apartment/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete apartment");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting apartment:", error);
    throw error;
  }
};

// Rent apartment
export const rentApartment = async (apartmentId, tenantData) => {
  try {
    const response = await fetch(`${API_URL}/apartments/rent-apartment/${apartmentId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(tenantData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to rent apartment");
    }

    return await response.json();
  } catch (error) {
    console.error("Error renting apartment:", error);
    throw error;
  }
};
