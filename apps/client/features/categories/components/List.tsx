import React from 'react';
import { MotiView } from 'moti';
import Icons from '../constants/Icons';
import { useRouter } from 'expo-router';
import { useCategories } from './Provider';
import { Border, Space } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useGetCategories } from '../hooks/useGetCategories';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { ActivityIndicator, Box, Heading, Text } from '@/components';

const DefaultEmpty = () => {
  const router = useRouter();
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
      <TouchableOpacity
        style={{
          paddingInline: Space['2xl'],
          paddingVertical: Space['xl'],
          backgroundColor: colors.getColor('bg.strong'),
          borderRadius: Border.radius['full'],
        }}
        onPress={() => {
          // router.push('/(categories)/add');
        }}
      >
        <Text
          size='xl'
          leading='sm'
          weight='medium'
          color='text.base'
        >
          Add category
        </Text>
      </TouchableOpacity>
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

const Item = ({ category, index }: { category: any; index: number }) => {
  const INNER_HEIGHT = 56;
  const OUTER_HEIGHT = 120;
  const router = useRouter();
  const colors = useThemeColors();
  const icon = Icons.find((icon) => icon.id === category.icon)!;

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        router.push('/add-category');
      }}
    >
      <MotiView
        style={{
          width: '100%',
          borderWidth: 1,
          height: OUTER_HEIGHT,
          paddingInline: Space.xl,
          borderRadius: Border.radius['xl'],
          borderColor: colors.getColor('border.soft'),
          backgroundColor: colors.getColor('bg.base'),
          boxShadow: '0px 1px 8px 4px rgba(0, 0, 0, 0.04)',
        }}
        from={{
          translateY: 12,
        }}
        animate={{
          translateY: index * (INNER_HEIGHT - OUTER_HEIGHT),
        }}
        transition={{
          type: 'spring',
          stiffness: 100,
          duration: 1500,
          delay: index * 100,
        }}
      >
        <Box
          style={{
            height: INNER_HEIGHT,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Heading
            size='2xl'
            leading='lg'
            weight='medium'
          >
            {category.name}
          </Heading>
          <Ionicons
            size={24}
            color={icon.normalColor}
            name={icon.icon! as any}
          />
        </Box>
      </MotiView>
    </TouchableWithoutFeedback>
  );
};

type ListProps = {
  Empty?: React.ReactNode;
};

export const List = ({ Empty }: ListProps) => {
  const _ = useGetCategories();
  const { loading, categories } = useCategories();

  if (loading) return <Loader />;
  if (categories.length === 0) return Empty ? Empty : <DefaultEmpty />;

  return (
    <Box>
      {categories.map((category, index) => {
        return (
          <Item
            index={index}
            key={category.id}
            category={category}
          />
        );
      })}
    </Box>
  );
};
