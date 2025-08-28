import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  FaHandHoldingHeart, 
  FaUsers, 
  FaChartLine, 
  FaTrophy,
  FaBell,
  FaCog,
  FaHome,
  FaDonate,
  FaSearch,
  FaUser,
  FaSignOutAlt,
  FaArrowLeft,
  FaArrowRight,
  FaCircle,
  FaEdit,
  FaHeart,
  FaCalendar,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaTimes
} from "react-icons/fa";
import { toast } from "react-toastify";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showUserContext, setShowUserContext] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [liveStats, setLiveStats] = useState({
    totalDonors: 0,
    totalAcceptances: 0,
    activeDonations: 0,
    pendingRequests: 0,
    todayDonations: 0,
    thisWeekDonations: 0
  });
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }

    // Simulate real-time stats updates
    const updateStats = () => {
      setLiveStats({
        totalDonors: Math.floor(Math.random() * 50) + 150,
        totalAcceptances: Math.floor(Math.random() * 30) + 80,
        activeDonations: Math.floor(Math.random() * 20) + 15,
        pendingRequests: Math.floor(Math.random() * 10) + 5,
        todayDonations: Math.floor(Math.random() * 15) + 8,
        thisWeekDonations: Math.floor(Math.random() * 50) + 35
      });
    };

    updateStats();
    const interval = setInterval(updateStats, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setShowUserContext(false);
    toast.success("Logged out successfully!");
  };

  const menuItems = [
    { path: "/", icon: FaHome, label: "Home", badge: null },
    { path: "/dashboard", icon: FaChartLine, label: "Dashboard", badge: null },
    { path: "/realtime", icon: FaCircle, label: "Real-time", badge: null },
    { path: "/donations", icon: FaDonate, label: "Donations", badge: liveStats.activeDonations },
    { path: "/requests", icon: FaSearch, label: "Requests", badge: liveStats.pendingRequests },
    { path: "/analytics", icon: FaChartLine, label: "Analytics", badge: null },
    { path: "/profile", icon: FaUser, label: "Profile", badge: null }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Main Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} min-h-screen fixed left-0 top-0 z-50`}>
      {/* Toggle Button */}
        <div className="flex justify-end p-4">
      <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
      >
            {isCollapsed ? <FaArrowRight size={16} /> : <FaArrowLeft size={16} />}
      </button>
        </div>

      {/* Logo */}
        <div className="px-4 mb-6">
          {!isCollapsed ? (
            <div className="flex items-center space-x-2">
              <FaHandHoldingHeart className="text-2xl text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">ShareButes</span>
            </div>
          ) : (
            <div className="flex justify-center">
              <FaHandHoldingHeart className="text-2xl text-indigo-600" />
            </div>
          )}
        </div>

        {/* Real-time Stats */}
        {!isCollapsed && (
          <div className="px-4 mb-6">
            <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-lg p-4 border border-indigo-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <FaCircle className="text-green-500 text-xs mr-2 animate-pulse" />
                Live Statistics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Total Donors</span>
                  <span className="text-sm font-bold text-indigo-600">{liveStats.totalDonors}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Acceptances</span>
                  <span className="text-sm font-bold text-green-600">{liveStats.totalAcceptances}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Active Donations</span>
                  <span className="text-sm font-bold text-blue-600">{liveStats.activeDonations}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Pending Requests</span>
                  <span className="text-sm font-bold text-orange-600">{liveStats.pendingRequests}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-indigo-100 text-indigo-700 border-r-2 border-indigo-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className={`${isCollapsed ? 'mx-auto' : 'mr-3'} text-lg`} />
                  {!isCollapsed && (
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {item.badge}
          </span>
                      )}
                    </div>
                  )}
                </Link>
        </li>
            ))}
          </ul>
        </nav>

        {/* Quick Stats */}
        {!isCollapsed && (
          <div className="px-4 mt-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Today's Activity</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Donations</span>
                  <span className="text-sm font-bold text-green-600">{liveStats.todayDonations}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">This Week</span>
                  <span className="text-sm font-bold text-blue-600">{liveStats.thisWeekDonations}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          {isLoggedIn ? (
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
              <button
                onClick={() => setShowUserContext(!showUserContext)}
                className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold hover:bg-indigo-700 transition-colors"
              >
                {user?.name?.charAt(0) || "U"}
              </button>
              {!isCollapsed && (
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{user?.name || "User"}</p>
                  <p className="text-xs text-gray-500">{user?.email || "user@example.com"}</p>
                </div>
              )}
              <button
                onClick={handleLogout}
                className={`p-2 text-gray-500 hover:text-red-600 transition-colors ${isCollapsed ? 'mx-auto' : ''}`}
                title="Logout"
              >
                <FaSignOutAlt size={16} />
              </button>
            </div>
          ) : (
            <div className={`flex ${isCollapsed ? 'justify-center' : 'space-x-2'}`}>
              <Link
                to="/login"
                className={`bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors ${isCollapsed ? 'px-2' : ''}`}
              >
                {isCollapsed ? <FaUser size={16} /> : "Login"}
              </Link>
              {!isCollapsed && (
                <Link
                  to="/register"
                  className="bg-white text-indigo-600 border border-indigo-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors"
                >
                  Register
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Live Indicator */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center space-x-1">
            <FaCircle className="text-green-500 text-xs animate-pulse" />
            {!isCollapsed && <span className="text-xs text-green-600 font-medium">LIVE</span>}
          </div>
        </div>
      </div>

      {/* User Context Panel (Right Side) */}
      {isLoggedIn && showUserContext && (
        <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg z-40 border-l border-gray-200">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">User Profile</h2>
              <button
                onClick={() => setShowUserContext(false)}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* User Info */}
            <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{user?.name}</h3>
                  <p className="text-sm text-gray-600">{user?.userType === "donor" ? "Food Donor" : "NGO"}</p>
                  {user?.organization && (
                    <p className="text-sm text-indigo-600 font-medium">{user.organization}</p>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                {user?.email && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FaEnvelope className="text-gray-400" />
                    <span>{user.email}</span>
                  </div>
                )}
                {user?.phone && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FaPhone className="text-gray-400" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user?.address && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <span>{user.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Impact</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                  <div className="text-2xl font-bold text-indigo-600">{user?.stats?.totalDonations || 0}</div>
                  <div className="text-sm text-gray-600">Donations</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                  <div className="text-2xl font-bold text-green-600">{user?.stats?.totalMeals || 0}</div>
                  <div className="text-sm text-gray-600">Meals</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  to="/profile"
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FaEdit className="text-indigo-600" />
                  <span className="text-sm font-medium text-gray-900">Edit Profile</span>
                </Link>
                {user?.userType === "donor" ? (
                  <Link
                    to="/donations"
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <FaDonate className="text-green-600" />
                    <span className="text-sm font-medium text-gray-900">Post Donation</span>
                  </Link>
                ) : (
                  <Link
                    to="/requests"
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <FaSearch className="text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">Request Food</span>
                  </Link>
                )}
                <Link
                  to="/analytics"
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FaChartLine className="text-purple-600" />
                  <span className="text-sm font-medium text-gray-900">View Analytics</span>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FaHeart className="text-red-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Joined ShareButes</p>
                    <p className="text-xs text-gray-500">{new Date(user?.registeredAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FaCalendar className="text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Profile Completed</p>
                    <p className="text-xs text-gray-500">Today</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
    </div>
      )}

      {/* Overlay for mobile */}
      {isLoggedIn && showUserContext && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setShowUserContext(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
