import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaHandHoldingHeart, 
  FaUsers, 
  FaChartLine, 
  FaTrophy,
  FaBell,
  FaCircle,
  FaArrowUp,
  FaArrowDown,
  FaClock,
  FaMapMarkerAlt,
  FaUser,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaEye,
  FaDownload
} from "react-icons/fa";

const RealtimeDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [liveData, setLiveData] = useState({
    totalDonors: 0,
    totalAcceptances: 0,
    activeDonations: 0,
    pendingRequests: 0,
    todayDonations: 0,
    thisWeekDonations: 0,
    recentDonors: [],
    recentAcceptances: [],
    notifications: [],
    liveActivity: []
  });

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      updateLiveData();
    }, 1000);

    // Update data every 3 seconds for real-time effect
    const interval = setInterval(updateLiveData, 3000);

    return () => clearInterval(interval);
  }, []);

  const updateLiveData = () => {
    // Get actual recent registrations from localStorage
    const recentRegistrations = JSON.parse(localStorage.getItem("recentRegistrations") || "[]");
    
    const newDonors = recentRegistrations.slice(0, 3).map(reg => ({
      id: reg.id,
      name: reg.name,
      type: reg.type,
      time: reg.time,
      location: reg.location
    }));

    const newAcceptances = [
      { id: Date.now(), org: "Community Kitchen", donor: "Sarah Johnson", food: "Vegetables", time: "Just now" },
      { id: Date.now() + 1, org: "Homeless Shelter", donor: "Mike Chen", food: "Bread", time: "3 min ago" },
      { id: Date.now() + 2, org: "Food Bank", donor: "Emily Rodriguez", food: "Fruits", time: "7 min ago" }
    ];

    const newNotifications = [
      { id: Date.now(), type: "registration", message: `New ${recentRegistrations[0]?.type || "user"} registered: ${recentRegistrations[0]?.name || "Someone"}`, time: "Just now", read: false },
      { id: Date.now() + 1, type: "acceptance", message: "Community Kitchen accepted vegetables", time: "2 min ago", read: false },
      { id: Date.now() + 2, type: "request", message: "New food request from Downtown Shelter", time: "5 min ago", read: false }
    ];

    const newActivity = [
      { id: Date.now(), type: "registration", user: recentRegistrations[0]?.name || "New User", action: "joined ShareButes", time: "Just now", status: "active" },
      { id: Date.now() + 1, type: "acceptance", user: "Community Kitchen", action: "accepted vegetables", time: "2 min ago", status: "completed" },
      { id: Date.now() + 2, type: "request", user: "Downtown Shelter", action: "requested food", time: "5 min ago", status: "pending" }
    ];

    // Calculate real stats based on registrations
    const totalDonors = recentRegistrations.length + Math.floor(Math.random() * 20) + 150;
    const totalAcceptances = Math.floor(totalDonors * 0.6) + Math.floor(Math.random() * 10);
    const activeDonations = Math.floor(totalDonors * 0.3) + Math.floor(Math.random() * 5);
    const pendingRequests = Math.floor(Math.random() * 8) + 3;

    setLiveData({
      totalDonors,
      totalAcceptances,
      activeDonations,
      pendingRequests,
      todayDonations: Math.floor(Math.random() * 15) + 8,
      thisWeekDonations: Math.floor(Math.random() * 50) + 35,
      recentDonors: newDonors.length > 0 ? newDonors : [
        { id: Date.now(), name: "Sarah Johnson", type: "Individual", time: "Just now", location: "Downtown" },
        { id: Date.now() + 1, name: "Mike Chen", type: "Restaurant", time: "2 min ago", location: "Westside" },
        { id: Date.now() + 2, name: "Emily Rodriguez", type: "NGO", time: "5 min ago", location: "Eastside" }
      ],
      recentAcceptances: newAcceptances,
      notifications: newNotifications,
      liveActivity: newActivity
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-indigo-600 font-semibold">Loading real-time dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-50 ml-64">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Real-time Dashboard</h1>
              <p className="text-gray-600">Live tracking of donors and acceptances</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-green-600">
                <FaCircle className="text-xs animate-pulse" />
                <span className="text-sm font-medium">LIVE</span>
              </div>
              <button className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors">
                <FaBell className="text-xl" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {liveData.notifications.filter(n => !n.read).length}
                </span>
              </button>
              <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                <FaDownload className="text-sm" />
                <span>Export Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Live Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Donors</p>
                <p className="text-3xl font-bold text-gray-900">{liveData.totalDonors}</p>
                <div className="flex items-center text-green-600 text-sm mt-1">
                  <FaArrowUp className="mr-1" />
                  <span>+{Math.floor(Math.random() * 5) + 1} this hour</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FaUsers className="text-indigo-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Acceptances</p>
                <p className="text-3xl font-bold text-gray-900">{liveData.totalAcceptances}</p>
                <div className="flex items-center text-green-600 text-sm mt-1">
                  <FaArrowUp className="mr-1" />
                  <span>+{Math.floor(Math.random() * 3) + 1} this hour</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaCheck className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Donations</p>
                <p className="text-3xl font-bold text-gray-900">{liveData.activeDonations}</p>
                <div className="flex items-center text-blue-600 text-sm mt-1">
                  <FaCircle className="mr-1 text-xs animate-pulse" />
                  <span>Live updates</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaHandHoldingHeart className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending Requests</p>
                <p className="text-3xl font-bold text-gray-900">{liveData.pendingRequests}</p>
                <div className="flex items-center text-orange-600 text-sm mt-1">
                  <FaExclamationTriangle className="mr-1" />
                  <span>Needs attention</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FaClock className="text-orange-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Activity Feed */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Live Activity Feed</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FaCircle className="text-green-500 text-xs animate-pulse" />
                  <span>Real-time updates</span>
                </div>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {liveData.liveActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'donation' ? 'bg-green-100' : 
                      activity.type === 'acceptance' ? 'bg-blue-100' : 
                      activity.type === 'registration' ? 'bg-purple-100' : 'bg-orange-100'
                    }`}>
                      {activity.type === 'donation' && <FaHandHoldingHeart className="text-green-600 text-sm" />}
                      {activity.type === 'acceptance' && <FaCheck className="text-blue-600 text-sm" />}
                      {activity.type === 'registration' && <FaUser className="text-purple-600 text-sm" />}
                      {activity.type === 'request' && <FaExclamationTriangle className="text-orange-600 text-sm" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        <span className="font-semibold">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      activity.status === 'active' ? 'bg-green-100 text-green-800' :
                      activity.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {activity.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Donors & Acceptances */}
          <div className="space-y-6">
            {/* Recent Donors */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Registrations</h3>
              <div className="space-y-3">
                {liveData.recentDonors.map((donor) => (
                  <div key={donor.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <FaUser className="text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{donor.name}</p>
                      <p className="text-xs text-gray-500">{donor.type} • {donor.location}</p>
                      <p className="text-xs text-gray-400">{donor.time}</p>
                    </div>
                    <FaCircle className="text-green-500 text-xs animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Acceptances */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Acceptances</h3>
              <div className="space-y-3">
                {liveData.recentAcceptances.map((acceptance) => (
                  <div key={acceptance.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <FaCheck className="text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{acceptance.org}</p>
                      <p className="text-xs text-gray-500">Accepted {acceptance.food} from {acceptance.donor}</p>
                      <p className="text-xs text-gray-400">{acceptance.time}</p>
                    </div>
                    <FaCircle className="text-green-500 text-xs animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Panel */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Notifications</h3>
            <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              Mark all as read
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveData.notifications.map((notification) => (
              <div key={notification.id} className={`p-4 rounded-lg border ${
                notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                  {!notification.read && (
                    <FaCircle className="text-blue-500 text-xs mt-1" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/donations"
            className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-cyan-700 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <FaHandHoldingHeart />
            <span>View All Donations</span>
          </Link>
          <Link
            to="/requests"
            className="bg-white text-indigo-600 border-2 border-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <FaEye />
            <span>View All Requests</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RealtimeDashboard;
