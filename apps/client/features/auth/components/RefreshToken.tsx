import React from 'react';
import { useRefreshToken } from '../hooks/useRefreshToken';

type Props = {
  children: React.ReactNode;
};

export const RefreshToken = ({ children }: Props) => {
  useRefreshToken();

  return children;
};
