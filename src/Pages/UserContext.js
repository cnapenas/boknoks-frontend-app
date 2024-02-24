import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [usrnme, setUsrnme] = useState(null);

  return (
    <UserContext.Provider value={{ usrnme, setUsrnme }}>
      {children}
    </UserContext.Provider>
  );
};