import React from 'react';
import { useGetUser } from '../hooks/useGetUser';

export const Get = ({ children }: { children: React.ReactNode }) => {
  const _ = useGetUser();

  return children;
};
