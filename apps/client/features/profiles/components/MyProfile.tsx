import React from 'react';
import { useGetMyProfile } from '../hooks/useGetMyProfile';

export const MyProfile = ({ children }: { children: React.ReactNode }) => {
  useGetMyProfile();

  return children;
};
