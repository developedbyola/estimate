import React from 'react';
import { Action, AuthContext, authReducer } from '@/contexts/authContext';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(authReducer, {
    user: null,
    session: null,
    isAuthenticated: false,
  });

  const setAuth = React.useCallback(async (action: Action) => {
    dispatch(action);
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
