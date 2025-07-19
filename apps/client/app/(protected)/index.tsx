import React from 'react';
import { Redirect } from 'expo-router';
import { Auth } from '@/features/auth';

const IndexPage = () => {
  const { user } = Auth.useAuth();

  if (user?.isOnboarded === false) {
    return <Redirect href='/onboard' />;
  }

  return <Redirect href='/(protected)/(tabs)/home' />;
};

export default IndexPage;
