// src/components/Auth/ForgotPassword.jsx
import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { confirmAlert } from '../../services/alertService';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Spinner from '../Common/Spinner';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      await confirmAlert({
        title: 'Reset Email Sent',
        text: 'Check your inbox for a password reset link.',
        icon: 'success',
      });
      navigate('/login');
    } catch (err) {
      await confirmAlert({
        title: 'Error',
        text: err.message,
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm bg-gray-800 p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-semibold text-gray-100 mb-6 text-center">
          Forgot Password
        </h2>

        <label className="block mb-4">
          <span className="text-gray-300">Email Address</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:border-blue-500"
            placeholder="you@example.com"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded text-gray-100 font-medium"
        >
          {loading ? <Spinner className="h-5 w-5 mx-auto" /> : 'Send Reset Link'}
        </button>

        <p className="mt-4 text-center text-gray-400">
          Remembered your password?{' '}
          <Link to="/login" className="text-blue-400 hover:underline">
            Log In
          </Link>
        </p>
      </motion.form>
    </div>
  );
}