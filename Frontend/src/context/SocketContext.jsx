import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { UserDataContext } from '../context/UserContext';

const SOCKET_SERVER_URL = `${import.meta.env.VITE_BACKEND_URL}`;

export const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef();
  const [socket, setSocket] = useState(null); // ✅ Add this
  const { user } = useContext(UserDataContext);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
      reconnection: true,
    });

    socketRef.current = newSocket;
    setSocket(newSocket); // ✅ Important: triggers rerender with new socket

    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      if (user?._id && user?.role) {
        newSocket.emit('registerSocket', {
          userId: user._id,
          role: user.role,
        });
      }
    });

    newSocket.on('disconnect', () => {
      console.log('⚠️ Socket disconnected');
    });

    newSocket.on('connect_error', (err) => {
      console.error('❌ Socket connection error:', err);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const sendMessage = (event, data) => {
    if (socket) {
      socket.emit(event, data);
    } else {
      console.warn("⚠️ Socket not connected.");
    }
  };

  return (
    <SocketContext.Provider value={{ socket, sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
};
