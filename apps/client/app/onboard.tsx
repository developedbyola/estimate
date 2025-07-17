import React from 'react';
import { Stack } from 'expo-router';
import { Users } from '@/features/users';

const OnboardPage = () => {
  return (
    <React.Fragment>
      <Stack.Screen />
      <Users.Onboard />
    </React.Fragment>
  );
};

export default OnboardPage;
