import React from 'react';
import { farmSchema } from '../schemas';
import { Ionicons } from '@expo/vector-icons';
import { TouchableHighlight } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Border, Space, Typography } from '@/constants';
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from 'react-hook-form';
import Modal from './shared/Modal';
import Categories from '../constants/Categories';
import { Picker } from '@react-native-picker/picker';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { Action, Box, Field, Heading, Overlay, Text } from '@/components';

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

const options = [
  {
    name: 'Name',
    content: Name,
    snapPoints: ['36%'],
    title: 'What would you call this farmland?',
  },
  {
    name: 'Choose size unit',
    content: SizeUnit,
    snapPoints: ['54%'],
    title: 'What unit is your farm size calculated?',
  },
  {
    name: 'Size',
    content: Size,
    snapPoints: ['36%'],
    title: 'How large is your farmland?',
  },
  {
    name: 'Location',
    content: Location,
    snapPoints: ['42%'],
    title: 'Specify where your farm is located',
  },
  {
    name: 'Category',
    content: Category,
    snapPoints: ['54%'],
    title: "What kind of farm you're running?",
  },
];

type Props = {
  children: React.ReactNode;
};

export const Add = ({ children }: Props) => {
  const Colors = useThemeColors();
  const form = useForm({
    mode: 'all',
    resolver: zodResolver(farmSchema),
    defaultValues: {
      name: 'My farm',
      city: '',
      state: '',
      address: '',
      categoryId: '',
      size: '1',
      size_unit: 'acre',
    },
  });

  return (
    <Overlay.Root>
      <Overlay.SheetTrigger>{children}</Overlay.SheetTrigger>
      <Overlay.Sheet snapPoints={['56%']}>
        <Box
          px='xl'
          my='lg'
        >
          <Heading
            size='2xl'
            leading='lg'
            align='center'
            weight='medium'
            style={{ maxWidth: 200, marginHorizontal: 'auto' }}
          >
            Add new farm to your record
          </Heading>
        </Box>

        <FormProvider {...form}>
          <Box
            my='xl'
            px='xl'
            mx='auto'
            style={{
              flex: 1,
              width: '100%',
              maxWidth: 320,
            }}
          >
            <Box
              bg='foreground'
              style={{
                overflow: 'hidden',
                borderRadius: Border.radius.xl,
              }}
            >
              {options.map((option, index) => {
                return (
                  <Modal
                    key={index}
                    title={option.title}
                    content={<option.content />}
                    snapPoints={option.snapPoints}
                  >
                    <TouchableHighlight underlayColor={Colors.others.surface}>
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
                        <Box
                          style={{
                            width: 20,
                            aspectRatio: '1/1',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: Border.radius.xl,
                            backgroundColor: Colors.others.surface,
                          }}
                        >
                          <Ionicons
                            size={16}
                            name='add'
                            color={Colors.others.inverted}
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
            <Action.Label>Create new farm</Action.Label>
          </Action.Root>
        </Box>
      </Overlay.Sheet>
    </Overlay.Root>
  );
};
