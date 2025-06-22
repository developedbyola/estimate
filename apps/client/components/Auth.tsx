import React from 'react';
import { AuthContext, authReducer } from '@/contexts/authContext';

const Auth = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
  });

  return (
    <AuthContext.Provider value={{ ...state, setAuth: dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export default Auth;
