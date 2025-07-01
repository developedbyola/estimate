import React from 'react';
import { Space } from '@/constants';
import { Border } from '@/constants';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { Categories } from '@/features/categories';
import { useCategories } from '@/features/categories';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Box, Heading, Scroll, Safe } from '@/components';

const CategoriesPage = () => {
  const colors = useThemeColors();
  const router = useRouter();
  const { setCategories } = useCategories();

  return (
    <React.Fragment>
      <Safe
        bg='bg.subtle'
        style={{ flex: 1 }}
      >
        <Scroll
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <Box
            px='xl'
            mt='5xl'
          >
            <Heading size='4xl'>Categories</Heading>
          </Box>

          <Box
            px='3xl'
            mt='4xl'
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Heading
              size='lg'
              leading='base'
            >
              Recent
            </Heading>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                router.push('/add-category');
                setCategories({
                  type: 'SET_CATEGORY',
                  payload: { category: null },
                });
              }}
            >
              <Box
                bg='bg.base'
                style={{ padding: 6, borderRadius: Border.radius.full }}
              >
                <Ionicons
                  size={14}
                  name='pencil'
                  color={colors.getColor('icon.inactive')}
                />
              </Box>
            </TouchableOpacity>
          </Box>

          <Box
            px='xl'
            style={{ marginTop: Space['xl'] }}
          >
            <Categories.List />
          </Box>
        </Scroll>
      </Safe>
    </React.Fragment>
  );
};

export default CategoriesPage;
