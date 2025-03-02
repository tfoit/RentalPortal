import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Grid, TextField, Paper, Typography, MenuItem, FormControl, FormHelperText, Divider, InputAdornment, Alert } from "@mui/material";
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { PageLayout } from "../components/layout";
import { createApartment, getApartmentById, updateApartment } from "../services/apartmentService";

const initialValues = {
  title: "",
  description: "",
  bedrooms: 1,
  bathrooms: 1,
  size: 0,
  rent: 0,
  status: "available",
  location: "",
  amenities: [],
  media: { images: [] },
};

const statusOptions = [
  { value: "available", label: "Available" },
  { value: "rented", label: "Rented" },
  { value: "maintenance", label: "Under Maintenance" },
  { value: "unavailable", label: "Unavailable" },
];

const ApartmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = Boolean(id);

  // Fetch apartment data if in edit mode
  useEffect(() => {
    const fetchApartment = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          const data = await getApartmentById(id);
          setFormData(data);
          setFormError(null);
        } catch (error) {
          console.error("Error fetching apartment details:", error);
          setFormError("Failed to load apartment details. Please try again later.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchApartment();
  }, [id, isEditMode]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  // Handle numeric inputs
  const handleNumericChange = (e) => {
    const { name, value } = e.target;

    // Convert to number or use 0 if empty
    const numValue = value === "" ? 0 : Number(value);

    setFormData({
      ...formData,
      [name]: numValue,
    });

    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  // Handle amenities list
  const handleAmenitiesChange = (e) => {
    const amenitiesText = e.target.value;
    const amenitiesArray = amenitiesText
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    setFormData({
      ...formData,
      amenities: amenitiesArray,
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (formData.rent < 0) {
      newErrors.rent = "Rent must be a positive number";
    }

    if (formData.size < 0) {
      newErrors.size = "Size must be a positive number";
    }

    if (formData.bedrooms < 0 || formData.bedrooms > 10) {
      newErrors.bedrooms = "Bedrooms must be between 0 and 10";
    }

    if (formData.bathrooms < 0 || formData.bathrooms > 10) {
      newErrors.bathrooms = "Bathrooms must be between 0 and 10";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      if (isEditMode) {
        await updateApartment(id, formData);
      } else {
        await createApartment(formData);
      }

      // Navigate back to apartments list
      navigate("/apartments");
    } catch (error) {
      console.error("Error saving apartment:", error);
      setFormError("Failed to save apartment. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate("/apartments");
  };

  // Page actions
  const pageActions = (
    <Box className="flex space-x-2">
      <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleCancel}>
        Cancel
      </Button>
      <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save"}
      </Button>
    </Box>
  );

  return (
    <PageLayout title={isEditMode ? "Edit Apartment" : "Create New Apartment"} subtitle={isEditMode ? `Editing: ${formData.title}` : "Enter apartment details"} actions={pageActions} loading={loading} error={formError} variant="narrow">
      <Paper elevation={1} className="p-6">
        {formError && (
          <Alert severity="error" className="mb-4">
            {formError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" className="font-semibold mb-2">
                Basic Information
              </Typography>
              <Divider className="mb-4" />

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField fullWidth label="Title" name="title" value={formData.title} onChange={handleChange} error={Boolean(errors.title)} helperText={errors.title} required />
                </Grid>

                <Grid item xs={12}>
                  <TextField fullWidth label="Location" name="location" value={formData.location} onChange={handleChange} error={Boolean(errors.location)} helperText={errors.location} required />
                </Grid>

                <Grid item xs={12}>
                  <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleChange} multiline rows={4} />
                </Grid>
              </Grid>
            </Grid>

            {/* Details */}
            <Grid item xs={12}>
              <Typography variant="h6" className="font-semibold mb-2">
                Property Details
              </Typography>
              <Divider className="mb-4" />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Bedrooms" name="bedrooms" type="number" value={formData.bedrooms} onChange={handleNumericChange} error={Boolean(errors.bedrooms)} helperText={errors.bedrooms} InputProps={{ inputProps: { min: 0, max: 10 } }} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Bathrooms" name="bathrooms" type="number" value={formData.bathrooms} onChange={handleNumericChange} error={Boolean(errors.bathrooms)} helperText={errors.bathrooms} InputProps={{ inputProps: { min: 0, max: 10 } }} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Size (sq ft)" name="size" type="number" value={formData.size} onChange={handleNumericChange} error={Boolean(errors.size)} helperText={errors.size} InputProps={{ inputProps: { min: 0 } }} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Monthly Rent"
                    name="rent"
                    type="number"
                    value={formData.rent}
                    onChange={handleNumericChange}
                    error={Boolean(errors.rent)}
                    helperText={errors.rent}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      inputProps: { min: 0 },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField fullWidth select label="Status" name="status" value={formData.status} onChange={handleChange}>
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Grid>

            {/* Features */}
            <Grid item xs={12}>
              <Typography variant="h6" className="font-semibold mb-2">
                Amenities
              </Typography>
              <Divider className="mb-4" />

              <TextField fullWidth label="Amenities (comma separated)" name="amenities" value={formData.amenities.join(", ")} onChange={handleAmenitiesChange} helperText="Enter amenities separated by commas (e.g. Parking, Dishwasher, Pool)" />
            </Grid>

            {/* Submit buttons - for mobile view */}
            <Grid item xs={12} className="md:hidden">
              <Box className="flex flex-col space-y-2">
                <Button variant="contained" color="primary" fullWidth startIcon={<SaveIcon />} onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Apartment"}
                </Button>
                <Button variant="outlined" fullWidth onClick={handleCancel}>
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </PageLayout>
  );
};

export default ApartmentForm;
