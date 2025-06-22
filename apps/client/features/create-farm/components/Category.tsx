import React from 'react';
import { Picker } from '@react-native-picker/picker';
import { Controller, useFormContext } from 'react-hook-form';

const Categories = [
  { id: '1', label: 'Crop Farming', value: 'crop-farming' },
  { id: '2', label: 'Livestock', value: 'livestock' },
  { id: '3', label: 'Poultry', value: 'poultry' },
  { id: '4', label: 'Fishery', value: 'fishery' },
  { id: '5', label: 'Mixed Farming', value: 'mixed-farming' },
  { id: '6', label: 'Horticulture', value: 'horticulture' },
  { id: '7', label: 'Bee Keeping', value: 'bee-keeping' },
  { id: '8', label: 'Agroforestry', value: 'agroforestry' },
];

const Category = () => {
  const { control } = useFormContext<{
    category: string;
  }>();

  return (
    <Controller
      name='category'
      control={control}
      render={({ field }) => {
        return (
          <Picker
            selectedValue={field.value}
            onValueChange={(itemValue) => field.onChange(itemValue)}
          >
            {Categories.map((category) => {
              return (
                <Picker.Item
                  key={category.id}
                  value={category.value}
                  label={category.label}
                />
              );
            })}
          </Picker>
        );
      }}
    />
  );
};

export default Category;
