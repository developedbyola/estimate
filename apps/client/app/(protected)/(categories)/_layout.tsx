import React from 'react';
import { Stack } from 'expo-router';

const CategoriesLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name='create'
        options={{ title: 'Set up category', presentation: 'formSheet' }}
      />
    </Stack>
  );
};

export default CategoriesLayout;
