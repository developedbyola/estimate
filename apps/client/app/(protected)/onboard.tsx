import React from 'react';
import { Stack } from 'expo-router';
import { Auth } from '@/features/auth';
import { useThemeColors } from '@/hooks/useThemeColors';

const OnboardPage = () => {
  const colors = useThemeColors();

  return (
    <React.Fragment>
      <Stack.Screen
        options={{
          title: 'Onboard',
          headerTitle: 'Onboard',
        }}
      />
      <Auth.Onboard />
    </React.Fragment>
  );
};

export default OnboardPage;
