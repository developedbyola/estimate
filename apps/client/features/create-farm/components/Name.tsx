import React from 'react';
import { Field } from '@/components';
import { Space, Typography } from '@/constants';
import { useThemeColors } from '@/hooks/useThemeColors';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { Controller, useFormContext } from 'react-hook-form';

const Name = () => {
  const Colors = useThemeColors();
  const { control } = useFormContext<{
    name: string;
  }>();

  return (
    <Field.Root
      name='name'
      control={control as any}
    >
      <Field.Control>
        <Controller
          name='name'
          control={control}
          render={({ field }) => {
            return (
              <BottomSheetTextInput
                value={field.value}
                onBlur={field.onBlur}
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
      </Field.Control>
      <Field.Feedback />
    </Field.Root>
  );
};

export default Name;
