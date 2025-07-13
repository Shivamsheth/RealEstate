// src/components/Common/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaHome,
  FaBuilding,
  FaUser,
  FaUserTie,
  FaUsers,
  FaTags,
  FaChartPie,
  FaSignInAlt,
  FaUserPlus,
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useSidebar } from '../../contexts/SidebarContext';

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.role;
  const { isOpen } = useSidebar();

  const publicLinks = [
    { to: '/', label: 'Home', icon: <FaHome /> },
    { to: '/properties', label: 'Properties', icon: <FaBuilding /> },
  ];

  const dashboardLinks = role === 'admin'
    ? [
        { to: '/admin-dashboard', label: 'Admin Console', icon: <FaUser /> },
        { to: '/admin-dashboard/properties', label: 'Property Manager', icon: <FaBuilding /> },
        { to: '/promotions', label: 'Promotions', icon: <FaTags /> },
        { to: '/analytics', label: 'Analytics', icon: <FaChartPie /> },
      ]
    : role === 'agent'
    ? [{ to: '/agent-dashboard', label: 'Agent Dashboard', icon: <FaUserTie /> }]
    : role === 'client'
    ? [{ to: '/user-dashboard', label: 'My Dashboard', icon: <FaUsers /> }]
    : [];

  const authLinks = !user
    ? [
        { to: '/login', label: 'Log In', icon: <FaSignInAlt /> },
        { to: '/signup', label: 'Sign Up', icon: <FaUserPlus /> },
      ]
    : [];

  const allLinks = [...publicLinks, ...dashboardLinks, ...authLinks];

  return (
    <aside
      className={`
        absolute top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-gray-800 text-gray-100 shadow-lg z-40
        transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-64'}
      `}
    >
      <div className="px-6 py-4 text-2xl font-bold text-blue-400">
        RudraRE
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {allLinks.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive ? 'bg-gray-700 text-white' : 'hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <span className="text-lg mr-3">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {user && (
        <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
          Logged in as:<br />
          <span className="text-white font-medium">{user.email}</span>
        </div>
      )}
    </aside>
  );
}