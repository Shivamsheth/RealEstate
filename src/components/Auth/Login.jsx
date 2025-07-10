// src/components/Auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { confirmAlert } from '../../services/alertService';
import { motion } from 'framer-motion';
import Spinner from '../Common/Spinner';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      if (!user.emailVerified) {
        await sendEmailVerification(user);
        await confirmAlert({
          title: 'Email Not Verified',
          text: 'Verification link resent. Please check your inbox.',
          icon: 'info'
        });
        await auth.signOut();
        setLoading(false);
        return;
      }

      // successful login
      navigate('/');
    } catch (err) {
      await confirmAlert({
        title: 'Login Failed',
        text: err.message,
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-gray-800 p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-semibold text-gray-100 mb-6 text-center">
          Rudra RealEstates Login
        </h2>

        <label className="block mb-4">
          <span className="text-gray-300">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="mt-1 w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:border-blue-500"
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-300">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="mt-1 w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:border-blue-500"
          />
        </label>

        <div className="flex items-center justify-between mb-6">
          <Link to="/forgot-password" className="text-sm text-blue-400 hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded text-gray-100 font-medium"
        >
          {loading ? <Spinner className="h-5 w-5 mx-auto" /> : 'Log In'}
        </button>

        <p className="mt-4 text-center text-gray-400">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </motion.form>
    </div>
  );
}