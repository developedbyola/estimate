import React from 'react';
import { Picker } from '@react-native-picker/picker';
import { useCategories } from '@/features/categories';
import { Controller, useFormContext } from 'react-hook-form';
import {
  Accordion,
  ActivityIndicator,
  Box,
  Field,
  Heading,
  Text,
} from '@/components';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks/useThemeColors';

const Category = () => {
  const colors = useThemeColors();
  const { loading, categories } = useCategories();
  const { control } = useFormContext<{
    categoryId: string;
  }>();

  if (loading) {
    return (
      <Box style={{ alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </Box>
    );
  }

  if (categories.length > 0) {
    return (
      <Box style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons
          size={32}
          name='bookmark'
          color={colors.getColor('icon.inactive')}
        />
        <Text>No categories found</Text>
      </Box>
    );
  }

  return (
    <Controller
      name='categoryId'
      control={control}
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

const Name = () => {
  const { control } = useFormContext<{
    name: string;
  }>();

  return (
    <Field.Root
      name='name'
      control={control as any}
    >
      <Field.Container>
        <Field.Label>Farm Name</Field.Label>
        <Field.Row>
          <Field.TextInput placeholder='Farm name e.g Maize farm' />
        </Field.Row>
      </Field.Container>
      <Field.Feedback />
    </Field.Root>
  );
};

const SizeUnit = () => {
  const { control } = useFormContext<{
    sizeUnit: 'acres' | 'hectares' | 'square meters';
  }>();

  return (
    <Controller
      name='sizeUnit'
      control={control}
      render={({ field }) => {
        return (
          <Picker
            selectedValue={field.value}
            onValueChange={(itemValue) => field.onChange(itemValue)}
          >
            {['Acres', 'Hectares', 'Square meters'].map((unit) => {
              return (
                <Picker.Item
                  key={unit}
                  label={unit}
                  value={unit.toLowerCase()}
                />
              );
            })}
          </Picker>
        );
      }}
    />
  );
};

const Location = () => {
  const { control } = useFormContext<{
    state: string;
    city: string;
    address: string;
  }>();

  return (
    <Box style={{ gap: 8 }}>
      <Field.Root
        name='city'
        control={control as any}
      >
        <Field.Container>
          <Field.Label>City</Field.Label>
          <Field.Row>
            <Field.TextInput placeholder='City e.g Ibadan' />
          </Field.Row>
        </Field.Container>
        <Field.Feedback />
      </Field.Root>
      <Field.Root
        name='state'
        control={control as any}
      >
        <Field.Container>
          <Field.Label>State</Field.Label>
          <Field.Row>
            <Field.TextInput placeholder='State e.g Oyo' />
          </Field.Row>
        </Field.Container>
        <Field.Feedback />
      </Field.Root>
      <Field.Root
        name='address'
        control={control as any}
      >
        <Field.Container>
          <Field.Label>Address</Field.Label>
          <Field.Row>
            <Field.TextInput placeholder='Address e.g Plot 5A, Bodija Street' />
          </Field.Row>
        </Field.Container>
        <Field.Feedback />
      </Field.Root>
    </Box>
  );
};

const Size = () => {
  const { control } = useFormContext<{
    size: string;
    sizeUnit: string;
  }>();

  return (
    <Field.Root
      name='size'
      control={control as any}
    >
      <Field.Container>
        <Field.Label>Farm size</Field.Label>
        <Field.Row>
          <Field.TextInput placeholder='Size e.g 10' />
          <Controller
            name='sizeUnit'
            control={control}
            render={({ field }) => {
              return (
                <Text
                  size='base'
                  leading='sm'
                  color='text.strong'
                  style={{ textTransform: 'capitalize' }}
                >
                  {field.value}
                </Text>
              );
            }}
          />
        </Field.Row>
      </Field.Container>
      <Field.Feedback />
    </Field.Root>
  );
};

const accordions = [
  {
    name: 'Name',
    value: 'name',
    Component: Name,
  },
  {
    name: 'Size unit',
    value: 'size_unit',
    Component: SizeUnit,
  },
  {
    name: 'Size',
    value: 'size',
    Component: Size,
  },
  {
    name: 'Location',
    value: 'location',
    Component: Location,
  },
  {
    name: 'Category',
    value: 'category',
    Component: Category,
  },
];

export const Form = () => {
  return (
    <Accordion.Root
      style={{ gap: 4 }}
      defaultValue={accordions[0].value}
    >
      {accordions.map((accordion, index) => {
        return (
          <Accordion.Item
            key={index}
            value={accordion.value}
          >
            <Accordion.ItemHeader>
              <Heading
                size='lg'
                leading='sm'
                weight='normal'
                style={{ flex: 1 }}
              >
                {accordion.name}
              </Heading>
              <Accordion.ItemIcon />
            </Accordion.ItemHeader>
            <Accordion.ItemContent>
              <accordion.Component />
            </Accordion.ItemContent>
          </Accordion.Item>
        );
      })}
    </Accordion.Root>
  );
};
