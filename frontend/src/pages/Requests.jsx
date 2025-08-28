import React, { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaFilter, FaMapMarkerAlt, FaClock, FaUtensils, FaUsers } from "react-icons/fa";
import { toast } from "react-toastify";

const Requests = () => {
  const [showForm, setShowForm] = useState(false);
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    quantity: "",
    urgency: "medium",
    location: "",
    contactPhone: "",
    organizationName: "",
    beneficiaries: "",
    dietaryRestrictions: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate loading requests
    setTimeout(() => {
      setRequests([
        {
          id: 1,
          title: "Food for Homeless Shelter",
          description: "Need meals for 50 people at our overnight shelter",
          quantity: "50 meals",
          urgency: "high",
          location: "Downtown Shelter, 123 Main St",
          contactPhone: "+1 234-567-8900",
          organizationName: "Hope Shelter",
          beneficiaries: "50 homeless individuals",
          dietaryRestrictions: "Vegetarian preferred",
          status: "active",
          postedAt: "1 hour ago"
        },
        {
          id: 2,
          title: "School Lunch Program",
          description: "Looking for healthy snacks for after-school program",
          quantity: "100 snacks",
          urgency: "medium",
          location: "Community Center, Oak Ave",
          contactPhone: "+1 234-567-8901",
          organizationName: "Youth Development Center",
          beneficiaries: "100 children",
          dietaryRestrictions: "Nut-free, healthy options",
          status: "active",
          postedAt: "3 hours ago"
        },
        {
          id: 3,
          title: "Senior Center Meals",
          description: "Need nutritious meals for elderly residents",
          quantity: "30 meals",
          urgency: "low",
          location: "Golden Years Center, Park Rd",
          contactPhone: "+1 234-567-8902",
          organizationName: "Senior Care Foundation",
          beneficiaries: "30 elderly residents",
          dietaryRestrictions: "Low sodium, soft foods",
          status: "fulfilled",
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
      
      const newRequest = {
        id: requests.length + 1,
        ...form,
        status: "active",
        postedAt: "Just now"
      };
      
      setRequests([newRequest, ...requests]);
      setForm({
        title: "",
        description: "",
        quantity: "",
        urgency: "medium",
        location: "",
        contactPhone: "",
        organizationName: "",
        beneficiaries: "",
        dietaryRestrictions: ""
      });
      setShowForm(false);
      toast.success("Request posted successfully!");
    } catch (error) {
      toast.error("Failed to post request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || request.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const RequestCard = ({ request }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{request.title}</h3>
          <p className="text-gray-600 mb-3">{request.description}</p>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
            {request.urgency} priority
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            request.status === "active" 
              ? "bg-blue-100 text-blue-800" 
              : "bg-green-100 text-green-800"
          }`}>
            {request.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <FaUtensils className="text-green-600" />
          <span className="text-sm text-gray-600">{request.quantity}</span>
        </div>
        <div className="flex items-center space-x-2">
          <FaUsers className="text-blue-600" />
          <span className="text-sm text-gray-600">{request.beneficiaries}</span>
        </div>
        <div className="flex items-center space-x-2">
          <FaMapMarkerAlt className="text-purple-600" />
          <span className="text-sm text-gray-600">{request.location}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">📞 {request.contactPhone}</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          <strong>Organization:</strong> {request.organizationName}
        </p>
        {request.dietaryRestrictions && (
          <p className="text-sm text-gray-600 mt-1">
            <strong>Dietary Restrictions:</strong> {request.dietaryRestrictions}
          </p>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Posted {request.postedAt}
        </div>
        {request.status === "active" && (
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Offer Help
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Food Requests</h1>
          <p className="text-gray-600">Find organizations in need of food donations</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Requests</option>
                <option value="active">Active</option>
                <option value="fulfilled">Fulfilled</option>
              </select>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <FaPlus />
              <span>Post Request</span>
            </button>
          </div>
        </div>

        {/* Request Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Post Food Request</h2>
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
                        Request Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        required
                        value={form.title}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Food for Homeless Shelter"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Organization Name *
                      </label>
                      <input
                        type="text"
                        name="organizationName"
                        required
                        value={form.organizationName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Your organization name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity Needed *
                      </label>
                      <input
                        type="text"
                        name="quantity"
                        required
                        value={form.quantity}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 50 meals, 100 snacks"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Urgency Level *
                      </label>
                      <select
                        name="urgency"
                        value={form.urgency}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
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
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="+1 234-567-8900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Beneficiaries *
                      </label>
                      <input
                        type="text"
                        name="beneficiaries"
                        required
                        value={form.beneficiaries}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 50 homeless individuals"
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
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Downtown Shelter, 123 Main St"
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
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Describe your food needs, target beneficiaries, etc."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dietary Restrictions
                      </label>
                      <input
                        type="text"
                        name="dietaryRestrictions"
                        value={form.dietaryRestrictions}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Vegetarian, Nut-free, Low sodium"
                      />
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
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
                    >
                      {isLoading ? "Posting..." : "Post Request"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Requests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No requests found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;
