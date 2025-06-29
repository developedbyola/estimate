import React from 'react';
import { Stack } from 'expo-router';
import { Auth } from '@/features/auth';
import { useThemeColors } from '@/hooks/useThemeColors';

const LoginPage = () => {
  const colors = useThemeColors();

  return (
    <React.Fragment>
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: colors.getColor('bg.soft'),
          },
          headerTitleStyle: {
            color: colors.getColor('text.strong'),
          },
          headerTitle: 'Sign in',
        }}
      />
      <Auth.Login />
    </React.Fragment>
  );
};

export default LoginPage;
