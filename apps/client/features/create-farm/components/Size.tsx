import React from 'react';
import { Field, Text } from '@/components';
import { Space, Typography } from '@/constants';
import { useThemeColors } from '@/hooks/useThemeColors';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { Controller, useFormContext } from 'react-hook-form';

const Size = () => {
  const Colors = useThemeColors();
  const { control } = useFormContext<{
    size: string;
    size_unit: string;
  }>();

  return (
    <Field.Root
      name='size'
      control={control as any}
    >
      <Field.Control>
        <Controller
          name='size'
          control={control}
          render={({ field }) => {
            return (
              <BottomSheetTextInput
                value={field.value}
                onBlur={field.onBlur}
                keyboardType='numeric'
                placeholderTextColor={Colors.text.muted}
                placeholder='Farm name e.g Maize farm'
                style={{
                  width: '100%',
                  height: '100%',
                  paddingHorizontal: Space.lg,
                  fontSize: Typography.size.lg,
                }}
                onChangeText={field.onChange}
              />
            );
          }}
        />
        <Field.Float style={{ right: 12 }}>
          <Controller
            name='size_unit'
            control={control}
            render={({ field }) => {
              return (
                <Text
                  size='lg'
                  color='muted'
                  style={{ textTransform: 'capitalize' }}
                >
                  {field.value}
                </Text>
              );
            }}
          />
        </Field.Float>
      </Field.Control>
      <Field.Feedback />
    </Field.Root>
  );
};

export default Size;
