import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { API_URL } from "../../services/config";

const OfferStatus = ({ apartmentId, userId, userRole }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication required");
          setLoading(false);
          return;
        }

        let url;
        if (userRole === "owner") {
          url = `${API_URL}/api/offers/apartment/${apartmentId}`;
        } else {
          url = `${API_URL}/api/offers/user`;
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Filter offers for this apartment if tenant
        let filteredOffers = response.data;
        if (userRole === "tenant") {
          filteredOffers = response.data.filter((offer) => offer.apartmentId === apartmentId);
        }

        setOffers(filteredOffers);
        setLoading(false);
      } catch (error) {
        setError("Failed to load offers");
        setLoading(false);
        console.error("Error fetching offers:", error);
      }
    };

    fetchOffers();
  }, [apartmentId, userId, userRole]);

  const handleOfferAction = async (offerId, action) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API_URL}/api/offers/${offerId}`,
        { status: action },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the offers list with the updated offer
      setOffers((prevOffers) => prevOffers.map((offer) => (offer._id === offerId ? response.data : offer)));

      setActionLoading(false);
    } catch (error) {
      setError("Failed to update offer");
      setActionLoading(false);
      console.error("Error updating offer:", error);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading offers...</div>;
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>;
  }

  if (offers.length === 0) {
    return <div className="bg-gray-100 p-4 rounded-lg text-center">{userRole === "tenant" ? "You have not made any offers for this apartment yet." : "No offers have been received for this apartment yet."}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">{userRole === "tenant" ? "Your Offers" : "Received Offers"}</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">{userRole === "tenant" ? "Track the status of your offers for this apartment" : "Review and manage offers for this apartment"}</p>
      </div>

      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {offers.map((offer) => (
            <li key={offer._id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-gray-900">
                    Bid Amount: {offer.bidAmount} {/* Add currency */}
                  </p>
                  <p className="text-sm text-gray-500">Move-in Date: {format(new Date(offer.moveInDate), "MMM dd, yyyy")}</p>
                  <p className="text-sm text-gray-500">Duration: {offer.duration} months</p>
                  <p className="text-sm text-gray-500">Submitted: {format(new Date(offer.createdAt), "MMM dd, yyyy")}</p>
                  {offer.message && <p className="text-sm text-gray-500 mt-2">Message: {offer.message}</p>}
                </div>

                <div className="flex flex-col items-end">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(offer.status)}`}>{offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}</span>

                  {userRole === "owner" && offer.status === "pending" && (
                    <div className="mt-2 flex space-x-2">
                      <button onClick={() => handleOfferAction(offer._id, "accepted")} disabled={actionLoading} className="bg-green-500 hover:bg-green-700 text-white text-xs font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline">
                        Accept
                      </button>
                      <button onClick={() => handleOfferAction(offer._id, "rejected")} disabled={actionLoading} className="bg-red-500 hover:bg-red-700 text-white text-xs font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline">
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OfferStatus;
