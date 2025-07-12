// UserContext.jsx
import React, { createContext, useState } from 'react';

// Create the context
export const userDataContext = createContext();

// Create a provider component
const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    fullName: {
      firstName: '',
      lastName: ''
    },
    email: ''
  });

  return (
    <userDataContext.Provider value={{ user, setUser }}>
      {children}
    </userDataContext.Provider>
  );
};

export default UserProvider;
