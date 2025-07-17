import { Users } from '@/features/users';
import { Stack } from 'expo-router';
import React from 'react';

const OnboardPage = () => {
  return (
    <React.Fragment>
      <Stack.Screen />
      <Users.Onboard />
    </React.Fragment>
  );
};

export default OnboardPage;
