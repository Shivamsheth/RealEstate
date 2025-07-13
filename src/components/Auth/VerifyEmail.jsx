import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { applyActionCode } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { confirmAlert } from '../../services/alertService';
import Spinner from '../Common/Spinner';

export default function VerifyEmail() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const code = params.get('oobCode');

    if (!code) {
      confirmAlert({
        title: 'Invalid Link',
        text: 'No verification code found.',
        icon: 'error',
      });
      navigate('/signup');
      return;
    }

    applyActionCode(auth, code)
      .then(async () => {
        await confirmAlert({
          title: 'Email Verified',
          text: 'Your email has been verified. Please log in.',
          icon: 'success',
        });
        navigate('/login');
      })
      .catch(async (err) => {
        await confirmAlert({
          title: 'Verification Failed',
          text: err.message,
          icon: 'error',
        });
        navigate('/signup');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [search, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      {loading && <Spinner />}
    </div>
  );
}