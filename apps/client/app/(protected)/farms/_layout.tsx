import React from 'react';
import { Stack } from 'expo-router';

const FarmsLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name='add'
        options={{ presentation: 'formSheet' }}
      />
      <Stack.Screen
        name='edit'
        options={{ title: 'Edit farm', presentation: 'formSheet' }}
      />
    </Stack>
  );
};

export default FarmsLayout;
