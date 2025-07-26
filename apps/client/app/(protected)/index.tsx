import React from 'react';
import { Redirect } from 'expo-router';
import { Auth } from '@/features/auth';

const IndexPage = () => {
  const { data: session } = Auth.useAuth();

  if (session?.user.name === 'null') {
    return <Redirect href='/onboard' />;
  }

  return <Redirect href='/(protected)/(tabs)' />;
};

export default IndexPage;
