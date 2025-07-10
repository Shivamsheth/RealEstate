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
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.role;

  // Base links for all users
  const links = [
    { to: '/', label: 'Home', icon: <FaHome /> },
    { to: '/properties', label: 'Properties', icon: <FaBuilding /> },
  ];

  // Role-specific links
  if (role === 'agent') {
    links.push({
      to: '/agent-dashboard',
      label: 'Agent Dashboard',
      icon: <FaUserTie />,
    });
  } else if (role === 'admin') {
    links.push(
      {
        to: '/admin-dashboard',
        label: 'Admin Console',
        icon: <FaUser />,
      },
      {
        to: '/admin-dashboard/properties',
        label: 'Property Manager',
        icon: <FaBuilding />,
      },
      {
        to: '/promotions',
        label: 'Promotions',
        icon: <FaTags />,
      },
      {
        to: '/analytics',
        label: 'Analytics',
        icon: <FaChartPie />,
      }
    );
  } else if (role === 'client') {
    links.push({
      to: '/user-dashboard',
      label: 'My Dashboard',
      icon: <FaUsers />,
    });
  }

  return (
    <aside className="hidden md:flex flex-col w-64 bg-gray-800 text-gray-100 fixed h-full">
      <div className="px-6 py-4 text-2xl font-bold text-blue-400">
        RudraRE
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md text-sm font-medium
               ${isActive
                  ? 'bg-gray-700 text-white'
                  : 'hover:bg-gray-700 hover:text-white'}`
            }
          >
            <span className="text-lg mr-3">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
        Logged in as:<br />
        <span className="text-white font-medium">{user?.email}</span>
      </div>
    </aside>
  );
}