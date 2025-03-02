import React, { useState } from "react";
import { Button, Input, Select } from "../ui";
import ApartmentCard from "./ApartmentCard";

/**
 * ApartmentList component for displaying a list of apartments with filtering and sorting
 *
 * @param {Object} props - Component props
 * @param {Array} props.apartments - Array of apartment objects
 * @param {Function} props.onEdit - Edit handler
 * @param {Function} props.onDelete - Delete handler
 * @param {boolean} props.isAdmin - Whether the current user is an admin
 * @param {boolean} props.isOwner - Whether the current user is the owner
 * @param {boolean} props.isLoading - Whether data is loading
 * @param {string} props.className - Additional class names
 * @returns {JSX.Element}
 */
const ApartmentList = ({ apartments = [], onEdit, onDelete, isAdmin = false, isOwner = false, isLoading = false, className = "" }) => {
  // State for filters and sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Status options for filter
  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "available", label: "Available" },
    { value: "rented", label: "Rented" },
    { value: "maintenance", label: "Maintenance" },
    { value: "unavailable", label: "Unavailable" },
  ];

  // Sort options
  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "rent", label: "Rent" },
    { value: "size", label: "Size" },
    { value: "bedrooms", label: "Bedrooms" },
    { value: "bathrooms", label: "Bathrooms" },
  ];

  // Filter and sort apartments
  const filteredAndSortedApartments = apartments
    .filter((apartment) => {
      // Filter by search term
      const searchMatch = apartment.name?.toLowerCase().includes(searchTerm.toLowerCase()) || apartment.address?.toLowerCase().includes(searchTerm.toLowerCase()) || apartment.description?.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by status
      const statusMatch = statusFilter ? apartment.status?.toLowerCase() === statusFilter.toLowerCase() : true;

      return searchMatch && statusMatch;
    })
    .sort((a, b) => {
      // Get values to compare
      const aValue = a[sortBy] || 0;
      const bValue = b[sortBy] || 0;

      // Compare based on type
      if (typeof aValue === "string") {
        return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }
    });

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setSortBy("name");
    setSortOrder("asc");
  };

  return (
    <div className={className}>
      {/* Filters and sorting */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Input
            id="search"
            placeholder="Search apartments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            }
          />

          <Select id="status" placeholder="Filter by status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={statusOptions} />

          <div className="flex space-x-2">
            <Select id="sortBy" placeholder="Sort by" value={sortBy} onChange={(e) => setSortBy(e.target.value)} options={sortOptions} className="flex-grow" />

            <Button onClick={toggleSortOrder} variant="outline" className="px-3" title={sortOrder === "asc" ? "Sort Ascending" : "Sort Descending"}>
              {sortOrder === "asc" ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"></path>
                </svg>
              )}
            </Button>

            <Button onClick={resetFilters} variant="outline" className="px-3" title="Reset Filters">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {filteredAndSortedApartments.length} of {apartments.length} apartments
          </div>
        </div>
      </div>

      {/* Apartments grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : filteredAndSortedApartments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedApartments.map((apartment) => (
            <ApartmentCard key={apartment._id} apartment={apartment} onEdit={onEdit} onDelete={onDelete} isAdmin={isAdmin} isOwner={isOwner} />
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No apartments found</h3>
          <p className="text-gray-500">{searchTerm || statusFilter ? "Try adjusting your filters to see more results." : "There are no apartments available at the moment."}</p>
          {(searchTerm || statusFilter) && (
            <Button onClick={resetFilters} variant="outline" className="mt-4">
              Reset Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ApartmentList;
