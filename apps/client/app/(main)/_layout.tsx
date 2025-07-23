import { Stack } from 'expo-router';
import React from 'react';

const MainLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{ title: 'Home', headerShown: false }}
      />
    </Stack>
  );
};

export default MainLayout;
