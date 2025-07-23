import React from 'react';
import { Border } from '@/constants';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks/useThemeColors';
import { TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

const CategoriesLayout = () => {
  const colors = useThemeColors();
  const theme = useTheme();

  return (
    <Stack>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      <Stack.Screen
        name='create'
        options={{
          title: 'Set up category',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                height: 32,
                aspectRatio: 1,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: Border.radius.full,
                backgroundColor: colors.getColor('bg.soft'),
              }}
            >
              <Ionicons
                size={20}
                name='chevron-back'
                color={colors.getColor('icon.strong')}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name='[id]'
        options={{
          title: 'Update category',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                height: 32,
                aspectRatio: 1,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: Border.radius.full,
                backgroundColor: colors.getColor('bg.soft'),
              }}
            >
              <Ionicons
                size={20}
                name='chevron-back'
                color={colors.getColor('icon.strong')}
              />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
};

export default CategoriesLayout;
