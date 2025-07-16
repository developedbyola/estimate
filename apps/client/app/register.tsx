import React from 'react';
import { Auth } from '@/features/auth';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

const RegisterPage = () => {
  const colors = useThemeColors();

  return (
    <React.Fragment>
      <Stack.Screen
        options={{
          sheetCornerRadius: 32,
          title: 'Create an account',
          contentStyle: {
            height: '100%',
            backgroundColor: 'red',
          },
          headerStyle: {
            backgroundColor: colors.getColor('bg.base'),
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
