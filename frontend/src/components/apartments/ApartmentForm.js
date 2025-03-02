import React, { useState, useEffect } from "react";
import { Input, Select, Checkbox, Button, Alert } from "../ui";

/**
 * ApartmentForm component for creating and editing apartments
 *
 * @param {Object} props - Component props
 * @param {Object} props.initialData - Initial apartment data for editing
 * @param {Function} props.onSubmit - Function to call when form is submitted
 * @param {boolean} props.isLoading - Whether the form is in a loading state
 * @param {string} props.error - Error message to display
 * @param {string} props.className - Additional CSS classes
 */
const ApartmentForm = ({ initialData = {}, onSubmit, isLoading = false, error = null, className = "" }) => {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    rent: "",
    size: "",
    bedrooms: "",
    bathrooms: "",
    status: "available",
    isFurnished: false,
    amenities: [],
    imageUrl: "",
    ...initialData,
  });

  // Form validation state
  const [errors, setErrors] = useState({});

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData]);

  // Status options
  const statusOptions = [
    { value: "available", label: "Available" },
    { value: "rented", label: "Rented" },
    { value: "maintenance", label: "Maintenance" },
    { value: "unavailable", label: "Unavailable" },
  ];

  // Common amenities
  const commonAmenities = ["Air Conditioning", "Heating", "Washer/Dryer", "Dishwasher", "Parking", "Gym", "Pool", "Elevator", "Security System", "Balcony", "Pet Friendly"];

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Handle amenity toggle
  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => {
      const currentAmenities = prev.amenities || [];

      if (currentAmenities.includes(amenity)) {
        return {
          ...prev,
          amenities: currentAmenities.filter((a) => a !== amenity),
        };
      } else {
        return {
          ...prev,
          amenities: [...currentAmenities, amenity],
        };
      }
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.address?.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.rent) {
      newErrors.rent = "Rent is required";
    } else if (isNaN(formData.rent) || Number(formData.rent) <= 0) {
      newErrors.rent = "Rent must be a positive number";
    }

    if (!formData.size) {
      newErrors.size = "Size is required";
    } else if (isNaN(formData.size) || Number(formData.size) <= 0) {
      newErrors.size = "Size must be a positive number";
    }

    if (!formData.bedrooms) {
      newErrors.bedrooms = "Number of bedrooms is required";
    } else if (isNaN(formData.bedrooms) || Number(formData.bedrooms) < 0) {
      newErrors.bedrooms = "Bedrooms must be a non-negative number";
    }

    if (!formData.bathrooms) {
      newErrors.bathrooms = "Number of bathrooms is required";
    } else if (isNaN(formData.bathrooms) || Number(formData.bathrooms) < 0) {
      newErrors.bathrooms = "Bathrooms must be a non-negative number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Convert numeric fields to numbers
      const processedData = {
        ...formData,
        rent: Number(formData.rent),
        size: Number(formData.size),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
      };

      onSubmit(processedData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {error && (
        <Alert variant="error" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <Input label="Apartment Name" name="name" value={formData.name || ""} onChange={handleChange} error={errors.name} required />

          <Input label="Address" name="address" value={formData.address || ""} onChange={handleChange} error={errors.address} required />

          <Input label="Image URL" name="imageUrl" value={formData.imageUrl || ""} onChange={handleChange} placeholder="https://example.com/image.jpg" />

          <Select label="Status" name="status" value={formData.status || "available"} onChange={handleChange} options={statusOptions} />
        </div>

        {/* Apartment Details */}
        <div className="space-y-4">
          <Input label="Rent (USD/month)" name="rent" type="number" value={formData.rent || ""} onChange={handleChange} error={errors.rent} required />

          <Input label="Size (sq ft)" name="size" type="number" value={formData.size || ""} onChange={handleChange} error={errors.size} required />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Bedrooms" name="bedrooms" type="number" value={formData.bedrooms || ""} onChange={handleChange} error={errors.bedrooms} required />

            <Input label="Bathrooms" name="bathrooms" type="number" value={formData.bathrooms || ""} onChange={handleChange} error={errors.bathrooms} required />
          </div>

          <Checkbox label="Furnished" name="isFurnished" checked={formData.isFurnished || false} onChange={handleChange} />
        </div>
      </div>

      {/* Description */}
      <div>
        <Input label="Description" name="description" value={formData.description || ""} onChange={handleChange} multiline rows={4} />
      </div>

      {/* Amenities */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {commonAmenities.map((amenity) => (
            <div key={amenity} className="flex items-center">
              <Checkbox label={amenity} checked={(formData.amenities || []).includes(amenity)} onChange={() => handleAmenityToggle(amenity)} />
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" variant="primary" disabled={isLoading} className="min-w-[120px]">
          {isLoading ? "Saving..." : initialData._id ? "Update Apartment" : "Create Apartment"}
        </Button>
      </div>
    </form>
  );
};

export default ApartmentForm;
