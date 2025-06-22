import React from 'react';
import { Field } from '@/components';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { Controller, useFormContext } from 'react-hook-form';
import { Space, Typography } from '@/constants';
import { useThemeColors } from '@/hooks/useThemeColors';

const Title = () => {
  const Colors = useThemeColors();
  const { control } = useFormContext<{ title: string }>();

  return (
    <Controller
      name='title'
      control={control}
      render={({ field }) => {
        return (
          <Field.Root
            name='title'
            control={control as any}
          >
            <Field.Control>
              <BottomSheetTextInput
                value={field.value}
                onBlur={field.onBlur}
                placeholder='e.g Maize'
                onChangeText={field.onChange}
                placeholderTextColor={Colors.text.muted}
                style={{
                  width: '100%',
                  height: '100%',
                  paddingHorizontal: Space.lg,
                  fontSize: Typography.size.lg,
                }}
              />
            </Field.Control>
            <Field.Feedback />
          </Field.Root>
        );
      }}
    />
  );
};

export default Title;
