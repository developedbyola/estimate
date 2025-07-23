import React from 'react';
import EmojiPicker from 'rn-emoji-keyboard';
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
  const { control } = useFormContext<{ icon: string }>();

  return (
    <Controller
      name='icon'
      control={control}
      render={({ field }) => {
        return (
          <Box style={{ minHeight: 400 }}>
            <EmojiPicker
              open={true}
              onClose={() => {}}
              onEmojiSelected={(value) => {
                field.onChange(value);
              }}
            />
          </Box>
        );
      }}
    />
  );
};

const options = [
  {
    name: 'Name',
    value: 'name',
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
              <Accordion.ItemIcon />
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
