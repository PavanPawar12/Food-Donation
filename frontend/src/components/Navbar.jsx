import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaHandHoldingHeart } from "react-icons/fa";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setIsOpen(false);
    toast.success("Logged out successfully!");
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <FaHandHoldingHeart className="text-2xl text-yellow-300" />
              <span className="text-2xl font-bold">ShareButes</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-yellow-300 transition-colors duration-200">
              Home
            </Link>
            <Link to="/donations" className="hover:text-yellow-300 transition-colors duration-200">
              Donate Food
            </Link>
            <Link to="/requests" className="hover:text-yellow-300 transition-colors duration-200">
              Request Food
            </Link>
            {isLoggedIn && (
              <Link to="/dashboard" className="hover:text-yellow-300 transition-colors duration-200">
                Dashboard
              </Link>
            )}
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="bg-yellow-500 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors duration-200 shadow-lg"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-indigo-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="relative group">
                <button className="flex items-center space-x-2 bg-indigo-500 px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-200 shadow-lg">
                  <FaUser />
                  <span>{user?.name || "User"}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-indigo-700 hover:bg-indigo-50 rounded-t-lg"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-b-lg flex items-center space-x-2"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
      </div>
      
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-yellow-300 transition-colors duration-200"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-gradient-to-b from-indigo-600 to-blue-600 border-t border-indigo-500">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-white hover:text-yellow-300 hover:bg-indigo-500 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/donations"
              className="block px-3 py-2 rounded-md text-white hover:text-yellow-300 hover:bg-indigo-500 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Donate Food
            </Link>
            <Link
              to="/requests"
              className="block px-3 py-2 rounded-md text-white hover:text-yellow-300 hover:bg-indigo-500 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Request Food
            </Link>
            {isLoggedIn && (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md text-white hover:text-yellow-300 hover:bg-indigo-500 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-white hover:text-yellow-300 hover:bg-indigo-500 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-red-200 hover:text-red-100 hover:bg-red-500 transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            )}
            {!isLoggedIn && (
              <div className="pt-4 pb-3 border-t border-indigo-500">
        <Link
          to="/login"
                  className="block px-3 py-2 rounded-md text-white hover:text-yellow-300 hover:bg-indigo-500 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
        >
          Login
        </Link>
        <Link
          to="/register"
                  className="block px-3 py-2 rounded-md text-white hover:text-yellow-300 hover:bg-indigo-500 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
        >
          Register
        </Link>
      </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
