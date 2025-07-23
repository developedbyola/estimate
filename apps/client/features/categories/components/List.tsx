import React from 'react';
import { MotiView } from 'moti';
import { Space } from '@/constants';
import { useRouter } from 'expo-router';
import { useCategories } from './Provider';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks/useThemeColors';
import { TouchableWithoutFeedback } from 'react-native';
import { useGetCategories } from '../hooks/useGetCategories';
import { ActivityIndicator, Box, Heading, Scroll } from '@/components';
import { Category } from '../types';

const DefaultEmpty = () => {
  const colors = useThemeColors();

  return (
    <Box
      px='xl'
      style={{
        gap: Space.xl,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
      }}
    >
      <Ionicons
        size={48}
        name='remove-circle'
        color={colors.getColor('icon.inactive')}
      />
      <Heading
        size='xl'
        leading='sm'
        weight='medium'
        color='text.soft'
      >
        No categories
      </Heading>
    </Box>
  );
};

const Loader = () => {
  return (
    <Box
      px='xl'
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
    >
      <ActivityIndicator />
    </Box>
  );
};

const Item = ({
  category,
  isLastItem,
}: {
  category: Category;
  isLastItem: boolean;
}) => {
  const router = useRouter();
  const colors = useThemeColors();

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        // router.push('/add-category');
      }}
    >
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'timing', duration: 300 }}
        style={{
          gap: 12,
          paddingBlock: 4,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderBottomWidth: isLastItem ? 0 : 1,
          borderBottomColor: colors.getColor('border.subtle'),
        }}
      >
        <Heading
          size='xl'
          weight='medium'
        >
          {category.name}
        </Heading>
        <MotiView
          style={{
            height: 40,
            aspectRatio: 1,
            borderRadius: 24,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.getColor('bg.soft'),
          }}
        >
          <Heading style={{ fontSize: 24, lineHeight: 32 }}>
            {category.icon}
          </Heading>
        </MotiView>
      </MotiView>
    </TouchableWithoutFeedback>
  );
};

type ListProps = {
  Empty?: React.ReactNode;
};

export const List = ({ Empty }: ListProps) => {
  const _ = useGetCategories();
  const colors = useThemeColors();
  const { loading, categories } = useCategories();

  if (loading) return <Loader />;
  if (categories.length === 0) return Empty ? Empty : <DefaultEmpty />;

  return (
    <Scroll style={{ flex: 1 }}>
      {categories.map((category, index) => {
        return (
          <Item
            key={category.id}
            category={category}
            isLastItem={index === categories.length - 1}
          />
        );
      })}
    </Scroll>
  );
};
