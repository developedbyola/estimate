import { Stack } from 'expo-router';
import React from 'react';

const SettingsLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='profile'
        options={{ presentation: 'modal' }}
      />
    </Stack>
  );
};

export default SettingsLayout;
