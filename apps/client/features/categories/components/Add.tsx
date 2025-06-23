import React from 'react';
import { Border, Space, Typography } from '@/constants';
import Icons from '../constants/Icons';
import { excerpt } from '@/utils/excerpt';
import { categorySchema } from '../schemas';
import { Ionicons } from '@expo/vector-icons';
import Modal from './shared/Modal';
import { FlatList, TouchableHighlight } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { useThemeColors } from '@/hooks/useThemeColors';
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import {
  Box,
  Action,
  Heading,
  Overlay,
  Text,
  Field,
  RadioGroup,
} from '@/components';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

const Title = () => {
  const colors = useThemeColors();
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
                placeholderTextColor={colors.getColor('text.inactive')}
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

const Icon = () => {
  const { control } = useFormContext<{ title: string; icon: string }>();

  return (
    <Controller
      name='icon'
      control={control}
      render={({ field }) => {
        return (
          <RadioGroup.Root
            pb='10xl'
            value={field.value}
            style={{ alignItems: 'center' }}
            onValueChange={({ value }) => field.onChange(value)}
          >
            <FlatList
              data={Icons}
              scrollEnabled
              numColumns={4}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <Box
                  key={item.id}
                  style={{
                    gap: 2,
                    padding: 6,
                    width: '25%',
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
                      borderRadius: Border.radius['xl'],
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
                        borderRadius: Border.radius['xl'],
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
              )}
            />
          </RadioGroup.Root>
        );
      }}
    />
  );
};

type Props = {
  children: React.ReactNode;
};

const options = [
  {
    name: 'Title',
    content: Title,
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

export const Add = ({ children }: Props) => {
  const colors = useThemeColors();
  const form = useForm({
    mode: 'all',
    resolver: zodResolver(categorySchema),
    defaultValues: { title: '', icon: Icons[0].id },
  });

  const values = useWatch({ control: form.control });
  const icon = Icons.find((icon) => icon.id === values.icon);

  return (
    <Overlay.Root>
      <Overlay.SheetTrigger>{children}</Overlay.SheetTrigger>
      <Overlay.Sheet
        snapPoints={['40%']}
        style={{ justifyContent: 'space-between' }}
      >
        <Box
          my='lg'
          px='xl'
        >
          <Heading
            size='2xl'
            align='center'
            leading='xl'
            weight='medium'
            style={{ maxWidth: 240, marginHorizontal: 'auto' }}
          >
            Sort your farms meaningfully.
          </Heading>
        </Box>

        <FormProvider {...form}>
          <Box
            my='2xl'
            px='xl'
            mx='auto'
            style={{ maxWidth: 320, width: '100%' }}
          >
            <Box
              bg='bg.soft'
              style={{
                overflow: 'hidden',
                borderRadius: Border.radius.xl,
              }}
            >
              {options.map((option, index) => {
                return (
                  <Modal
                    key={index}
                    content={<option.content />}
                    snapPoints={option.snapPoints}
                    headingText={option.headingText}
                  >
                    <TouchableHighlight
                      underlayColor={colors.getColor('bg.subtle')}
                    >
                      <Box
                        px='lg'
                        style={{
                          height: 44,
                          alignItems: 'center',
                          flexDirection: 'row',
                          borderColor: 'white',
                          borderBottomWidth:
                            options.length - 1 === index ? 0 : 1.5,
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
                        {index === 1 ? (
                          <Box
                            style={{
                              width: 24,
                              aspectRatio: '1/1',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: Border.radius.base,
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
                            size='lg'
                            leading='sm'
                            color='text.inactive'
                          >
                            {excerpt(values.title || 'No title', 12)}
                          </Text>
                        ) : null}

                        <Box
                          style={{
                            width: 20,
                            aspectRatio: '1/1',
                            alignItems: 'center',
                            marginLeft: Space.lg,
                            justifyContent: 'center',
                            borderRadius: Border.radius.xl,
                            backgroundColor: colors.getColor('bg.subtle'),
                          }}
                        >
                          <Ionicons
                            size={16}
                            name='add'
                            color={colors.getColor('icon.base')}
                          />
                        </Box>
                      </Box>
                    </TouchableHighlight>
                  </Modal>
                );
              })}
            </Box>
          </Box>
        </FormProvider>

        <Box
          px='xl'
          pb='5xl'
          mx='auto'
          style={{ maxWidth: 320, width: '100%' }}
        >
          <Action.Root>
            <Action.Label>Create</Action.Label>
          </Action.Root>
        </Box>
      </Overlay.Sheet>
    </Overlay.Root>
  );
};
