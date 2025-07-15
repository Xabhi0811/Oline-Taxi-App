import React, { useEffect, useContext, useState } from 'react';
import { CaptainDataContext } from '../context/CaptainContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CaptainProtectWrapper = ({ children }) => {
  const navigate = useNavigate();
  const { captain, setCaptain } = useContext(CaptainDataContext);

  // ❌ You used object destructuring by mistake
  // const {isLoading, setIsLoading} = useState(true) ❌
  const [isLoading, setIsLoading] = useState(true); // ✅ Correct

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/captain-login');
      return;
    }

    const fetchCaptainProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/captains/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true // ✅ If you're using cookies
        });

        if (response.status === 200) {
          setCaptain(response.data.captain);
        } else {
          localStorage.removeItem('token');
          navigate('/captain-login');
        }
      } catch (error) {
        console.error('❌ Error fetching captain profile:', error.message);
        localStorage.removeItem('token');
        navigate('/captain-login');
      } 
    };

});

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default CaptainProtectWrapper;
