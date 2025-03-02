import api, { apartmentAPI } from "./api";
import enhancedLogger from "../utils/enhancedLogger";

// Mock apartment data for development
export const mockApartments = [
  { id: "apt1", name: "Luxury Studio", address: "123 Main St, Berlin", status: "available", price: 1200, bedrooms: 1, bathrooms: 1, area: 45, hasParking: true, hasBalcony: false, hasGarden: false, hasFurnished: true, description: "A beautiful luxury studio apartment in the heart of Berlin." },
  { id: "apt2", name: "Modern 2BR", address: "456 Oak Ave, Munich", status: "rented", price: 1800, bedrooms: 2, bathrooms: 1, area: 75, hasParking: true, hasBalcony: true, hasGarden: false, hasFurnished: false, description: "Spacious 2-bedroom apartment with modern amenities in Munich." },
  { id: "apt3", name: "Cozy 1BR", address: "789 Pine Rd, Hamburg", status: "available", price: 950, bedrooms: 1, bathrooms: 1, area: 50, hasParking: false, hasBalcony: true, hasGarden: false, hasFurnished: true, description: "Cozy and affordable 1-bedroom apartment in Hamburg." },
  { id: "apt4", name: "Penthouse Suite", address: "101 River Blvd, Frankfurt", status: "maintenance", price: 2500, bedrooms: 3, bathrooms: 2, area: 120, hasParking: true, hasBalcony: true, hasGarden: false, hasFurnished: true, description: "Luxurious penthouse with panoramic views of Frankfurt." },
  { id: "apt5", name: "Downtown Loft", address: "202 High St, Berlin", status: "available", price: 1650, bedrooms: 2, bathrooms: 1, area: 85, hasParking: false, hasBalcony: false, hasGarden: false, hasFurnished: true, description: "Stylish loft in Berlin's downtown district." },
  { id: "apt6", name: "Garden Apartment", address: "303 Park Lane, Munich", status: "rented", price: 1400, bedrooms: 1, bathrooms: 1, area: 65, hasParking: true, hasBalcony: false, hasGarden: true, hasFurnished: false, description: "Charming apartment with a private garden in Munich." },
  { id: "apt7", name: "Urban Studio", address: "404 City Center, Hamburg", status: "available", price: 1100, bedrooms: 1, bathrooms: 1, area: 40, hasParking: false, hasBalcony: true, hasGarden: false, hasFurnished: true, description: "Compact studio apartment in the heart of Hamburg." },
  { id: "apt8", name: "Family Home", address: "505 Suburb Rd, Frankfurt", status: "maintenance", price: 2200, bedrooms: 4, bathrooms: 2, area: 150, hasParking: true, hasBalcony: true, hasGarden: true, hasFurnished: false, description: "Spacious family home in a quiet Frankfurt suburb." },
];

// CRUD operations for apartments
export const apartmentService = {
  // Get all apartments with optional filtering
  getApartments: async (params = {}) => {
    try {
      enhancedLogger.info("Fetching apartments", { params });
      const response = await apartmentAPI.getAll(params);
      enhancedLogger.debug("Apartments fetched from API", { count: response.data.apartments ? response.data.apartments.length : 0 });
      return response.data.apartments || [];
    } catch (error) {
      enhancedLogger.error("Error fetching apartments", { error });
      throw error;
    }
  },

  // Get a single apartment by ID
  getApartmentById: async (id) => {
    try {
      enhancedLogger.info("Fetching apartment by ID", { id });
      const response = await apartmentAPI.getById(id);
      return response.data;
    } catch (error) {
      enhancedLogger.error("Error fetching apartment by ID", { id, error });
      throw error;
    }
  },

  // Create a new apartment
  createApartment: async (apartmentData) => {
    try {
      enhancedLogger.info("Creating new apartment", { data: apartmentData });
      const response = await apartmentAPI.create(apartmentData);
      return response.data;
    } catch (error) {
      enhancedLogger.error("Error creating apartment", { error });
      throw error;
    }
  },

  // Update an existing apartment
  updateApartment: async (id, apartmentData) => {
    try {
      enhancedLogger.info("Updating apartment", { id, data: apartmentData });
      const response = await apartmentAPI.update(id, apartmentData);
      return response.data;
    } catch (error) {
      enhancedLogger.error("Error updating apartment", { id, error });
      throw error;
    }
  },

  // Delete an apartment
  deleteApartment: async (id) => {
    try {
      enhancedLogger.info("Deleting apartment", { id });
      await apartmentAPI.delete(id);
      return { success: true };
    } catch (error) {
      enhancedLogger.error("Error deleting apartment", { id, error });
      throw error;
    }
  },
};

export default apartmentService;
