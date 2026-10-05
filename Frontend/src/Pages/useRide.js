import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export default function useRide(role) {
  const { state } = useLocation();
  const [ride, setRide] = useState(state?.ride || null);
  const [error, setError] = useState('');
  const id = state?.ride?._id || sessionStorage.getItem(`${role}RideId`);
  useEffect(() => {
    if (!id) {
      setError('No active ride found. Return home to request or accept a ride.');
      return;
    }
    let active = true;
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/rides/${role}/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem(role === 'captain' ? 'captainToken' : 'token')}` }
    }).then(({ data }) => { if (active) setRide(data); })
      .catch(() => { if (active) setError('Unable to load this ride. Return home and try again.'); });
    return () => { active = false; };
  }, [id, role]);
  return { ride, error, setRide };
}
