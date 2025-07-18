import React from 'react';
import { Redirect } from 'expo-router';
import { Users } from '@/features/users';

const IndexPage = () => {
  const { user } = Users.useUser();

  if (user?.isOnboarded === false) {
    return <Redirect href='/onboard' />;
  }

  return <Redirect href='/(protected)/(tabs)/home' />;
};

export default IndexPage;
