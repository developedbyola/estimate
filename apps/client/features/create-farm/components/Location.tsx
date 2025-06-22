import React from 'react';
import { Box, Field } from '@/components';
import { Border, Space, Typography } from '@/constants';
import { useThemeColors } from '@/hooks/useThemeColors';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { Controller, useFormContext } from 'react-hook-form';

const Location = () => {
  const Colors = useThemeColors();
  const { control } = useFormContext<{
    state: string;
    city: string;
    address: string;
  }>();

  return (
    <Box
      mx='auto'
      bg='foreground'
      style={{
        flexWrap: 'wrap',
        overflow: 'hidden',
        flexDirection: 'row',
        borderRadius: Border.radius['lg'],
      }}
    >
      <Field.Root
        name='city'
        control={control as any}
        style={{
          width: '50%',
          borderRightWidth: 0.75,
          borderBottomWidth: 0.75,
          borderColor: Colors.others.background,
        }}
      >
        <Field.Control style={{ backgroundColor: 'transparent' }}>
          <Controller
            name='city'
            control={control}
            render={({ field }) => {
              return (
                <BottomSheetTextInput
                  value={field.value}
                  onBlur={field.onBlur}
                  placeholderTextColor={Colors.text.muted}
                  placeholder='City e.g Ibadan'
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
      </Field.Root>
      <Field.Root
        name='state'
        style={{
          width: '50%',
          borderLeftWidth: 0.75,
          borderBottomWidth: 0.75,
          borderColor: Colors.others.background,
        }}
        control={control as any}
      >
        <Field.Control>
          <Controller
            name='state'
            control={control}
            render={({ field }) => {
              return (
                <BottomSheetTextInput
                  value={field.value}
                  onBlur={field.onBlur}
                  placeholder='State e.g Oyo'
                  placeholderTextColor={Colors.text.muted}
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
      </Field.Root>
      <Field.Root
        name='address'
        style={{
          borderTopWidth: 0.75,
          borderColor: Colors.others.background,
        }}
        control={control as any}
      >
        <Field.Control>
          <Controller
            name='address'
            control={control}
            render={({ field }) => {
              return (
                <BottomSheetTextInput
                  value={field.value}
                  onBlur={field.onBlur}
                  placeholderTextColor={Colors.text.muted}
                  placeholder='Address e.g Plot 5A, Bodija Street'
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
      </Field.Root>
    </Box>
  );
};

export default Location;
