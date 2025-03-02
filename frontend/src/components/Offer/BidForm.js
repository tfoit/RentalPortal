import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../services/config";

const BidForm = ({ apartment, onBidSubmitted }) => {
  const navigate = useNavigate();
  const [bidAmount, setBidAmount] = useState(apartment.rent);
  const [moveInDate, setMoveInDate] = useState("");
  const [duration, setDuration] = useState(12); // Default 12 months
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get tomorrow's date in YYYY-MM-DD format for min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowFormatted = tomorrow.toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login", { state: { from: `/apartments/${apartment._id}` } });
        return;
      }

      const offerData = {
        apartmentId: apartment._id,
        bidAmount,
        offerType: "bidding",
        moveInDate: new Date(moveInDate),
        duration,
        message,
      };

      const response = await axios.post(`${API_URL}/api/offers`, offerData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setLoading(false);
      if (onBidSubmitted) {
        onBidSubmitted(response.data);
      }
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || "Failed to submit bid. Please try again.");
      console.error("Error submitting bid:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Make an Offer</h3>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Your Bid Amount ({apartment.currency})</label>
          <input
            type="number"
            min={apartment.rent * 0.8} // Minimum bid is 80% of asking price
            step="10"
            value={bidAmount}
            onChange={(e) => setBidAmount(Number(e.target.value))}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Asking price: {apartment.rent} {apartment.currency}
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Desired Move-in Date</label>
          <input type="date" min={tomorrowFormatted} value={moveInDate} onChange={(e) => setMoveInDate(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Lease Duration (months)</label>
          <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
            <option value={6}>6 months</option>
            <option value={12}>12 months</option>
            <option value={18}>18 months</option>
            <option value={24}>24 months</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Message to Owner (optional)</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="3"
            placeholder="Introduce yourself and explain why you're interested in this apartment..."
          />
        </div>

        <div className="flex items-center justify-between">
          <button type="submit" disabled={loading} className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
            {loading ? "Submitting..." : "Submit Bid"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BidForm;
