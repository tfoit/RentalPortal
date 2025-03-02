import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitOffer } from "../../services/offerService";

const FixedPriceOffer = ({ apartment, onOfferSubmitted }) => {
  const navigate = useNavigate();
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
        bidAmount: apartment.rent, // For fixed price, bid amount is the rent
        offerType: "fixed",
        moveInDate: new Date(moveInDate),
        duration,
        message,
      };

      const response = await submitOffer(offerData);

      setLoading(false);
      if (onOfferSubmitted) {
        onOfferSubmitted(response);
      }
    } catch (error) {
      setLoading(false);
      setError(error.message || "Failed to submit offer. Please try again.");
      console.error("Error submitting offer:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Rent Now at Fixed Price</h3>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="mb-4">
        <p className="text-gray-700">
          This apartment is available at a fixed price of{" "}
          <span className="font-bold">
            {apartment.rent} {apartment.currency}
          </span>{" "}
          per month.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
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
          <button type="submit" disabled={loading} className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
            {loading ? "Processing..." : "Rent Now"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FixedPriceOffer;
