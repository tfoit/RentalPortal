import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Button } from "../ui";
import { useAuth } from "../../contexts/AuthContext";
import { getApartments } from "../../services/apartmentService";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalApartments: 0,
    availableApartments: 0,
    rentedApartments: 0,
    maintenanceApartments: 0,
  });
  const [recentApartments, setRecentApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser, isAdmin, isOwner } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const apartments = await getApartments();

        // Calculate stats
        const available = apartments.filter((apt) => apt.status === "available").length;
        const rented = apartments.filter((apt) => apt.status === "rented").length;
        const maintenance = apartments.filter((apt) => apt.status === "maintenance").length;

        setStats({
          totalApartments: apartments.length,
          availableApartments: available,
          rentedApartments: rented,
          maintenanceApartments: maintenance,
        });

        // Get 3 most recent apartments
        const sorted = [...apartments].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        setRecentApartments(sorted.slice(0, 3));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format price with currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Apartments</h3>
            <p className="text-3xl font-bold text-primary-600">{stats.totalApartments}</p>
          </div>
        </Card>

        <Card className="bg-white">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Available</h3>
            <p className="text-3xl font-bold text-green-600">{stats.availableApartments}</p>
          </div>
        </Card>

        <Card className="bg-white">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Rented</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.rentedApartments}</p>
          </div>
        </Card>

        <Card className="bg-white">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Maintenance</h3>
            <p className="text-3xl font-bold text-amber-600">{stats.maintenanceApartments}</p>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      {(isAdmin || isOwner) && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button as={Link} to="/apartments/new" variant="primary" className="w-full justify-center">
              Add New Apartment
            </Button>

            <Button as={Link} to="/apartments" variant="outline" className="w-full justify-center">
              Manage Apartments
            </Button>

            {isAdmin && (
              <Button as={Link} to="/users" variant="outline" className="w-full justify-center">
                Manage Users
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Recent Apartments */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Apartments</h2>
          <Button as={Link} to="/apartments" variant="ghost" className="text-primary-600">
            View All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentApartments.length > 0 ? (
            recentApartments.map((apartment) => (
              <Card key={apartment._id} className="h-full flex flex-col" hoverable>
                <div className="relative h-48 mb-4 overflow-hidden rounded-lg bg-gray-200">
                  {apartment.imageUrl ? <img src={apartment.imageUrl} alt={apartment.name || "Apartment"} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">No Image Available</div>}
                </div>

                <div className="p-4 flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{apartment.name || "Unnamed Apartment"}</h3>
                  <p className="text-gray-500 text-sm mb-2">{apartment.address || "No address provided"}</p>
                  <p className="text-primary-600 font-bold mb-2">{formatPrice(apartment.rent || 0)}/mo</p>
                  <p className="text-gray-700 line-clamp-2">{apartment.description || "No description provided."}</p>
                </div>

                <div className="p-4 pt-0 mt-auto">
                  <Button as={Link} to={`/apartments/${apartment._id}`} variant="outline" className="w-full justify-center">
                    View Details
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-gray-500">No apartments found. Add your first apartment to get started.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
