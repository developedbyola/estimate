import React from 'react';
import { Picker } from '@react-native-picker/picker';
import { useCategories } from '@/features/categories';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Controller, useFormContext } from 'react-hook-form';
import { Accordion, Box, Field, Heading, Text } from '@/components';

const Category = () => {
  const { categories } = useCategories();
  const { control } = useFormContext<{
    categoryId: string;
  }>();

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
                  label={category.name}
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

const options = [
  {
    name: 'Name',
    value: 'name',
    content: Name,
  },
  {
    name: 'Size unit',
    value: 'size_unit',
    content: SizeUnit,
  },
  {
    name: 'Size',
    value: 'size',
    content: Size,
  },
  {
    name: 'Location',
    value: 'location',
    content: Location,
  },
  {
    name: 'Category',
    value: 'category',
    content: Category,
  },
];

export const Form = () => {
  return (
    <Accordion.Root style={{ gap: 4 }}>
      {options.map((option, index) => {
        return (
          <Accordion.Item
            key={index}
            value={option.value}
          >
            <Accordion.ItemHeader>
              <Heading
                size='lg'
                leading='sm'
                weight='normal'
                style={{ flex: 1 }}
              >
                {option.name}
              </Heading>
              <Accordion.ItemIcon />
            </Accordion.ItemHeader>
            <Accordion.ItemContent>
              <option.content />
            </Accordion.ItemContent>
          </Accordion.Item>
        );
      })}
    </Accordion.Root>
  );
};
