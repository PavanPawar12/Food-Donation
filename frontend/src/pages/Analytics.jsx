import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaChartLine, 
  FaChartBar, 
  FaChartPie, 
  FaCalendar,
  FaMapMarkerAlt,
  FaUsers,
  FaHandHoldingHeart,
  FaLeaf,
  FaTrophy,
  FaArrowUp,
  FaArrowDown,
  FaDownload,
  FaFilter,
  FaEye
} from "react-icons/fa";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("month");
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    totalDonations: 0,
    totalMeals: 0,
    impactScore: 0,
    growthRate: 0,
    topCategories: [],
    monthlyTrends: [],
    geographicData: [],
    communityRank: 0
  });

  useEffect(() => {
    // Simulate loading analytics data
    setTimeout(() => {
      setIsLoading(false);
      setAnalyticsData({
        totalDonations: 47,
        totalMeals: 284,
        impactScore: 92,
        growthRate: 15.3,
        topCategories: [
          { name: "Vegetables", percentage: 35, color: "bg-green-500" },
          { name: "Bread & Pastries", percentage: 25, color: "bg-yellow-500" },
          { name: "Fruits", percentage: 20, color: "bg-orange-500" },
          { name: "Dairy", percentage: 15, color: "bg-blue-500" },
          { name: "Others", percentage: 5, color: "bg-purple-500" }
        ],
        monthlyTrends: [
          { month: "Jan", donations: 12, meals: 84 },
          { month: "Feb", donations: 15, meals: 105 },
          { month: "Mar", donations: 18, meals: 126 },
          { month: "Apr", donations: 22, meals: 154 },
          { month: "May", donations: 25, meals: 175 },
          { month: "Jun", donations: 30, meals: 210 },
          { month: "Jul", donations: 35, meals: 245 },
          { month: "Aug", donations: 40, meals: 280 },
          { month: "Sep", donations: 45, meals: 315 },
          { month: "Oct", donations: 47, meals: 329 },
          { month: "Nov", donations: 50, meals: 350 },
          { month: "Dec", donations: 55, meals: 385 }
        ],
        geographicData: [
          { location: "Downtown", donations: 15, color: "bg-blue-500" },
          { location: "Westside", donations: 12, color: "bg-green-500" },
          { location: "Eastside", donations: 10, color: "bg-yellow-500" },
          { location: "Northside", donations: 8, color: "bg-purple-500" },
          { location: "Southside", donations: 6, color: "bg-red-500" }
        ],
        communityRank: 8
      });
    }, 1500);
  }, []);

  const renderBarChart = () => {
    const maxValue = Math.max(...analyticsData.monthlyTrends.map(item => item.donations));
    
    return (
      <div className="space-y-4">
        {analyticsData.monthlyTrends.map((item, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-12 text-sm font-medium text-gray-600">{item.month}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-4 rounded-full transition-all duration-1000"
                style={{ width: `${(item.donations / maxValue) * 100}%` }}
              ></div>
            </div>
            <div className="w-16 text-sm font-semibold text-gray-900">{item.donations}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderPieChart = () => {
    return (
      <div className="space-y-4">
        {analyticsData.topCategories.map((category, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 ${category.color} rounded-full`}></div>
              <span className="text-sm font-medium text-gray-700">{category.name}</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">{category.percentage}%</span>
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-indigo-600 font-semibold">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600">Track your impact and performance metrics</p>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>
              <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                <FaDownload className="text-sm" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Donations</p>
                <p className="text-3xl font-bold text-gray-900">{analyticsData.totalDonations}</p>
                <div className="flex items-center text-green-600 text-sm mt-1">
                  <FaArrowUp className="mr-1" />
                  <span>+{analyticsData.growthRate}% vs last period</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaHandHoldingHeart className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Meals Delivered</p>
                <p className="text-3xl font-bold text-gray-900">{analyticsData.totalMeals}</p>
                <div className="flex items-center text-green-600 text-sm mt-1">
                  <FaArrowUp className="mr-1" />
                  <span>+12.5% vs last period</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaLeaf className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Impact Score</p>
                <p className="text-3xl font-bold text-gray-900">{analyticsData.impactScore}</p>
                <div className="flex items-center text-green-600 text-sm mt-1">
                  <FaArrowUp className="mr-1" />
                  <span>+8 points</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaChartLine className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Community Rank</p>
                <p className="text-3xl font-bold text-gray-900">#{analyticsData.communityRank}</p>
                <div className="flex items-center text-green-600 text-sm mt-1">
                  <FaArrowUp className="mr-1" />
                  <span>Top 10%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FaTrophy className="text-yellow-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Donation Trends */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Donation Trends</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <FaCalendar />
                <span>Monthly Overview</span>
              </div>
            </div>
            {renderBarChart()}
          </div>

          {/* Food Categories */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Food Categories</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <FaChartPie />
                <span>Distribution</span>
              </div>
            </div>
            {renderPieChart()}
          </div>
        </div>

        {/* Geographic Impact */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Geographic Impact</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FaMapMarkerAlt />
              <span>Location-based Donations</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {analyticsData.geographicData.map((location, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 ${location.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <FaMapMarkerAlt className="text-white text-xl" />
                </div>
                <h4 className="font-semibold text-gray-900">{location.location}</h4>
                <p className="text-2xl font-bold text-gray-700">{location.donations}</p>
                <p className="text-sm text-gray-600">donations</p>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <FaArrowUp className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Consistent Growth</p>
                    <p className="text-sm text-gray-600">Your donations are increasing steadily</p>
                  </div>
                </div>
                <span className="text-green-600 font-semibold">+15.3%</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaUsers className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Community Impact</p>
                    <p className="text-sm text-gray-600">You're in the top 10% of donors</p>
                  </div>
                </div>
                <span className="text-blue-600 font-semibold">Top 10%</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <FaTrophy className="text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Achievement Unlocked</p>
                    <p className="text-sm text-gray-600">You've earned 3 new badges</p>
                  </div>
                </div>
                <span className="text-purple-600 font-semibold">3 badges</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                <h4 className="font-medium text-gray-900 mb-2">Increase Vegetable Donations</h4>
                <p className="text-sm text-gray-600">Vegetables are in high demand. Consider donating more fresh produce.</p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                <h4 className="font-medium text-gray-900 mb-2">Perfect Timing</h4>
                <p className="text-sm text-gray-600">Your donation schedule aligns well with community needs.</p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <h4 className="font-medium text-gray-900 mb-2">Expand Reach</h4>
                <p className="text-sm text-gray-600">Consider donating to organizations in underserved areas.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/donations"
            className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-cyan-700 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <FaHandHoldingHeart />
            <span>Make a Donation</span>
          </Link>
          <Link
            to="/dashboard"
            className="bg-white text-indigo-600 border-2 border-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <FaEye />
            <span>View Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

