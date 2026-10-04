import { createContext, useContext } from 'react';

export const UserDataContext = createContext();
export const CaptainDataContext = createContext();
export const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);
