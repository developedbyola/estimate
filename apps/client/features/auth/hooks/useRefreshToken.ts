import React from 'react';
import { useAuth } from '../components/Provider';

export const useRefreshToken = () => {
  const { refetch } = useAuth();

  React.useEffect(() => {
    refetch();
  }, []);

  return {};
};
