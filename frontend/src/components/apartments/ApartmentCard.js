import React from "react";
import { Link } from "react-router-dom";
import { Card, Badge } from "../ui";

/**
 * ApartmentCard component for displaying apartment information in a card
 *
 * @param {Object} props - Component props
 * @param {Object} props.apartment - Apartment data
 * @param {Function} props.onEdit - Edit handler
 * @param {Function} props.onDelete - Delete handler
 * @param {boolean} props.isAdmin - Whether the current user is an admin
 * @param {boolean} props.isOwner - Whether the current user is the owner
 * @param {string} props.className - Additional class names
 * @returns {JSX.Element}
 */
const ApartmentCard = ({ apartment, onEdit, onDelete, isAdmin = false, isOwner = false, className = "" }) => {
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

  // Card footer with actions
  const cardFooter =
    isAdmin || isOwner ? (
      <div className="flex justify-between items-center">
        <Link to={`/apartments/${apartment._id}`} className="text-primary-600 hover:text-primary-700 font-medium">
          View Details
        </Link>
        <div className="flex space-x-2">
          {onEdit && (
            <button onClick={() => onEdit(apartment)} className="text-blue-600 hover:text-blue-700">
              Edit
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(apartment._id)} className="text-red-600 hover:text-red-700">
              Delete
            </button>
          )}
        </div>
      </div>
    ) : (
      <Link to={`/apartments/${apartment._id}`} className="text-primary-600 hover:text-primary-700 font-medium">
        View Details
      </Link>
    );

  return (
    <Card className={`h-full flex flex-col ${className}`} hoverable footer={cardFooter}>
      {/* Apartment Image */}
      <div className="relative h-48 mb-4 overflow-hidden rounded-lg bg-gray-200">
        {apartment.imageUrl ? <img src={apartment.imageUrl} alt={apartment.name || "Apartment"} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">No Image Available</div>}
        <div className="absolute top-2 right-2">
          <Badge variant={getStatusVariant(apartment.status)} size="md" pill>
            {apartment.status || "Unknown"}
          </Badge>
        </div>
      </div>

      {/* Apartment Details */}
      <div className="flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{apartment.name || "Unnamed Apartment"}</h3>
        <p className="text-gray-500 text-sm mb-2">{apartment.address || "No address provided"}</p>
        <div className="flex justify-between items-center mb-3">
          <span className="text-xl font-bold text-primary-600">{formatPrice(apartment.rent || 0)}/mo</span>
          <div className="text-sm text-gray-600">{apartment.size || 0} sq ft</div>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            {apartment.bedrooms || 0} Beds
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
            </svg>
            {apartment.bathrooms || 0} Baths
          </div>
          {apartment.furnished && (
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Furnished
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ApartmentCard;
