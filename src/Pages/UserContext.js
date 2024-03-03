import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [usr, setusr] = useState(null);

  return (
    <UserContext.Provider value={{ usr, setusr }}>
      {children}
    </UserContext.Provider>
  );
};