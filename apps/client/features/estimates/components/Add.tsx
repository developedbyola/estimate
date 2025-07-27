import { Stack } from 'expo-router';
import React from 'react';
import { Button } from 'react-native';

export const Add = () => {
  return (
    <React.Fragment>
      <Stack.Screen
        options={{
          headerRight: () => {
            return <Button title='Edit' />;
          },
        }}
      />
    </React.Fragment>
  );
};
