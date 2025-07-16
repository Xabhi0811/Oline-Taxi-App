import React, { useEffect, useContext, useState } from 'react';
import { CaptainDataContext } from '../context/CaptainContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CaptainProtectWrapper = ({ children }) => {
  const token = localStorage.getItem('captainToken'); // ✅ Fix token key
  const navigate = useNavigate();
  const { captain, setCaptain } = useContext(CaptainDataContext);
  const [isLoading, setIsLoading] = useState(true); // ✅ Fix from destructuring bug

  useEffect(() => {
    if (!token) {
      navigate('/captain-login');
      return;
    }

    // ✅ Call Axios inside useEffect
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/captains/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.status === 200) {
          setCaptain(response.data.captain);
        } else {
          localStorage.removeItem('captainToken');
          navigate('/captain-login');
        }
      })
      .catch(error => {
        console.error('❌ Error fetching captain profile:', error);
        localStorage.removeItem('captainToken');
        navigate('/captain-login');
      })
      .finally(() => {
        setIsLoading(false); // ✅ Always stop loading after attempt
      });
  }, [token]);

  if (isLoading) {
    return <div className="text-center text-xl mt-10">Loading...</div>;
  }

  return <>{children}</>;
};

export default CaptainProtectWrapper;
