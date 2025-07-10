// src/components/Common/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from 'react-icons/fa';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 py-8">
      <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Company Info */}
        <div>
          <h4 className="text-gray-100 font-semibold mb-4">Rudra RealEstates</h4>
          <p className="text-sm">
            Leading the way in modern real estate solutions. Browse, compare,
            and schedule visits all in one place.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-gray-100 font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link to="/properties" className="hover:text-white">
                Properties
              </Link>
            </li>
            <li>
              <Link to="/agents" className="hover:text-white">
                Agents
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-gray-100 font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/terms" className="hover:text-white">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-white">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="text-gray-100 font-semibold mb-4">Follow Us</h4>
          <div className="flex space-x-4 text-lg">
            <a
              href="#"
              aria-label="Facebook"
              className="hover:text-white transition-colors"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="hover:text-white transition-colors"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="hover:text-white transition-colors"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="hover:text-white transition-colors"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm">
        © {year} Rudra RealEstates. All rights reserved.
      </div>
    </footer>
  );
}