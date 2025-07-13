// src/components/Auth/Signup.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { auth, db } from '../../services/firebase';
import { setDoc, doc } from 'firebase/firestore';
import { confirmAlert } from '../../services/alertService';
import { motion } from 'framer-motion';
import Spinner from '../Common/Spinner';

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [role, setRole] = useState('client');
  const [loading, setLoading] = useState(false);

  // Configure the link so that once clicked, user lands on /login
  const actionCodeSettings = {
    url: `${window.location.origin}/login`,
    handleCodeInApp: true,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPwd) {
      await confirmAlert({
        title: 'Password Mismatch',
        text: 'Passwords do not match.',
        icon: 'error',
      });
      return;
    }
    setLoading(true);

    try {
      // 1) Create user in Firebase Auth
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCred.user;

      // 2) Create user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        role,                           // client or agent
        approved: role === 'client',    // auto-approved for clients
        createdAt: Date.now(),
      });

      // 3) Send verification email pointing to /login
      await sendEmailVerification(user, actionCodeSettings);
      await confirmAlert({
        title: 'Please Verify Your Mail',
        text: 'A verification link has been sent to your inbox.',
        icon: 'info',
      });

      // 4) If agent, tell them account needs admin approval
      if (role === 'agent') {
        await confirmAlert({
          title: 'Pending Approval',
          text: 'You’ll be able to log in once an admin approves your account.',
          icon: 'warning',
        });
      }

      // 5) Finally, redirect to Login page
      navigate('/login');
    } catch (err) {
      await confirmAlert({
        title: 'Signup Failed',
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
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-semibold text-gray-100 mb-6 text-center">
          Create Your Account
        </h2>

        <label className="block mb-4">
          <span className="text-gray-300">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:border-blue-500"
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-300">Password</span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:border-blue-500"
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-300">Confirm Password</span>
          <input
            type="password"
            required
            minLength={6}
            value={confirmPwd}
            onChange={(e) => setConfirmPwd(e.target.value)}
            className="mt-1 w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:border-blue-500"
          />
        </label>

        <label className="block mb-6">
          <span className="text-gray-300">Role</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-1 w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:border-blue-500"
          >
            <option value="client">Client</option>
            <option value="agent">Agent</option>
          </select>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded text-gray-100 font-medium"
        >
          {loading ? <Spinner className="h-5 w-5 mx-auto" /> : 'Sign Up'}
        </button>

        <p className="mt-4 text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:underline">
            Log In
          </Link>
        </p>
      </motion.form>
    </div>
  );
}