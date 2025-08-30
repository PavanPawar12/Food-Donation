import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Donations from './pages/Donations'
import Requests from './pages/Requests'
import Profile from './pages/Profile'

import LandingLayout from './layouts/LandingLayout'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Claimed from './pages/Claimed'
import MyDonations from './pages/MyDonations'
import ClaimDonation from './pages/ClaimDonation'
import MapExamples from './components/MapExamples'
import MapTest from './components/MapTest'
import GoogleMapsTest from './components/GoogleMapsTest'
import LocationDebug from './components/LocationDebug'
import SimpleLocationTest from './components/SimpleLocationTest'
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
          <Route path="map-examples" element={<MapExamples />} />
          <Route path="map-test" element={<MapTest />} />
          <Route path="api-test" element={<GoogleMapsTest />} />
          <Route path="location-debug" element={<LocationDebug />} />
          <Route path="simple-test" element={<SimpleLocationTest />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="donations" element={<Donations />} />
          <Route path="requests" element={<Requests />} />
          <Route path="profile" element={<Profile />} />
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
          <Route path="claim/:donationId" element={<ClaimDonation />} />
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


