import React, { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaFilter, FaMapMarkerAlt, FaClock, FaUtensils } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import GoogleMapReact from "../components/GoogleMapReact";

const Donations = () => {
  const navigate = useNavigate();
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
    latitude: "",
    longitude: "",
    addressStreet: "",
    addressCity: "",
    addressState: "",
    addressZip: "",
    addressCountry: "",
    contactPhone: "",
    allergens: "",
    packaging: "packaged"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const mapDonationToCard = (d) => ({
    id: d._id,
    title: d.title,
    description: d.description,
    quantity: `${d.quantity?.amount || 0} ${d.quantity?.unit || "items"}`,
    expiryDate: d.expiryTime ? new Date(d.expiryTime).toLocaleDateString() : "",
    location: d.location?.formattedAddress || d.location?.address?.street || d.fullAddress || "Location not specified",
    contactPhone: d.donor?.phone || "",
    allergens: (d.allergens || []).filter(a => a !== "none").join(", "),
    packaging: form.packaging,
    status: d.status || "available",
    postedBy: d.donor?.organization || d.donor?.name || "Donor",
    postedAt: new Date(d.createdAt).toLocaleString()
  });

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get("/donations", { params: { page: 1, limit: 12 } });
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

  useEffect(() => {
    // open form when on /donations/new
    if (typeof window !== 'undefined' && window.location.pathname.endsWith('/donations/new')) {
      setShowForm(true);
    }
  }, []);

  // Debug: Monitor selectedLocation changes
  useEffect(() => {
    console.log('Donations - selectedLocation changed:', selectedLocation);
  }, [selectedLocation]);

  // Debug: Monitor form state changes
  useEffect(() => {
    console.log('Donations - form state changed:', {
      latitude: form.latitude,
      longitude: form.longitude,
      location: form.location
    });
  }, [form.latitude, form.longitude, form.location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Debug logging
    console.log('Form submission - selectedLocation:', selectedLocation);
    console.log('Form submission - form.latitude:', form.latitude);
    console.log('Form submission - form.longitude:', form.longitude);
    
         // Validate that a location has been selected
     if (!selectedLocation || !form.latitude || !form.longitude) {
       let errorMsg = "Please select a location on the map before submitting. ";
       if (!selectedLocation) errorMsg += "No location selected. ";
       if (!form.latitude) errorMsg += "Latitude missing. ";
       if (!form.longitude) errorMsg += "Longitude missing. ";
       
       toast.error(errorMsg);
       console.log('Validation failed - selectedLocation:', selectedLocation);
       console.log('Validation failed - latitude:', form.latitude);
       console.log('Validation failed - longitude:', form.longitude);
       return;
     }
    
    setIsLoading(true);

    try {
      // Build backend payload from form
      const amountMatch = /\d+/.exec(form.quantity || "0");
      const amount = amountMatch ? parseInt(amountMatch[0], 10) : 0;
      const rawUnit = (form.quantity || "pieces").replace(/\d+/g, "").trim().toLowerCase();
      const allowedUnits = ["meals","pounds","kilograms","pieces","servings","containers"];
      const unit = allowedUnits.includes(rawUnit) ? rawUnit : "pieces";

      const now = new Date();
      const prepISO = now.toISOString();
      const expISO = form.expiryDate ? new Date(form.expiryDate + "T23:59:59").toISOString() : new Date(now.getTime() + 24*60*60*1000).toISOString();
      const pickupStart = new Date(now.getTime() + 2*60*60*1000).toISOString();
      const pickupEnd = new Date(now.getTime() + 6*60*60*1000).toISOString();

      const lat = parseFloat(form.latitude);
      const lng = parseFloat(form.longitude);
      const hasCoords = Number.isFinite(lat) && Number.isFinite(lng);

      const payload = {
        title: form.title,
        description: form.description,
        foodType: form.packaging === "packaged" ? "packaged" : "cooked",
        quantity: { amount, unit },
        allergens: form.allergens ? form.allergens.split(",").map(s => s.trim()).filter(Boolean) : ["none"],
        dietaryRestrictions: ["none"],
        preparationTime: prepISO,
        expiryTime: expISO,
        pickupTime: { start: pickupStart, end: pickupEnd },
        location: {
          address: {
            street: form.addressStreet || form.location,
            city: form.addressCity || undefined,
            state: form.addressState || undefined,
            zipCode: form.addressZip || undefined,
            country: form.addressCountry || undefined
          },
          coordinates: hasCoords ? { type: "Point", coordinates: [lng, lat] } : { type: "Point", coordinates: [-74.006, 40.7128] },
          formattedAddress: selectedLocation?.formattedAddress || form.location
        },
        notes: ""
      };

      const { data } = await api.post("/donations", payload);
      const created = data?.data?.donation;
      if (created?._id) {
        setDonations(prev => [mapDonationToCard(created), ...prev]);
        setForm({
          title: "",
          description: "",
          quantity: "",
          expiryDate: "",
          location: "",
          latitude: "",
          longitude: "",
          addressStreet: "",
          addressCity: "",
          addressState: "",
          addressZip: "",
          addressCountry: "",
          contactPhone: "",
          allergens: "",
          packaging: "packaged"
        });
        setSelectedLocation(null);
        setShowForm(false);
        toast.success("Donation posted successfully!");
        // redirect donor back to profile to see updated stats/CTA
        setTimeout(() => {
          if (typeof window !== 'undefined') window.location.href = '/dashboard/profile';
        }, 500);
      } else {
        toast.error("Failed to post donation");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to post donation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLocationSelect = (locationData) => {
    console.log('Donations - handleLocationSelect called with:', locationData);
    setSelectedLocation(locationData);
    
    // Parse address components
    const parseAddressComponents = (components) => {
      if (!components) return {};
      
      const getComponent = (type) => {
        const component = components.find(c => c.types.includes(type));
        return component ? component.long_name : '';
      };

      return {
        street: `${getComponent('street_number')} ${getComponent('route')}`.trim(),
        city: getComponent('locality') || getComponent('administrative_area_level_2'),
        state: getComponent('administrative_area_level_1'),
        zipCode: getComponent('postal_code'),
        country: getComponent('country')
      };
    };

    const addressComponents = parseAddressComponents(locationData.addressComponents);
    
    setForm(prev => ({
      ...prev,
      latitude: String(locationData.lat),
      longitude: String(locationData.lng),
      location: locationData.formattedAddress,
      addressStreet: addressComponents.street || locationData.formattedAddress,
      addressCity: addressComponents.city || '',
      addressState: addressComponents.state || '',
      addressZip: addressComponents.zipCode || '',
      addressCountry: addressComponents.country || ''
    }));
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const apiKey = import.meta?.env?.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey) return null;
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.status !== 'OK') return null;
      const result = data.results?.[0];
      const formatted = result?.formatted_address || '';
      const components = result?.address_components || [];
      const get = (type) => components.find(c => c.types.includes(type))?.long_name || '';
      return {
        formatted,
        street: `${get('street_number')} ${get('route')}`.trim() || formatted,
        city: get('locality') || get('administrative_area_level_2'),
        state: get('administrative_area_level_1'),
        zip: get('postal_code'),
        country: get('country')
      };
    } catch {
      return null;
    }
  };

  const handleShareLocation = async () => {
    if (!navigator.geolocation) {
      return toast.error("Geolocation is not supported by your browser.");
    }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      
      // Update form with coordinates
      setForm((f) => ({ ...f, latitude: String(lat), longitude: String(lng) }));
      
      // Get address details
      const geo = await reverseGeocode(lat, lng);
      if (geo) {
        setForm((f) => ({
          ...f,
          location: geo.formatted,
          addressStreet: geo.street,
          addressCity: geo.city,
          addressState: geo.state,
          addressZip: geo.zip,
          addressCountry: geo.country
        }));
        
        // Update selected location for map display
        setSelectedLocation({
          lat,
          lng,
          formattedAddress: geo.formatted,
          addressComponents: null
        });
      } else {
        toast.info("Location captured. Could not resolve full address.");
      }
      toast.success("Location captured from your device.");
    }, (err) => {
      toast.error(err?.message || "Failed to get current location.");
    }, { enableHighAccuracy: true, timeout: 10000 });
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
          <button 
            onClick={() => navigate(`/donations/claim/${donation.id}`)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
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
                      
                      {/* Google Maps Component - Always Visible */}
                      <div className="mb-4">
                        <GoogleMapReact
                          onLocationSelect={handleLocationSelect}
                          initialLat={form.latitude ? parseFloat(form.latitude) : 16.7050}
                          initialLng={form.longitude ? parseFloat(form.longitude) : 74.2433}
                          height="350px"
                          showSearch={true}
                          showCurrentLocation={true}
                          autoCenterOnUserLocation={true}
                        />
                      </div>

                      {/* Location Selection Instructions */}
                      {!selectedLocation && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                          <h4 className="font-medium text-yellow-900 mb-2">📍 Select Location:</h4>
                          <p className="text-sm text-yellow-800">
                            Please click on the map above, drag the marker, or use the search box to select a location for your donation.
                          </p>
                        </div>
                      )}

                      {/* Selected Location Display */}
                      {selectedLocation && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                          <h4 className="font-medium text-green-900 mb-2">✅ Location Selected:</h4>
                          <p className="text-sm text-green-800">
                            <strong>Address:</strong> {selectedLocation.formattedAddress}
                          </p>
                          <p className="text-sm text-green-700">
                            <strong>Coordinates:</strong> {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                          </p>
                        </div>
                      )}

                                             {/* Hidden fields for coordinates */}
                       <input type="hidden" name="latitude" value={form.latitude} readOnly />
                       <input type="hidden" name="longitude" value={form.longitude} readOnly />
                       
                       {/* Debug Info */}
                       <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
                         <h4 className="font-medium text-gray-900 mb-2">🔍 Debug Info:</h4>
                         <div className="text-xs text-gray-600 space-y-1">
                           <p><strong>selectedLocation:</strong> {selectedLocation ? 'Set' : 'Not Set'}</p>
                           <p><strong>form.latitude:</strong> {form.latitude || 'Not Set'}</p>
                           <p><strong>form.longitude:</strong> {form.longitude || 'Not Set'}</p>
                         </div>
                         
                         {/* Manual Location Button */}
                         {!selectedLocation && (
                           <button
                             type="button"
                             onClick={() => {
                               const testLocation = {
                                 lat: 16.7050,
                                 lng: 74.2433,
                                 formattedAddress: "Kolhapur, Maharashtra, India",
                                 addressComponents: []
                               };
                               handleLocationSelect(testLocation);
                               toast.success("Test location set (Kolhapur)");
                             }}
                             className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                           >
                             Set Test Location (Kolhapur)
                           </button>
                         )}
                       </div>
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
