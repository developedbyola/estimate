import React from 'react';
import { Stack } from 'expo-router';
import { Auth } from '@/features/auth';
import { useThemeColors } from '@/hooks/useThemeColors';

const RegisterPage = () => {
  const colors = useThemeColors();

  return (
    <React.Fragment>
      <Stack.Screen
        options={{
          title: 'Become a member',
          headerStyle: {
            backgroundColor: colors.getColor('bg.soft'),
          },
          headerTitleStyle: {
            color: colors.getColor('text.strong'),
          },
        }}
      />
      <Auth.Register />
    </React.Fragment>
  );
};

export default RegisterPage;
