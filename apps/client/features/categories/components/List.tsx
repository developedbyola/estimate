import React from 'react';
import { MotiView } from 'moti';
import Icons from '../constants/Icons';
import { useRouter } from 'expo-router';
import { useCategories } from './Provider';
import { Border, Space } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useGetCategories } from '../hooks/useGetCategories';
import { Button, TouchableWithoutFeedback } from 'react-native';
import { ActivityIndicator, Box, Gradient, Heading, Text } from '@/components';

const Empty = () => {
  const router = useRouter();
  const colors = useThemeColors();

  return (
    <Gradient
      colors={[
        colors.getColor('primary.darker'),
        colors.getColor('primary.subtle'),
      ]}
      px='xl'
      py='xl'
      style={{
        gap: Space.base,
        alignItems: 'flex-start',
        borderRadius: Border.radius['2xl'],
      }}
    >
      <Box
        bg='primary.base'
        style={{
          width: 48,
          aspectRatio: '1/1',
          alignItems: 'center',
          borderRadius: '50%',
          justifyContent: 'center',
        }}
      >
        <Ionicons
          size={24}
          name='albums-outline'
          color={colors.getColor('icon.strong')}
        />
      </Box>
      <Box style={{ paddingInline: Space.base }}>
        <Heading
          size='2xl'
          leading='lg'
          weight='medium'
          style={{ marginTop: Space['xl'] }}
        >
          New
        </Heading>

        <Text
          size='lg'
          leading='base'
          color='text.strong'
          style={{ marginTop: Space.sm }}
        >
          No categories found. Click the button below to add a new category.
        </Text>
      </Box>

      <Button
        title='Add category'
        color={colors.getColor('text.strong')}
        onPress={() => router.push('/add-category')}
      />
    </Gradient>
  );
};

const Loader = () => {
  return <ActivityIndicator />;
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

export const List = () => {
  const _ = useGetCategories();
  const { loading, categories } = useCategories();

  if (loading) return <Loader />;
  if (categories.length === 0) return <Empty />;

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
