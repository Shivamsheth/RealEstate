// src/App.jsx
import React from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import { AuthProvider } from './contexts/AuthContext'
import { AppProvider } from './contexts/AppContext'

import Navbar from './components/Common/Navbar'
import Footer from './components/Common/Footer'

import Home from './pages/Home'
import Properties from './pages/Properties'
import PropertyDetails from './pages/PropertyDetails'
import AgentDashboard from './pages/AgentDashboard'
import AdminDashboard from './pages/AdminDashboard'
import UserDashboard from './pages/UserDashboard'
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'
import Contact from './pages/Contact'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import FAQ from './pages/FAQ'
import Agents from './pages/Agents'
import PropertyManager from './components/Admin/PropertyManager'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence exitBeforeEnter>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/faq" element={<FAQ />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/agent-dashboard" element={<AgentDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route
          path="/admin-dashboard/properties"
          element={<PropertyManager />}
        />

        <Route path="/user-dashboard" element={<UserDashboard />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Navbar />
          <AnimatedRoutes />
          <Footer />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}