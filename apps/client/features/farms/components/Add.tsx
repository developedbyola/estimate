import React from 'react';
import Modal from './shared/Modal';
import { farmSchema } from '../schemas';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCategories } from '@/features/categories';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Border, Space, Typography } from '@/constants';
import { Alert, TouchableHighlight } from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from 'react-hook-form';
import {
  Action,
  Box,
  Field,
  Heading,
  Overlay,
  Text,
  useOverlay,
} from '@/components';
import { trpc } from '@/lib/trpc';
import { useFarms } from './Provider';

const Category = () => {
  const { categories } = useCategories();
  const { control } = useFormContext<{
    categoryId: string;
  }>();

  return (
    <Controller
      name='categoryId'
      control={control}
      render={({ field }) => {
        return (
          <Picker
            selectedValue={field.value}
            onValueChange={(itemValue) => field.onChange(itemValue)}
          >
            {categories.map((category) => {
              return (
                <Picker.Item
                  key={category.id}
                  value={category.id}
                  label={category.name}
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
  const colors = useThemeColors();
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
                placeholderTextColor={colors.getColor('text.inactive')}
                placeholder='Farm name e.g Maize farm'
                style={{
                  width: '100%',
                  height: '100%',
                  paddingHorizontal: Space.lg,
                  fontSize: Typography.size.lg,
                  color: colors.getColor('text.strong'),
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
    size_unit: 'acres' | 'hectares' | 'square meters';
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
            {['Acres', 'Hectares', 'Square Meters'].map((unit) => {
              return (
                <Picker.Item
                  key={unit}
                  label={unit}
                  value={unit.toLowerCase()}
                />
              );
            })}
          </Picker>
        );
      }}
    />
  );
};

const Location = () => {
  const colors = useThemeColors();
  const { control } = useFormContext<{
    state: string;
    city: string;
    address: string;
  }>();

  return (
    <Box
      mx='auto'
      bg='bg.subtle'
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
          borderRightWidth: 0.5,
          borderBottomWidth: 0.5,
          borderColor: colors.getColor('border.soft'),
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
                  placeholderTextColor={colors.getColor('text.inactive')}
                  placeholder='City e.g Ibadan'
                  style={{
                    width: '100%',
                    height: '100%',
                    paddingHorizontal: Space.lg,
                    fontSize: Typography.size.lg,
                    color: colors.getColor('text.strong'),
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
          borderLeftWidth: 0.5,
          borderBottomWidth: 0.5,
          borderColor: colors.getColor('border.soft'),
        }}
        control={control as any}
      >
        <Field.Control style={{ backgroundColor: 'transparent' }}>
          <Controller
            name='state'
            control={control}
            render={({ field }) => {
              return (
                <BottomSheetTextInput
                  value={field.value}
                  onBlur={field.onBlur}
                  placeholder='State e.g Oyo'
                  placeholderTextColor={colors.getColor('text.inactive')}
                  style={{
                    width: '100%',
                    height: '100%',
                    paddingHorizontal: Space.lg,
                    fontSize: Typography.size.lg,
                    color: colors.getColor('text.strong'),
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
          borderTopWidth: 0.5,
          borderColor: colors.getColor('border.soft'),
        }}
        control={control as any}
      >
        <Field.Control style={{ backgroundColor: 'transparent' }}>
          <Controller
            name='address'
            control={control}
            render={({ field }) => {
              return (
                <BottomSheetTextInput
                  value={field.value}
                  onBlur={field.onBlur}
                  placeholderTextColor={colors.getColor('text.inactive')}
                  placeholder='Address e.g Plot 5A, Bodija Street'
                  style={{
                    width: '100%',
                    height: '100%',
                    paddingHorizontal: Space.lg,
                    fontSize: Typography.size.lg,
                    color: colors.getColor('text.strong'),
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
  const colors = useThemeColors();
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
                placeholderTextColor={colors.getColor('text.inactive')}
                placeholder='Farm name e.g Maize farm'
                style={{
                  width: '100%',
                  height: '100%',
                  paddingHorizontal: Space.lg,
                  fontSize: Typography.size.lg,
                  color: colors.getColor('text.strong'),
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
                  color='text.inactive'
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
    snapPoints: ['34%'],
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
    snapPoints: ['34%'],
    title: 'How large is your farmland?',
  },
  {
    name: 'Location',
    content: Location,
    snapPoints: ['38%'],
    title: 'Specify where your farm is located',
  },
  {
    name: 'Category',
    content: Category,
    snapPoints: ['50%'],
    title: "What kind of farm you're running?",
  },
];

type Props = {
  farm?: any;
  children: React.ReactNode;
};

export const Add = ({ children, farm }: Props) => {
  const { setFarms } = useFarms();
  const colors = useThemeColors();
  const overlay = useOverlay();

  const form = useForm({
    mode: 'all',
    resolver: zodResolver(farmSchema),
    defaultValues: {
      city: farm?.city || '',
      state: farm?.state || '',
      size: farm?.size || '1',
      address: farm?.address || '',
      name: farm?.name || 'My farm',
      categoryId: farm?.category_id || '',
      size_unit: farm?.size_unit || 'acres',
    },
  });

  const create = trpc.userFarms.create.useMutation({
    onSuccess: (data: any) => {
      setFarms({ type: 'ADD_FARM', payload: { farm: data?.farm || {} } });
      form.reset();
      overlay.onToggle(false);
    },
    onError: (err: any) => {
      Alert.alert('Error', err?.message || 'Failed to create farm', [
        { text: 'OK' },
      ]);
    },
  });
  const update = trpc.userFarms.update.useMutation({
    onSuccess: (data: any) => {
      setFarms({ type: 'UPDATE_FARM', payload: { farm: data?.farm || {} } });
      form.reset();
      overlay.onToggle(false);
    },
    onError: (err: any) => {
      Alert.alert('Error', err?.message || 'Failed to update farm', [
        { text: 'OK' },
      ]);
    },
  });

  const loading = create.isPending || update.isPending;
  const buttonLabel = loading ? '...' : farm ? 'Update farm' : 'Create farm';

  const onSubmit = async (data: any) => {
    if (farm) {
      await update.mutateAsync({
        farmId: farm.id,
        ...data,
      });
    } else {
      await create.mutateAsync(data);
    }
  };

  const title = farm
    ? 'Update your farm record'
    : 'Add new farm to your record';

  return (
    <FormProvider {...form}>
      <Overlay.Provider value={overlay}>
        <Overlay.SheetTrigger>{children}</Overlay.SheetTrigger>
        <Overlay.Sheet
          snapPoints={['55%']}
          onDismiss={() => overlay.onToggle(false)}
        >
          <Overlay.SheetHeader>
            <Heading
              size='2xl'
              leading='lg'
              align='center'
              weight='medium'
              style={{ maxWidth: 200, marginHorizontal: 'auto' }}
            >
              {title}
            </Heading>
          </Overlay.SheetHeader>

          <Overlay.SheetContent mt='3xl'>
            <Box
              bg='bg.subtle'
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
                    <TouchableHighlight
                      underlayColor={colors.getColor('bg.soft')}
                    >
                      <Box
                        px='lg'
                        style={{
                          height: 44,
                          alignItems: 'center',
                          flexDirection: 'row',
                          borderColor: colors.getColor('border.soft'),
                          borderBottomWidth:
                            options.length - 1 === index ? 0 : 1,
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
                          size={16}
                          name='chevron-forward'
                          color={colors.getColor('icon.inactive')}
                        />
                      </Box>
                    </TouchableHighlight>
                  </Modal>
                );
              })}
            </Box>
          </Overlay.SheetContent>

          <Overlay.SheetFooter>
            <Action.Root
              loading={loading}
              onPress={async () => {
                const values = form.getValues();
                await onSubmit(values);
              }}
              disabled={!form.formState.isValid}
            >
              <Action.Loader />
              <Action.Label>{buttonLabel}</Action.Label>
            </Action.Root>
          </Overlay.SheetFooter>
        </Overlay.Sheet>
      </Overlay.Provider>
    </FormProvider>
  );
};
