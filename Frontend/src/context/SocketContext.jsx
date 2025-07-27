import React, { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { UserDataContext } from '../context/UserContext';

const SOCKET_SERVER_URL = `${import.meta.env.VITE_BACKEND_URL}`;

export const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef();
  const { user } = useContext(UserDataContext); // ✅ Correctly use context

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
      reconnection: true,
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected:', socketRef.current.id);

      // ✅ Only emit if user exists
      if (user?._id && user?.role) {
        socketRef.current.emit('registerSocket', {
          userId: user._id,
          role: user.role,
        });
      }
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [user]); // ✅ Watches for user

  const sendMessage = (event, data) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    } else {
      console.warn("Socket not connected.");
    }
  };

  return (
    <SocketContext.Provider value={{ socket: socketRef.current , sendMessage}}>
      {children}
    </SocketContext.Provider>
  );
};
