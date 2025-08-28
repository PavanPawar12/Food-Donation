import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/DashboardLayout'
import Donations from './pages/Donations'
import Requests from './pages/Requests'
import Profile from './pages/Profile'
import Analytics from './pages/Analytics'
import RealtimeDashboard from './pages/RealtimeDashboard'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Navbar/>
          <main className="flex-grow">
            <Routes>
              <Route path='/' element={<Home/>} />
              <Route path='/login' element={<Login/>} />
              <Route path='/register' element={<Register/>} />
              <Route path='/dashboard' element={<Dashboard/>} />
              <Route path='/realtime' element={<RealtimeDashboard/>} />
              <Route path='/donations' element={<Donations/>} />
              <Route path='/requests' element={<Requests/>} />
              <Route path='/profile' element={<Profile/>} />
              <Route path='/analytics' element={<Analytics/>} />
            </Routes>
          </main>
          <Footer/>
        </div>
      </div>
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

export default App


