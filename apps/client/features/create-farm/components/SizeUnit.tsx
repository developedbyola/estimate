import React from 'react';
import { Picker } from '@react-native-picker/picker';
import { Controller, useFormContext } from 'react-hook-form';

const SizeUnit = () => {
  const { control } = useFormContext<{
    size: number;
    size_unit: 'acre' | 'hectare';
  }>();

  return (
    <Controller
      name='size_unit'
      control={control}
      render={({ field }) => {
        return (
          <Picker
            selectedValue={field.value}
            onValueChange={(itemValue) => field.onChange(itemValue)}
          >
            <Picker.Item
              value={'acre'}
              label='Acre'
            />
            <Picker.Item
              value={'hectare'}
              label='Hectare'
            />
          </Picker>
        );
      }}
    />
  );
};

export default SizeUnit;
