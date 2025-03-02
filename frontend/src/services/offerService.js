import axios from "axios";
import { API_URL } from "./config";

// Submit a new offer (bid or fixed-price)
export const submitOffer = async (offerData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await axios.post(`${API_URL}/api/offers`, offerData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    const errorData = error.response?.data || {};
    throw new Error(errorData.message || "Failed to submit offer");
  }
};

// Get offers for a specific apartment (for owners)
export const getApartmentOffers = async (apartmentId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await axios.get(`${API_URL}/api/offers/apartment/${apartmentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    const errorData = error.response?.data || {};
    throw new Error(errorData.message || "Failed to fetch apartment offers");
  }
};

// Get offers made by the current user (for tenants)
export const getUserOffers = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await axios.get(`${API_URL}/api/offers/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    const errorData = error.response?.data || {};
    throw new Error(errorData.message || "Failed to fetch your offers");
  }
};

// Update an offer status (accept/reject)
export const updateOfferStatus = async (offerId, status) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await axios.put(
      `${API_URL}/api/offers/${offerId}`,
      { status },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    const errorData = error.response?.data || {};
    throw new Error(errorData.message || "Failed to update offer status");
  }
};

// Get a specific offer by ID
export const getOfferById = async (offerId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await axios.get(`${API_URL}/api/offers/${offerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    const errorData = error.response?.data || {};
    throw new Error(errorData.message || "Failed to fetch offer details");
  }
};
