// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from "./context/UserContext.jsx";
import  CaptainContext  from "./context/CaptainContext.jsx";
import { SocketProvider } from './context/SocketContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CaptainContext>
    <UserProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <SocketProvider>
        <BrowserRouter>
        <App/>
        </BrowserRouter>
      </SocketProvider>

    </UserProvider>
    </CaptainContext>
  </StrictMode>
);
