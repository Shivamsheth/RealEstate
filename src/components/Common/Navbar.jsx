// src/components/Common/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaMoon, FaSun, FaBars } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useSidebar } from '../../contexts/SidebarContext';
import { confirmAlert } from '../../services/alertService';
import { auth } from '../../services/firebase';

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('theme') === 'dark'
  );

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

  return (
    <nav className="bg-gray-900 text-gray-100 shadow-md fixed w-full z-50">
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between h-16">
        <button
          onClick={toggleSidebar}
          className="p-2 text-xl hover:text-blue-300"
          aria-label="Toggle Sidebar"
        >
          <FaBars />
        </button>

        <Link to="/" className="text-2xl font-bold text-blue-400">
          RudraRealEstates
        </Link>

        <div className="flex items-center space-x-4">
          {user && (
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              className="text-sm px-4 py-1 bg-red-600 hover:bg-red-700 rounded hidden md:inline-block"
            >
              Log Out
            </motion.button>
          )}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded hover:bg-gray-700"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>
    </nav>
  );
}