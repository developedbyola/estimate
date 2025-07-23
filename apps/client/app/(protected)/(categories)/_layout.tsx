import React from 'react';
import { router, Stack } from 'expo-router';
import { Button } from 'react-native';

const CategoriesLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name='create'
        options={{
          title: 'Set up category',
          headerLeft: () => (
            <Button
              title='Back'
              onPress={() => router.back()}
            />
          ),
        }}
      />
    </Stack>
  );
};

export default CategoriesLayout;
