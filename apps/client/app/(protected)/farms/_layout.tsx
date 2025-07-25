import React from 'react';
import { Stack } from 'expo-router';
import { Border } from '@/constants';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

const FarmsLayout = () => {
  const colors = useThemeColors();
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name='create'
        options={{
          title: 'Add farm',
          contentStyle: {
            backgroundColor: colors.getColor('bg.base'),
          },
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
        name='update'
        options={{
          title: 'Update',
          contentStyle: {
            backgroundColor: colors.getColor('bg.base'),
          },
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
        name='view'
        options={{
          title: 'Farm',
          contentStyle: {
            backgroundColor: colors.getColor('bg.base'),
          },
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

export default FarmsLayout;
