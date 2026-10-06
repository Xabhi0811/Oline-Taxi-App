import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/users/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } catch {
        console.error('Logout failed. Please try again.');
      }
    };

    logout();
  }, [navigate]);

  return <p>Logging you out...</p>;
};

export default UserLogout;
