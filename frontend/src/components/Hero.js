import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./ui/Button";

/**
 * Hero component for the homepage
 * Uses natural earthy color palette with sage green as primary
 *
 * @returns {JSX.Element}
 */
const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to search results with query parameters
    navigate(`/apartments?search=${searchQuery}&location=${location}&bedrooms=${bedrooms}`);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Modern apartment" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#3A5145]/80 to-[#4D6A59]/60 dark:from-[#3A5145]/90 dark:to-[#4D6A59]/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 py-24 sm:px-6 sm:py-32 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center sm:text-left max-w-2xl sm:mx-auto lg:mx-0">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            <span className="block">Find Your Perfect</span>
            <span className="block mt-2 text-[#EFE9D9] dark:text-[#F5F2E9]">Rental Home</span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-white/80">Browse through our collection of high-quality apartments and homes. Find the perfect place in your desired location with the amenities you need.</p>

          {/* Search Box - Desktop */}
          <div className="mt-10 hidden sm:block">
            <form onSubmit={handleSearch} className="glass-card !bg-white/10 p-5 backdrop-blur-md">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-5">
                  <label htmlFor="search" className="sr-only">
                    Search
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg className="h-5 w-5 text-white/60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      id="search"
                      name="search"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full rounded-lg border-0 bg-white/10 py-3 pl-10 pr-3 text-white placeholder:text-white/60 focus:ring-2 focus:ring-white/30 sm:text-sm"
                      placeholder="Keywords (e.g. 'modern', 'quiet')"
                    />
                  </div>
                </div>

                <div className="md:col-span-3">
                  <label htmlFor="location" className="sr-only">
                    Location
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg className="h-5 w-5 text-white/60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="block w-full rounded-lg border-0 bg-white/10 py-3 pl-10 pr-3 text-white placeholder:text-white/60 focus:ring-2 focus:ring-white/30 sm:text-sm"
                      placeholder="Location"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="bedrooms" className="sr-only">
                    Bedrooms
                  </label>
                  <select id="bedrooms" name="bedrooms" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className="block w-full rounded-lg border-0 bg-white/10 py-3 pl-3 pr-10 text-white placeholder:text-white/60 focus:ring-2 focus:ring-white/30 sm:text-sm">
                    <option value="">Bedrooms</option>
                    <option value="1">1+ Bedroom</option>
                    <option value="2">2+ Bedrooms</option>
                    <option value="3">3+ Bedrooms</option>
                    <option value="4">4+ Bedrooms</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <Button type="submit" variant="primary" size="lg" fullWidth className="hover:bg-[#3A5145] hover:bg-opacity-80">
                    Search
                  </Button>
                </div>
              </div>
            </form>
          </div>

          {/* Mobile Search Button */}
          <div className="mt-8 flex flex-col space-y-4 sm:hidden">
            <Button onClick={() => navigate("/apartments")} variant="primary" size="lg" fullWidth className="hover:bg-[#3A5145] hover:bg-opacity-80">
              Search Apartments
            </Button>
            <Button onClick={() => navigate("/contact")} variant="outline" size="lg" fullWidth className="border-white text-white hover:bg-white hover:bg-opacity-10">
              Contact Us
            </Button>
          </div>

          {/* Feature Highlights */}
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white/10 backdrop-blur-sm">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-white">Prime Locations</h3>
                <p className="mt-2 text-base text-white/70">All our properties are in prime locations with great amenities nearby.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white/10 backdrop-blur-sm">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-white">Quick Process</h3>
                <p className="mt-2 text-base text-white/70">Apply online and get approved within 24-48 hours.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white/10 backdrop-blur-sm">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-white">Secure</h3>
                <p className="mt-2 text-base text-white/70">All properties are verified and maintained to high standards.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F5F2E9] dark:from-gray-900"></div>
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-[#4D6A59] opacity-10 rounded-full filter blur-3xl animate-pulse-light"></div>
      <div className="absolute top-1/3 left-0 w-72 h-72 bg-[#EFE9D9] opacity-10 rounded-full filter blur-3xl animate-pulse-light animation-delay-1000"></div>
    </div>
  );
};

export default Hero;
