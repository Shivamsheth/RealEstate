// src/App.jsx
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { SidebarProvider, useSidebar } from './contexts/SidebarContext';

import Navbar from './components/Common/Navbar';
import Sidebar from './components/Common/Sidebar';
import Footer from './components/Common/Footer';

import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Agents from './pages/Agents';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import FAQ from './pages/FAQ';

import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import VerifyEmail from './components/Auth/VerifyEmail';

import AgentDashboard from './pages/AgentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PropertyManager from './components/Admin/PropertyManager';
import UserDashboard from './pages/UserDashboard';

function AnimatedRoutes() {
  const location = useLocation();

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

        {/* New: Email verification handler */}
        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route path="/agent-dashboard" element={<AgentDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route
          path="/admin-dashboard/properties"
          element={<PropertyManager />}
        />
        <Route path="/user-dashboard" element={<UserDashboard />} />
      </Routes>
    </AnimatePresence>
  );
}

function AppLayout() {
  const { user } = useAuth();
  const { isOpen } = useSidebar();

  return (
    <div className="flex bg-gray-900 text-gray-100 min-h-screen pt-16">
      {/* Sidebar always rendered, will show guest or user links */}
      <Sidebar user={user} />

      <main
        className={`flex-1 transition-all duration-300 ${
          isOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        <AnimatedRoutes />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <SidebarProvider>
            <Navbar />
            <AppLayout />
            <Footer />
          </SidebarProvider>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}