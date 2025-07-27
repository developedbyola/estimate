import React from 'react';
import { MotiView } from 'moti';
import { Space } from '@/constants';
import { Category } from '../types';
import { useRouter } from 'expo-router';
import { useCategories } from './Provider';
import { Picker } from '@react-native-picker/picker';

import { Button, TouchableOpacity } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { ActivityIndicator, Box, Heading, Scroll, Text } from '@/components';
import { Controller, useFormContext } from 'react-hook-form';

const DefaultEmpty = () => {
  const router = useRouter();

  return (
    <React.Fragment>
      <Text
        leading='sm'
        style={{
          maxWidth: 200,
          textAlign: 'center',
          marginInline: 'auto',
        }}
      >
        No categories found, create one to get started
      </Text>
      <Button
        title='Create category'
        onPress={() => router.navigate('/categories/create')}
      />
    </React.Fragment>
  );
};

const Loader = () => {
  return (
    <React.Fragment>
      <ActivityIndicator />
    </React.Fragment>
  );
};

const Select = () => {
  const form = useFormContext<any>();
  const { categories } = useCategories();

  return (
    <Controller
      name='categoryId'
      control={form.control}
      render={({ field }) => {
        return (
          <Picker
            selectedValue={field.value}
            onValueChange={(itemValue) => field.onChange(itemValue)}
          >
            {categories.map((category) => {
              return (
                <Picker.Item
                  key={category.id}
                  value={category.id}
                  label={`${category.name} ${category.icon}`}
                />
              );
            })}
          </Picker>
        );
      }}
    />
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
    <TouchableOpacity
      onPress={() => {
        router.push({
          params: { id: category.id },
          pathname: '/categories/[id]',
        });
      }}
    >
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 300 }}
        style={{
          gap: 12,
          paddingBlock: 6,
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
    </TouchableOpacity>
  );
};

type ListProps = {
  pickerOnly?: boolean;
  Empty?: React.ReactNode;
};

export const List = ({ pickerOnly = false, Empty }: ListProps) => {
  const { loading, categories } = useCategories();

  if (loading) return <Loader />;
  if (categories.length === 0) return Empty ? Empty : <DefaultEmpty />;

  return (
    <React.Fragment>
      {pickerOnly ? (
        <Select />
      ) : (
        <Scroll
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, paddingBlock: 12 }}
        >
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
      )}
    </React.Fragment>
  );
};
