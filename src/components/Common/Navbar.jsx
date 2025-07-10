// src/components/Common/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaMoon, FaSun, FaBars, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { confirmAlert } from '../../services/alertService';
import { auth } from '../../services/firebase';

export default function Navbar() {
  const { user } = useAuth();
  const navigate    = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode]     = useState(
    () => localStorage.getItem('theme') === 'dark'
  );

  // Apply dark class to <html>
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);
  const toggleMobile   = () => setMobileOpen(prev => !prev);

  const handleLogout = async () => {
    const confirmed = await confirmAlert({
      title: 'Log out?',
      text: 'Are you sure you want to sign out?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, log out',
    });
    if (confirmed) {
      await auth.signOut();
      navigate('/login');
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/properties', label: 'Properties' },
  ];

  // Conditionally add dashboards
  if (user) {
    if (user.role === 'agent') {
      navLinks.push({ to: '/agent-dashboard', label: 'Agent Dashboard' });
    } else if (user.role === 'admin') {
      navLinks.push({ to: '/admin-dashboard', label: 'Admin Console' });
    } else {
      navLinks.push({ to: '/user-dashboard', label: 'My Dashboard' });
    }
  }

  return (
    <nav className="bg-gray-900 text-gray-100 shadow-md fixed w-full z-50">
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-400">
          RudraRealEstates
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium hover:text-blue-300 ${
                  isActive ? 'text-blue-300' : 'text-gray-100'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {!user ? (
            <>
              <NavLink
                to="/login"
                className="text-sm px-4 py-1 bg-blue-600 hover:bg-blue-500 rounded"
              >
                Log In
              </NavLink>
              <NavLink
                to="/signup"
                className="text-sm px-4 py-1 border border-blue-600 hover:bg-blue-700 rounded"
              >
                Sign Up
              </NavLink>
            </>
          ) : (
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              className="text-sm px-4 py-1 bg-red-600 hover:bg-red-700 rounded"
            >
              Log Out
            </motion.button>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="ml-4 p-2 rounded hover:bg-gray-700"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobile}
          className="md:hidden p-2 text-xl hover:text-blue-300"
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          className="md:hidden bg-gray-800 text-gray-100 overflow-hidden"
        >
          <div className="flex flex-col px-4 py-3 space-y-2">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={toggleMobile}
                className={({ isActive }) =>
                  `block text-base font-medium hover:text-blue-300 ${
                    isActive ? 'text-blue-300' : 'text-gray-100'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {!user ? (
              <>
                <Link
                  to="/login"
                  onClick={toggleMobile}
                  className="block px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-center"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={toggleMobile}
                  className="block px-4 py-2 border border-blue-600 hover:bg-blue-700 rounded text-center"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  toggleMobile();
                  handleLogout();
                }}
                className="block w-full text-left px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
              >
                Log Out
              </button>
            )}

            <button
              onClick={() => {
                toggleDarkMode();
                toggleMobile();
              }}
              className="mt-2 flex items-center px-4 py-2 hover:bg-gray-700 rounded"
            >
              {darkMode ? (
                <FaSun className="mr-2" />
              ) : (
                <FaMoon className="mr-2" />
              )}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  );
}