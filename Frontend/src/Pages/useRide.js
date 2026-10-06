import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { SocketContext } from '../context/contexts';

export default function useRide(role) {
  const { socket } = useContext(SocketContext);
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
    const recover = () => axios.get(`${import.meta.env.VITE_BACKEND_URL}/rides/${role}/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem(role === 'captain' ? 'captainToken' : 'token')}` }
    }).then(({ data }) => { if (active) { setRide(data); setError(''); } })
      .catch(() => { if (active) setError('Unable to load this ride. Return home and try again.'); });
    recover();
    socket?.on('ready', recover);
    return () => { active = false; socket?.off('ready', recover); };
  }, [id, role, socket]);
  return { ride, error, setRide };
}
