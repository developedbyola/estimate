import React from 'react';
import { router, Stack } from 'expo-router';
import { Auth } from '@/features/auth';
import { useThemeColors } from '@/hooks/useThemeColors';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LoginPage = () => {
  const colors = useThemeColors();

  return (
    <React.Fragment>
      <Stack.Screen
        options={{
          sheetCornerRadius: 32,
          contentStyle: {
            height: '100%',
            backgroundColor: colors.getColor('bg.base'),
          },
          headerStyle: {
            backgroundColor: colors.getColor('bg.base'),
          },
          headerTitleStyle: {
            color: colors.getColor('text.strong'),
          },
          headerLeft: () => {
            return (
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons
                  size={24}
                  name='chevron-back'
                  color={colors.getColor('icon.strong')}
                />
              </TouchableOpacity>
            );
          },
          headerTitle: 'Sign in',
        }}
      />
      <Auth.Login />
    </React.Fragment>
  );
};

export default LoginPage;
