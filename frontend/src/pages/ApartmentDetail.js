import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, Typography, Grid, Paper, Divider, Chip } from "@mui/material";
import { LocationOn as LocationIcon, Apartment as ApartmentIcon, AttachMoney as MoneyIcon, CalendarToday as CalendarIcon, Edit as EditIcon } from "@mui/icons-material";
import { getApartmentById } from "../services/apartmentService";
import { getFileUrl } from "../services/fileService";
import { useAuth } from "../contexts/AuthContext";
import { PageLayout } from "../components/layout";
import { Badge } from "../components/ui";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`apartment-tabpanel-${index}`} aria-labelledby={`apartment-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ApartmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [offerSubmitted, setOfferSubmitted] = useState(false);
  const { user: currentUser, isAdmin, isOwner } = useAuth();

  // Determine if user can edit this apartment
  const canEdit = isAdmin || (isOwner && apartment?.ownerId === currentUser?.id);

  useEffect(() => {
    const fetchApartment = async () => {
      try {
        setLoading(true);
        const data = await getApartmentById(id);
        setApartment(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching apartment details:", error);
        setError("Failed to load apartment details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchApartment();
    }
  }, [id]);

  // Get status badge variant
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "success";
      case "rented":
        return "primary";
      case "maintenance":
        return "warning";
      case "unavailable":
        return "error";
      default:
        return "gray";
    }
  };

  // Format price with currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Handle edit apartment
  const handleEdit = () => {
    navigate(`/apartments/edit/${id}`);
  };

  // Handle delete apartment
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this apartment?")) {
      try {
        // Call delete API
        // await deleteApartment(id);

        // Navigate back to list
        navigate("/apartments");
      } catch (error) {
        console.error("Error deleting apartment:", error);
      }
    }
  };

  // Handle apply for apartment
  const handleApply = () => {
    // Implement application logic
    console.log("Apply for apartment:", id);
  };

  // Page actions
  const pageActions = canEdit ? (
    <Box className="flex space-x-2">
      <Button variant="outlined" onClick={handleEdit} startIcon={<EditIcon />}>
        Edit
      </Button>
      <Button variant="outlined" color="error" onClick={handleDelete}>
        Delete
      </Button>
    </Box>
  ) : currentUser ? (
    <Button variant="contained" color="primary" onClick={handleApply}>
      Apply Now
    </Button>
  ) : null;

  // Get images for the apartment
  const images = apartment?.media?.images || [];
  const hasImages = images.length > 0;

  return (
    <PageLayout title={apartment?.title || "Apartment Details"} subtitle={apartment?.location} actions={pageActions} loading={loading} error={error}>
      {apartment && (
        <Paper elevation={1} className="overflow-hidden">
          {/* Apartment Images */}
          <Box className="relative h-80 bg-gray-200">
            {hasImages ? <img src={getFileUrl(images[0])} alt={apartment.title || "Apartment"} className="w-full h-full object-cover" /> : <Box className="flex items-center justify-center h-full bg-gray-100 text-gray-400">No Image Available</Box>}
            <Box className="absolute top-4 right-4">
              <Chip label={apartment.status || "Unknown"} color={getStatusVariant(apartment.status)} size="small" />
            </Box>
          </Box>

          {/* Apartment Details */}
          <Box className="p-6">
            <Box className="flex flex-wrap justify-between items-start mb-6">
              <Box>
                <Typography variant="h5" className="font-bold text-gray-900 mb-2">
                  {apartment.title || "Unnamed Apartment"}
                </Typography>
                <Typography variant="body1" className="text-gray-600 mb-2 flex items-center">
                  <LocationIcon fontSize="small" className="mr-1" />
                  {apartment.location || "No address provided"}
                </Typography>
              </Box>
              <Typography variant="h5" className="font-bold text-primary-600">
                {formatPrice(apartment.rent || 0)}/mo
              </Typography>
            </Box>

            <Grid container spacing={3} className="mb-6">
              <Grid item xs={12} sm={4}>
                <Paper className="p-4 bg-gray-50">
                  <Typography variant="subtitle2" className="text-gray-700 mb-1">
                    Size
                  </Typography>
                  <Typography variant="body1" className="font-medium">
                    {apartment.size || 0} sq ft
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper className="p-4 bg-gray-50">
                  <Typography variant="subtitle2" className="text-gray-700 mb-1">
                    Bedrooms
                  </Typography>
                  <Typography variant="body1" className="font-medium">
                    {apartment.bedrooms || 0}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper className="p-4 bg-gray-50">
                  <Typography variant="subtitle2" className="text-gray-700 mb-1">
                    Bathrooms
                  </Typography>
                  <Typography variant="body1" className="font-medium">
                    {apartment.bathrooms || 0}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Box className="mb-6">
              <Typography variant="h6" className="font-semibold text-gray-900 mb-3">
                Description
              </Typography>
              <Typography variant="body1" className="text-gray-700 whitespace-pre-line">
                {apartment.description || "No description provided."}
              </Typography>
            </Box>

            {apartment.amenities && apartment.amenities.length > 0 && (
              <Box className="mb-6">
                <Typography variant="h6" className="font-semibold text-gray-900 mb-3">
                  Amenities
                </Typography>
                <Box className="flex flex-wrap gap-2">
                  {apartment.amenities.map((amenity, index) => (
                    <Chip key={index} label={amenity} size="small" />
                  ))}
                </Box>
              </Box>
            )}

            {/* Contact Information */}
            <Paper className="p-4 bg-primary-50 border border-primary-100">
              <Typography variant="h6" className="font-semibold text-primary-900 mb-3">
                Contact Information
              </Typography>
              <Typography variant="body1" className="text-primary-800 mb-2">
                <span className="font-semibold">Owner:</span> {apartment.ownerName || "Not specified"}
              </Typography>
              <Typography variant="body1" className="text-primary-800 mb-2">
                <span className="font-semibold">Email:</span> {apartment.ownerEmail || "Not specified"}
              </Typography>
              <Typography variant="body1" className="text-primary-800">
                <span className="font-semibold">Phone:</span> {apartment.ownerPhone || "Not specified"}
              </Typography>
            </Paper>
          </Box>
        </Paper>
      )}
    </PageLayout>
  );
};

export default ApartmentDetail;
