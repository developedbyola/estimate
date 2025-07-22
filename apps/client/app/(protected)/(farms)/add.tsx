import React from 'react';
import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';
import { Farms } from '@/features/farms';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

const AddFarmPage = () => {
  const colors = useThemeColors();
  const router = useRouter();

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
          headerTitle: 'Add farm',
        }}
      />
      <Farms.Add />
    </React.Fragment>
  );
};

export default AddFarmPage;
