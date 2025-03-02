import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Button as MuiButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { ApartmentList as ApartmentListComponent } from "../components/apartments";
import { Button } from "../components/ui";
import { PageLayout } from "../components/layout";
import { getApartments } from "../services/apartmentService";
import { useAuth } from "../contexts/AuthContext";

const ApartmentListPage = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user: currentUser, isAdmin, isOwner } = useAuth();

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        setLoading(true);
        const data = await getApartments();
        setApartments(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching apartments:", error);
        setError("Failed to load apartments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, []);

  // Handle edit apartment
  const handleEdit = (apartment) => {
    // Navigate to edit page or open edit modal
    console.log("Edit apartment:", apartment);
  };

  // Handle delete apartment
  const handleDelete = async (apartmentId) => {
    if (window.confirm("Are you sure you want to delete this apartment?")) {
      try {
        // Call delete API
        // await deleteApartment(apartmentId);

        // Update state
        setApartments(apartments.filter((apt) => apt._id !== apartmentId));
      } catch (error) {
        console.error("Error deleting apartment:", error);
      }
    }
  };

  // Page actions
  const pageActions =
    currentUser && (isAdmin || isOwner) ? (
      <MuiButton component={Link} to="/apartments/new" variant="contained" color="primary" startIcon={<AddIcon />} size="medium">
        Add Apartment
      </MuiButton>
    ) : null;

  return (
    <PageLayout title="Apartment Listings" subtitle="Browse our available apartments" actions={pageActions} loading={loading} error={error}>
      <Box className="bg-white rounded-lg shadow-sm p-4">
        <ApartmentListComponent apartments={apartments} onEdit={isAdmin || isOwner ? handleEdit : undefined} onDelete={isAdmin || isOwner ? handleDelete : undefined} isAdmin={isAdmin} isOwner={isOwner} isLoading={loading} className="mb-8" />
      </Box>
    </PageLayout>
  );
};

export default ApartmentListPage;
