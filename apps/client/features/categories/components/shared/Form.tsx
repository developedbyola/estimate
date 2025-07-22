import React from 'react';
import Modal from './Modal';
import Icons from '../../constants/Icons';
import { excerpt } from '@/utils/excerpt';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Border, Space, Typography } from '@/constants';
import { useWatch, Controller, useFormContext } from 'react-hook-form';
import { Box, Text, Field, Heading, RadioGroup } from '@/components';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

const Name = () => {
  const colors = useThemeColors();
  const { control } = useFormContext<{ name: string }>();

  return (
    <Controller
      name='name'
      control={control}
      render={({ field }) => {
        return (
          <Field.Root
            name='name'
            control={control as any}
          >
            <Field.Content>
              <BottomSheetTextInput
                value={field.value}
                onBlur={field.onBlur}
                placeholder='e.g Maize'
                onChangeText={field.onChange}
                placeholderTextColor={colors.getColor('text.inactive')}
                style={{
                  width: '100%',
                  height: '100%',
                  paddingHorizontal: Space.lg,
                  fontSize: Typography.size.lg,
                  color: colors.getColor('text.strong'),
                }}
              />
            </Field.Content>
            <Field.Feedback />
          </Field.Root>
        );
      }}
    />
  );
};

const Icon = () => {
  const { control } = useFormContext<{ title: string; icon: string }>();

  return (
    <Controller
      name='icon'
      control={control}
      render={({ field }) => {
        return (
          <RadioGroup.Root
            mt='base'
            value={field.value}
            style={{ flexDirection: 'row', gap: '1.5%', flexWrap: 'wrap' }}
            onValueChange={({ value }) => field.onChange(value)}
          >
            {Icons.map((item) => {
              return (
                <Box
                  key={item.id}
                  style={{
                    gap: 2,
                    width: '18.5%',
                    alignItems: 'center',
                  }}
                >
                  <RadioGroup.Item
                    value={item.id}
                    style={{
                      width: 48,
                      aspectRatio: '1/1',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: item.lightColor,
                      borderRadius: Border.radius.full,
                    }}
                  >
                    <Ionicons
                      size={24}
                      name={item.icon as any}
                      color={item.normalColor}
                    />
                    <RadioGroup.Indicator
                      style={{
                        width: '100%',
                        height: '100%',
                        borderWidth: 2,
                        borderStyle: 'solid',
                        borderColor: item.normalColor,
                        borderRadius: Border.radius.full,
                        alignItems: 'flex-end',
                      }}
                      value={item.id}
                    >
                      <Ionicons
                        size={20}
                        color={item.normalColor}
                        name='checkmark-circle'
                        style={{
                          top: -4,
                          right: -6,
                          position: 'absolute',
                          backgroundColor: 'white',
                          borderRadius: Border.radius.full,
                        }}
                      />
                    </RadioGroup.Indicator>
                  </RadioGroup.Item>
                  <Text
                    size='2xs'
                    leading='xs'
                    align='center'
                    weight='medium'
                    style={{ textTransform: 'capitalize' }}
                  >
                    {excerpt(item.icon, 6)}
                  </Text>
                </Box>
              );
            })}
            <Box style={{ paddingBottom: 310 }} />
          </RadioGroup.Root>
        );
      }}
    />
  );
};

const options = [
  {
    name: 'Name',
    content: Name,
    snapPoints: ['36%'],
    headingText: 'What would you like to call this category?',
  },
  {
    content: Icon,
    snapPoints: ['80%'],
    name: 'Express with icon',
    headingText: 'Express your farm category with an icon',
  },
];

const Fields = () => {
  const colors = useThemeColors();
  const formContext = useFormContext<{ name: string; icon: string }>();
  const values = useWatch({ control: formContext.control });

  const icon = Icons.find((icon) => icon.id === values.icon);

  return (
    <Box px='lg'>
      {options.map((option, index) => {
        return (
          <Modal
            key={index}
            content={<option.content />}
            snapPoints={option.snapPoints}
            headingText={option.headingText}
          >
            <TouchableOpacity activeOpacity={0.7}>
              <Box
                px='lg'
                pt='xl'
                pb='base'
                style={{
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  flexDirection: 'row',
                  borderColor: colors.getColor('border.soft'),
                  borderBottomWidth: options.length - 1 === index ? 0 : 1,
                }}
              >
                <Heading
                  size='lg'
                  leading='sm'
                  weight='normal'
                  style={{ flex: 1 }}
                >
                  {option.name}
                </Heading>

                <Ionicons
                  size={20}
                  name='chevron-forward'
                  color={colors.getColor('icon.inactive')}
                />

                <Box style={{ width: '100%', marginTop: Space['xl'] }}>
                  {index === 1 ? (
                    <Box
                      style={{
                        width: 24,
                        aspectRatio: '1/1',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: Border.radius.full,
                        backgroundColor: icon?.lightColor,
                      }}
                    >
                      <Ionicons
                        size={16}
                        color={icon?.normalColor}
                        name={icon?.icon || ('' as any)}
                      />
                    </Box>
                  ) : null}
                  {index === 0 ? (
                    <Text
                      size='base'
                      leading='sm'
                      color='text.inactive'
                    >
                      {values.name || 'Enter a name to see it here'}
                    </Text>
                  ) : null}
                </Box>
              </Box>
            </TouchableOpacity>
          </Modal>
        );
      })}
    </Box>
  );
};

export const Form = () => {
  return (
    <Box
      bg={'bg.base'}
      style={{ flex: 1 }}
    >
      <Box mt='2xl'>
        <Fields />
      </Box>
    </Box>
  );
};
