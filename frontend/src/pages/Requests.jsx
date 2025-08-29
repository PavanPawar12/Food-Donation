import React, { useState, useEffect } from "react";
import { FaSearch, FaMapMarkerAlt, FaClock, FaUtensils, FaUsers } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const Requests = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [booking, setBooking] = useState({});

  const mapDonationToCard = (d) => ({
    id: d._id,
    title: d.title,
    description: d.description,
    quantity: `${d.quantity?.amount || 0} ${d.quantity?.unit || "meals"}`,
    urgency: d.isUrgent ? "high" : "medium",
    location: d.fullAddress || d.location?.address?.street || "",
    contactPhone: d.donor?.phone || "",
    organizationName: d.donor?.organization || d.donor?.name || "",
    status: d.status || "available",
    postedAt: new Date(d.createdAt).toLocaleString()
  });

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get("/donations", { params: { page: 1, limit: 12, status: "available", sortBy: "createdAt", sortOrder: "desc" } });
        const items = (data?.data?.donations || []).map(mapDonationToCard);
        setDonations(items);
      } catch (e) {
        toast.error("Failed to load donations");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleBook = async (id) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    let user = null;
    try { user = JSON.parse(localStorage.getItem('user') || 'null'); } catch {}

    if (!token || !user) {
      toast.error("Please login as an NGO to book a donation.");
      return navigate('/login');
    }
    if (user.userType !== 'ngo') {
      return toast.error("Only NGO accounts can book donations.");
    }

    setBooking((b) => ({ ...b, [id]: true }));
    try {
      const res = await api.post(`/donations/${id}/claim`);
      if (res?.data?.success) {
        setDonations((prev) => prev.map((d) => d.id === id ? { ...d, status: 'claimed' } : d));
        toast.success("Donation claimed successfully.");
      } else {
        toast.error("Failed to claim donation.");
      }
    } catch (error) {
      const msg = error?.response?.data?.message || "Unable to claim this donation.";
      toast.error(msg);
    } finally {
      setBooking((b) => ({ ...b, [id]: false }));
    }
  };

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const DonationCard = ({ donation }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{donation.title}</h3>
          <p className="text-gray-600 mb-3">{donation.description}</p>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(donation.urgency)}`}>
            {donation.urgency} priority
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            donation.status === "available" 
              ? "bg-blue-100 text-blue-800" 
              : "bg-green-100 text-green-800"
          }`}>
            {donation.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <FaUtensils className="text-green-600" />
          <span className="text-sm text-gray-600">{donation.quantity}</span>
        </div>
        <div className="flex items-center space-x-2">
          <FaUsers className="text-blue-600" />
          <span className="text-sm text-gray-600">{donation.organizationName}</span>
        </div>
        <div className="flex items-center space-x-2">
          <FaMapMarkerAlt className="text-purple-600" />
          <span className="text-sm text-gray-600">{donation.location}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">📞 {donation.contactPhone}</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          <strong>Donor:</strong> {donation.organizationName}
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Posted {donation.postedAt}
        </div>
        <button
          disabled={donation.status !== 'available' || !!booking[donation.id]}
          onClick={() => handleBook(donation.id)}
          className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
            donation.status !== 'available' || booking[donation.id]
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {donation.status !== 'available' ? 'Claimed' : (booking[donation.id] ? 'Booking...' : 'Book')}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Donations</h1>
          <p className="text-gray-600">Browse active donation templates from donors</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search donations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Donations Grid */}
        {isLoading && donations.length === 0 ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDonations.map((donation) => (
              <DonationCard key={donation.id} donation={donation} />
            ))}
          </div>
        )}

        {filteredDonations.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No donations found</h3>
            <p className="text-gray-600">Try adjusting your search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;
