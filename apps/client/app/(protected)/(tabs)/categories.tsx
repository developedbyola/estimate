import React from 'react';
import { Space } from '@/constants';
import { Border } from '@/constants';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { Categories } from '@/features/categories';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Box, Heading, Scroll, Safe } from '@/components';

const CategoriesPage = () => {
  const colors = useThemeColors();
  const router = useRouter();

  return (
    <Safe
      bg='bg.subtle'
      style={{ flex: 1 }}
    >
      <Box
        px='3xl'
        mt='5xl'
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Heading size='4xl'>Categories</Heading>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            router.push('/(protected)/(categories)/create');
          }}
        >
          <Box
            bg='bg.strong'
            style={{ padding: 2, borderRadius: Border.radius.full }}
          >
            <Ionicons
              size={20}
              name='add'
              color={colors.getColor('icon.base')}
            />
          </Box>
        </TouchableOpacity>
      </Box>

      <Box
        px='xl'
        style={{ flex: 1 }}
      >
        <Categories.List />
      </Box>
    </Safe>
  );
};

export default CategoriesPage;
