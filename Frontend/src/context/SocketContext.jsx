import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { SocketContext } from './contexts';

export const SocketProvider = ({ children }) => {
  const { pathname } = useLocation();
  const role = pathname.startsWith('/captain-') ? 'captain' : 'user';
  const active = ['/home', '/riding', '/captain-home', '/captain-riding'].includes(pathname);
  const token = active ? localStorage.getItem(role === 'captain' ? 'captainToken' : 'token') : null;
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!token) {
      setSocket(null);
      return;
    }
    const connection = io(import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000', {
      auth: { token, role },
      transports: ['websocket'],
    });
    setSocket(connection);
    return () => connection.disconnect();
  }, [token, role]);

  const sendMessage = useCallback((event, data) => socket?.emit(event, data), [socket]);
  return <SocketContext.Provider value={{ socket, sendMessage }}>{children}</SocketContext.Provider>;
};
