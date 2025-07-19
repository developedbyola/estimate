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
          headerStyle: {
            backgroundColor: colors.getColor('bg.base'),
          },
          headerTitleStyle: {
            color: colors.getColor('text.strong'),
          },
          contentStyle: {
            height: '100%',
            backgroundColor: colors.getColor('bg.base'),
          },
        }}
      />
      <Auth.Onboard />
    </React.Fragment>
  );
};

export default OnboardPage;
