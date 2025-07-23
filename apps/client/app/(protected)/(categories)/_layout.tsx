import React from 'react';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Border } from '@/constants';

const CategoriesLayout = () => {
  const colors = useThemeColors();

  return (
    <Stack>
      <Stack.Screen
        name='create'
        options={{
          title: 'Set up category',
          headerLeft: () => (
            <Ionicons
              size={20}
              name='chevron-back'
              onPress={() => router.back()}
              color={colors.getColor('icon.inactive')}
              style={{
                height: 32,
                aspectRatio: 1,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: Border.radius.full,
                backgroundColor: colors.getColor('bg.soft'),
              }}
            />
          ),
        }}
      />
    </Stack>
  );
};

export default CategoriesLayout;
