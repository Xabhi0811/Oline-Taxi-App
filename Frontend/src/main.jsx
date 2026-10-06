import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from "./context/UserContext.jsx";
import CaptainContext from "./context/CaptainContext.jsx";
import { SocketProvider } from './context/SocketContext.jsx';
import axios from 'axios';

axios.defaults.timeout = 10000;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CaptainContext>
      <UserProvider>
        <BrowserRouter>
          <SocketProvider>
            <App /> {/* ✅ Render App ONLY ONCE */}
          </SocketProvider>
        </BrowserRouter>
      </UserProvider>
    </CaptainContext>
  </StrictMode>
);
