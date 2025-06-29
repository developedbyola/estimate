import React from 'react';
import { App } from '@/components';
import { Stack } from 'expo-router';
import { Auth } from '@/features/auth';
import { useThemeColors } from '@/hooks/useThemeColors';

const Stacks = () => {
  const { auth } = Auth.useAuth();
  const colors = useThemeColors();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.getColor('bg.base'),
        },
        headerTitleStyle: { fontWeight: 'bold' },
        headerTintColor: colors.getColor('primary.base'),
      }}
    >
      <Stack.Protected guard={auth.isAuthenticated}>
        {/* authenticated screens */}
        <Stack.Screen
          name='(tabs)'
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='farm'
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name='estimate'
          options={{
            presentation: 'modal',
          }}
        />
      </Stack.Protected>
      {/* unauthenticated screens */}
      <Stack.Screen
        name='index'
        options={{
          title: 'Onboard',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='login'
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name='register'
        options={{
          presentation: 'modal',
        }}
      />
    </Stack>
  );
};

const Layout = () => {
  return (
    <App>
      <Stacks />
    </App>
  );
};

export default Layout;
