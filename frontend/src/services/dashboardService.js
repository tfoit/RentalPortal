import api from "./api";

// Dashboard API calls
export const dashboardAPI = {
  // Get dashboard statistics
  getStatistics: () => api.get("/dashboard/statistics"),

  // Get recent apartments
  getRecentApartments: (limit = 5) => api.get("/dashboard/recent-apartments", { params: { limit } }),

  // Get recent contracts
  getRecentContracts: (limit = 5) => api.get("/dashboard/recent-contracts", { params: { limit } }),

  // Get upcoming payments
  getUpcomingPayments: (limit = 5) => api.get("/dashboard/upcoming-payments", { params: { limit } }),

  // Get maintenance requests
  getMaintenanceRequests: (limit = 5) => api.get("/dashboard/maintenance-requests", { params: { limit } }),
};

// Mock data for development
export const mockDashboardData = {
  statistics: {
    apartments: 24,
    tenants: 18,
    contracts: 15,
    payments: 42,
  },
  recentApartments: [
    { id: "apt1", name: "Luxury Studio", address: "123 Main St, Berlin", status: "available", price: 1200 },
    { id: "apt2", name: "Modern 2BR", address: "456 Oak Ave, Munich", status: "rented", price: 1800 },
    { id: "apt3", name: "Cozy 1BR", address: "789 Pine Rd, Hamburg", status: "available", price: 950 },
    { id: "apt4", name: "Penthouse Suite", address: "101 River Blvd, Frankfurt", status: "maintenance", price: 2500 },
  ],
  recentContracts: [
    { id: "con1", tenant: "John Doe", apartment: "Luxury Studio", startDate: "2023-01-15", endDate: "2024-01-14", status: "active" },
    { id: "con2", tenant: "Jane Smith", apartment: "Modern 2BR", startDate: "2023-02-01", endDate: "2024-01-31", status: "active" },
    { id: "con3", tenant: "Robert Johnson", apartment: "Downtown Loft", startDate: "2023-03-10", endDate: "2023-09-09", status: "expired" },
    { id: "con4", tenant: "Sarah Williams", apartment: "Garden Apartment", startDate: "2023-05-01", endDate: "2024-04-30", status: "pending" },
  ],
  upcomingPayments: [
    { id: "pay1", tenant: "John Doe", amount: 1200, dueDate: "2023-06-01", status: "pending" },
    { id: "pay2", tenant: "Jane Smith", amount: 1800, dueDate: "2023-06-05", status: "pending" },
    { id: "pay3", tenant: "Robert Johnson", amount: 1500, dueDate: "2023-06-10", status: "pending" },
    { id: "pay4", tenant: "Sarah Williams", amount: 1350, dueDate: "2023-06-15", status: "pending" },
  ],
  maintenanceRequests: [
    { id: "maint1", apartment: "Luxury Studio", issue: "Leaking faucet", priority: "medium", status: "pending", date: "2023-05-28" },
    { id: "maint2", apartment: "Modern 2BR", issue: "Heating not working", priority: "high", status: "in progress", date: "2023-05-26" },
    { id: "maint3", apartment: "Cozy 1BR", issue: "Broken window", priority: "high", status: "pending", date: "2023-05-29" },
    { id: "maint4", apartment: "Garden Apartment", issue: "Electrical issue", priority: "medium", status: "completed", date: "2023-05-25" },
  ],
};

// Function to get dashboard data (with fallback to mock data during development)
export const getDashboardData = async () => {
  try {
    // In a production environment, you would make actual API calls
    // const statistics = await dashboardAPI.getStatistics();
    // const recentApartments = await dashboardAPI.getRecentApartments();
    // const recentContracts = await dashboardAPI.getRecentContracts();
    // const upcomingPayments = await dashboardAPI.getUpcomingPayments();
    // const maintenanceRequests = await dashboardAPI.getMaintenanceRequests();

    // For development, return mock data
    return {
      statistics: mockDashboardData.statistics,
      recentApartments: mockDashboardData.recentApartments,
      recentContracts: mockDashboardData.recentContracts,
      upcomingPayments: mockDashboardData.upcomingPayments,
      maintenanceRequests: mockDashboardData.maintenanceRequests,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};

export default {
  dashboardAPI,
  getDashboardData,
  mockDashboardData,
};
