import React, { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = `${import.meta.env.VITE_BACKEND_URL}`; // Change to your backend server URL/port

export const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
      reconnection: true,
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected:', socketRef.current.id);
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
  }, []);

  // Send message to a specific event
  const sendMessage = (eventName, data) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit(eventName, data);
    }
  };

  // Listen for messages from a specific event
  const receiveMessage = (eventName, callback) => {
    if (socketRef.current) {
      socketRef.current.on(eventName, callback);
      // Optionally return a cleanup function
      return () => socketRef.current.off(eventName, callback);
    }
    return () => {};
  };

  return (
    <SocketContext.Provider value={{ sendMessage, receiveMessage, socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};
