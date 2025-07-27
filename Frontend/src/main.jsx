import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from "./context/UserContext.jsx";
import CaptainContext from "./context/CaptainContext.jsx";
import { SocketProvider } from './context/SocketContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CaptainContext>
      <UserProvider>
        <SocketProvider> {/* ✅ SocketProvider comes before App */}
          <BrowserRouter>
            <App /> {/* ✅ Render App ONLY ONCE */}
          </BrowserRouter>
        </SocketProvider>
      </UserProvider>
    </CaptainContext>
  </StrictMode>
);
