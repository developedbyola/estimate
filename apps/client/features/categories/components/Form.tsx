import React from 'react';
import { Border } from '@/constants';
import Icons from '../constants/Icons';
import { excerpt } from '@/utils/excerpt';
import { Ionicons } from '@expo/vector-icons';
import { Controller, useFormContext } from 'react-hook-form';
import { Box, Text, Field, Heading, RadioGroup, Accordion } from '@/components';

const Name = () => {
  const { control } = useFormContext<{ name: string }>();

  return (
    <Field.Root
      name='name'
      control={control as any}
    >
      <Field.Container>
        <Field.Label>Category name</Field.Label>
        <Field.Row>
          <Field.TextInput placeholder='e.g Maize' />
        </Field.Row>
      </Field.Container>
      <Field.Feedback />
    </Field.Root>
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
    value: 'icon',
    Component: Name,
  },
  {
    Component: Icon,
    name: 'Icon',
    value: 'icon',
  },
];

export const Form = () => {
  return (
    <Accordion.Root
      defaultValue={options[0].value}
      style={{ gap: 4 }}
    >
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
              {/* <Accordion.ItemIcon /> */}
            </Accordion.ItemHeader>
            <Accordion.ItemContent>
              <option.Component />
            </Accordion.ItemContent>
          </Accordion.Item>
        );
      })}
    </Accordion.Root>
  );
};
