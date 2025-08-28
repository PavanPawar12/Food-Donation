import React, { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaFilter, FaMapMarkerAlt, FaClock, FaUtensils } from "react-icons/fa";
import { toast } from "react-toastify";

const Donations = () => {
  const [showForm, setShowForm] = useState(false);
  const [donations, setDonations] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    quantity: "",
    expiryDate: "",
    location: "",
    contactPhone: "",
    allergens: "",
    packaging: "packaged"
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate loading donations
    setTimeout(() => {
      setDonations([
        {
          id: 1,
          title: "Fresh Bread & Pastries",
          description: "Freshly baked bread and pastries from local bakery",
          quantity: "20 pieces",
          expiryDate: "2024-01-15",
          location: "Downtown Bakery, Main St",
          contactPhone: "+1 234-567-8900",
          allergens: "Gluten, Dairy",
          packaging: "packaged",
          status: "available",
          postedBy: "John's Bakery",
          postedAt: "2 hours ago"
        },
        {
          id: 2,
          title: "Vegetarian Meals",
          description: "Healthy vegetarian meals prepared with fresh ingredients",
          quantity: "15 meals",
          expiryDate: "2024-01-14",
          location: "Community Kitchen, Oak Ave",
          contactPhone: "+1 234-567-8901",
          allergens: "Nuts",
          packaging: "containers",
          status: "claimed",
          postedBy: "Green Eats",
          postedAt: "4 hours ago"
        },
        {
          id: 3,
          title: "Fruits & Vegetables",
          description: "Fresh fruits and vegetables from local market",
          quantity: "10 kg",
          expiryDate: "2024-01-16",
          location: "Farmers Market, Park Rd",
          contactPhone: "+1 234-567-8902",
          allergens: "None",
          packaging: "loose",
          status: "available",
          postedBy: "Fresh Harvest",
          postedAt: "1 day ago"
        }
      ]);
    }, 1000);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newDonation = {
        id: donations.length + 1,
        ...form,
        status: "available",
        postedBy: "You",
        postedAt: "Just now"
      };
      
      setDonations([newDonation, ...donations]);
      setForm({
        title: "",
        description: "",
        quantity: "",
        expiryDate: "",
        location: "",
        contactPhone: "",
        allergens: "",
        packaging: "packaged"
      });
      setShowForm(false);
      toast.success("Donation posted successfully!");
    } catch (error) {
      toast.error("Failed to post donation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || donation.status === filter;
    return matchesSearch && matchesFilter;
  });

  const DonationCard = ({ donation }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{donation.title}</h3>
          <p className="text-gray-600 mb-3">{donation.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          donation.status === "available" 
            ? "bg-green-100 text-green-800" 
            : "bg-yellow-100 text-yellow-800"
        }`}>
          {donation.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <FaUtensils className="text-green-600" />
          <span className="text-sm text-gray-600">{donation.quantity}</span>
        </div>
        <div className="flex items-center space-x-2">
          <FaClock className="text-red-600" />
          <span className="text-sm text-gray-600">Expires: {donation.expiryDate}</span>
        </div>
        <div className="flex items-center space-x-2">
          <FaMapMarkerAlt className="text-blue-600" />
          <span className="text-sm text-gray-600">{donation.location}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">📞 {donation.contactPhone}</span>
        </div>
      </div>

      {donation.allergens && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            <strong>Allergens:</strong> {donation.allergens}
          </p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Posted by {donation.postedBy} • {donation.postedAt}
        </div>
        {donation.status === "available" && (
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
            Claim
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Food Donations</h1>
          <p className="text-gray-600">Share your surplus food and help those in need</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search donations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Donations</option>
                <option value="available">Available</option>
                <option value="claimed">Claimed</option>
              </select>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <FaPlus />
              <span>Post Donation</span>
            </button>
          </div>
        </div>

        {/* Donation Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Post Food Donation</h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Food Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        required
                        value={form.title}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="e.g., Fresh Bread & Pastries"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity *
                      </label>
                      <input
                        type="text"
                        name="quantity"
                        required
                        value={form.quantity}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="e.g., 20 pieces, 5 kg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date *
                      </label>
                      <input
                        type="date"
                        name="expiryDate"
                        required
                        value={form.expiryDate}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Phone *
                      </label>
                      <input
                        type="tel"
                        name="contactPhone"
                        required
                        value={form.contactPhone}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="+1 234-567-8900"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location *
                      </label>
                      <input
                        type="text"
                        name="location"
                        required
                        value={form.location}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="e.g., Downtown Bakery, Main St"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        required
                        value={form.description}
                        onChange={handleChange}
                        rows="3"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Describe the food items, ingredients, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Allergens
                      </label>
                      <input
                        type="text"
                        name="allergens"
                        value={form.allergens}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="e.g., Gluten, Dairy, Nuts"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Packaging
                      </label>
                      <select
                        name="packaging"
                        value={form.packaging}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="packaged">Individually Packaged</option>
                        <option value="containers">In Containers</option>
                        <option value="loose">Loose Items</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
                    >
                      {isLoading ? "Posting..." : "Post Donation"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Donations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonations.map((donation) => (
            <DonationCard key={donation.id} donation={donation} />
          ))}
        </div>

        {filteredDonations.length === 0 && (
          <div className="text-center py-12">
            <FaUtensils className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No donations found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Donations;
