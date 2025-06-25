import React from 'react';
import { Add } from './Add';
import { MotiView } from 'moti';
import Icons from '../constants/Icons';
import { useCategories } from './Provider';
import { Border, Space } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { Alert, Button, TouchableWithoutFeedback } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { ActivityIndicator, Box, Heading, Text } from '@/components';

const Empty = () => {
  const colors = useThemeColors();

  return (
    <Box
      px='lg'
      py='xl'
      bg='bg.subtle'
      style={{
        gap: Space.base,
        flexDirection: 'row',
        borderRadius: Border.radius['lg'],
      }}
    >
      <Box
        bg='success.base'
        style={{
          width: 28,
          aspectRatio: '1/1',
          alignItems: 'center',
          borderRadius: '50%',
          justifyContent: 'center',
        }}
      >
        <Ionicons
          name='add'
          size={24}
          color={colors.getColor('icon.base')}
        />
      </Box>

      <Box style={{ alignItems: 'flex-start', flex: 1 }}>
        <Text
          size='lg'
          leading='base'
          color='text.strong'
          style={{ paddingInline: Space.base }}
        >
          Get started by creating your first category. Click the button below to
          add a new category.
        </Text>

        <Add>
          <Button
            title='Add category'
            color={colors.getColor('success.base')}
          />
        </Add>
      </Box>
    </Box>
  );
};

const Loader = () => {
  return <ActivityIndicator />;
};

const Item = ({ category, index }: { category: any; index: number }) => {
  const INNER_HEIGHT = 48;
  const OUTER_HEIGHT = 120;
  const colors = useThemeColors();
  const icon = Icons.find((icon) => icon.id === category.icon)!;

  return (
    <Add category={category}>
      <TouchableWithoutFeedback>
        <MotiView
          style={{
            width: '100%',
            height: OUTER_HEIGHT,
            paddingInline: Space.xl,
            borderRadius: Border.radius['2xl'],
            borderWidth: 1,
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
    </Add>
  );
};

export const List = () => {
  const { categories, loading, error, refetch } = useCategories();

  if (loading) return <Loader />;

  if (categories.length === 0) return <Empty />;

  if (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Something went wrong';

    Alert.alert('Server Error', errorMessage, [
      { text: 'Cancel' },
      {
        text: 'Retry',
        onPress: () => refetch?.().catch(console.error),
      },
    ]);
  }

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
