import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserDataContext } from '../context/contexts';

const UserProtectWrapper = ({ children }) => {
  const token = localStorage.getItem('token');
  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true;
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(({ data }) => {
      if (active) {
        setUser(data);
        setReady(true);
      }
    }).catch(() => {
      if (active) {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login', { replace: true });
      }
    });
    return () => { active = false; };
  }, [token, navigate, setUser]);
  return ready ? children : <p role="status">Loading your profile...</p>;
};
export default UserProtectWrapper;
