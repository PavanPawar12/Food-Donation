import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaHeart, 
  FaUtensils, 
  FaHandHoldingHeart, 
  FaUsers, 
  FaPlus,
  FaSearch,
  FaBell,
  FaUser
} from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../api/api";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    donorsCount: 0,
    acceptancesCount: 0,
    activeDonationsCount: 0,
    pendingRequestsCount: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        // Get current user (will set userType for donor/ngo specific calls)
        const me = await api.get("/auth/me");
        const meUser = me?.data?.data?.user;
        if (meUser) {
          setUser(meUser);
        }

        // Load platform stats
        try {
          const res = await api.get('/stats');
          const s = res?.data?.data || {};
          setStats({
            donorsCount: s.donorsCount || 0,
            acceptancesCount: s.acceptancesCount || 0,
            activeDonationsCount: s.activeDonationsCount || 0,
            pendingRequestsCount: s.pendingRequestsCount || 0,
          });
        } catch {}

        // Optional: load recent activity (can be wired later)
        setRecentActivities([
          { id: 1, type: "donation", title: "Welcome to ShareButes", description: "You're all set!", time: "Just now", status: "completed" }
        ]);
      } catch (e) {
        // not logged in or error fetching
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, []);

  const StatCard = ({ icon: Icon, title, value, color, description }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const ActivityCard = ({ activity }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case "completed": return "text-green-600 bg-green-100";
        case "pending": return "text-yellow-600 bg-yellow-100";
        case "cancelled": return "text-red-600 bg-red-100";
        default: return "text-gray-600 bg-gray-100";
      }
    };

    const getTypeIcon = (type) => {
      switch (type) {
        case "donation": return <FaHandHoldingHeart className="h-4 w-4" />;
        case "request": return <FaUtensils className="h-4 w-4" />;
        case "delivery": return <FaUsers className="h-4 w-4" />;
        default: return <FaBell className="h-4 w-4" />;
      }
    };

    return (
      <div className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            {getTypeIcon(activity.type)}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
          <p className="text-sm text-gray-500">{activity.description}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">{activity.time}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(activity.status)}`}>
              {activity.status}
            </span>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name || "User"}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <FaBell className="h-5 w-5" />
              </button>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <FaUser className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            <Link
              to="/dashboard/donations"
              className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              <FaPlus className="h-4 w-4" />
              <span>Donate Food</span>
            </Link>
            <Link
              to="/dashboard/requests"
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <FaSearch className="h-4 w-4" />
              <span>Find Food</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={FaUsers}
            title="Total Donors"
            value={stats.donorsCount}
            color="bg-green-500"
          />
          <StatCard
            icon={FaUtensils}
            title="Acceptances"
            value={stats.acceptancesCount}
            color="bg-blue-500"
          />
          <StatCard
            icon={FaHandHoldingHeart}
            title="Active Donations"
            value={stats.activeDonationsCount}
            color="bg-purple-500"
          />
          <StatCard
            icon={FaChartLine}
            title="Pending Requests"
            value={stats.pendingRequestsCount}
            color="bg-yellow-500"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
                <Link
                  to="/activities"
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats & Tips */}
          <div className="space-y-6">
            {/* Impact Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Impact</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Food waste reduced</span>
                  <span className="text-sm font-medium text-green-600">45 kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">People helped</span>
                  <span className="text-sm font-medium text-blue-600">156</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Carbon saved</span>
                  <span className="text-sm font-medium text-purple-600">23 kg CO2</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Donate food within 2 hours of preparation</li>
                <li>• Include allergen information</li>
                <li>• Use proper packaging for safe transport</li>
                <li>• Update your availability regularly</li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link
                  to="/dashboard/profile"
                  className="block text-sm text-green-600 hover:text-green-700 py-1"
                >
                  → Update Profile
                </Link>
                <Link
                  to="/dashboard/donations"
                  className="block text-sm text-green-600 hover:text-green-700 py-1"
                >
                  → Manage Donations
                </Link>
                <Link
                  to="/dashboard/requests"
                  className="block text-sm text-green-600 hover:text-green-700 py-1"
                >
                  → View Requests
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
