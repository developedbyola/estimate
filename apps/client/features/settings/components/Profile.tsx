import { Box, Scroll } from '@/components';
import { Stack } from 'expo-router';
import React from 'react';

export const Profile = () => {
  return (
    <React.Fragment>
      <Stack.Screen />
      <Scroll>
        <Box></Box>
      </Scroll>
    </React.Fragment>
  );
};
