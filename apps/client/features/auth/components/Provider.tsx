import React from 'react';
import { auth } from '@/lib/auth';

type AuthContext = ReturnType<typeof auth.useSession>;
export const authContext = React.createContext<AuthContext | null>(null);

export const useAuth = () => {
  const context = React.useContext(authContext);
  if (!context) {
    throw new Error('useAuth must be used within Auth.Provider component');
  }
  return context;
};

type Props = React.PropsWithChildren;
export const Provider = ({ children }: Props) => {
  const value = auth.useSession();

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};
