import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Donations from './pages/Donations'
import Requests from './pages/Requests'
import Profile from './pages/Profile'
import Analytics from './pages/Analytics'
import RealtimeDashboard from './pages/RealtimeDashboard'
import LandingLayout from './layouts/LandingLayout'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Claimed from './pages/Claimed'
import MyDonations from './pages/MyDonations'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes - Landing Layout */}
        <Route path="/" element={<LandingLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="donate" element={<Donations />} />
          <Route path="request" element={<Requests />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="realtime" element={<RealtimeDashboard />} />
          <Route path="donations" element={<Donations />} />
          <Route path="requests" element={<Requests />} />
          <Route path="profile" element={<Profile />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>

        {/* Legacy routes for backward compatibility */}
        <Route path="/realtime" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<RealtimeDashboard />} />
        </Route>
        
        <Route path="/claimed" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Claimed />} />
        </Route>

        <Route path="/donations" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Donations />} />
          <Route path="new" element={<Donations />} />
        </Route>
        
        <Route path="/donations/mine" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<MyDonations />} />
        </Route>

        <Route path="/requests" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Requests />} />
        </Route>
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Profile />} />
        </Route>
        
        <Route path="/analytics" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Analytics />} />
        </Route>
      </Routes>

      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  )
}

export default App;


