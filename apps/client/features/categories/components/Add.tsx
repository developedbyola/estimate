import React from 'react';
import { Border, Space, Typography } from '@/constants';
import Icons from '../constants/Icons';
import { excerpt } from '@/utils/excerpt';
import { categorySchema } from '../schemas';
import { Ionicons } from '@expo/vector-icons';
import Modal from './shared/Modal';
import { Alert, TouchableHighlight } from 'react-native';
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
  Flow,
  useFlow,
} from '@/components';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { trpc } from '@/lib/trpc';
import { useCategories } from './Provider';

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

const Form = () => {
  const colors = useThemeColors();
  const formContext = useFormContext<{ name: string; icon: string }>();
  const values = useWatch({ control: formContext.control });

  const icon = Icons.find((icon) => icon.id === values.icon);

  return (
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
            <TouchableHighlight underlayColor={colors.getColor('bg.subtle')}>
              <Box
                px='lg'
                style={{
                  height: 44,
                  alignItems: 'center',
                  flexDirection: 'row',
                  borderColor: 'white',
                  borderBottomWidth: options.length - 1 === index ? 0 : 1.5,
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
                    size='lg'
                    leading='sm'
                    color='text.inactive'
                  >
                    {excerpt(values.name || 'e.g Cereals', 20)}
                  </Text>
                ) : null}
              </Box>
            </TouchableHighlight>
          </Modal>
        );
      })}
    </Box>
  );
};

const Success = ({ isUpdate }: { isUpdate: boolean }) => {
  const colors = useThemeColors();

  return (
    <React.Fragment>
      <Ionicons
        size={40}
        name='bonfire-outline'
        color={colors.getColor('success.base')}
        style={{ marginInline: 'auto', marginTop: Space.xl }}
      />
      <Heading
        size='2xl'
        align='center'
        leading='lg'
        weight='medium'
        style={{ marginTop: Space['2xl'], maxWidth: 200, marginInline: 'auto' }}
      >
        {isUpdate
          ? 'Category updated successfully'
          : 'Category created successfully'}
      </Heading>
      <Text
        size='lg'
        align='center'
        leading='base'
        weight='normal'
        style={{ marginTop: Space.base, maxWidth: 320, marginInline: 'auto' }}
      >
        The new category is ready, Making it easier to manage and track
        different agricultural locations.
      </Text>
    </React.Fragment>
  );
};

type Props = {
  category?: any;
  children: React.ReactNode;
};

export const Add = ({ children, category }: Props) => {
  const form = useForm({
    mode: 'all',
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      icon: category?.icon || Icons[0].id,
    },
  });

  const flow = useFlow({ count: 1 });
  const { setCategories } = useCategories();

  const updateCategory = trpc.userCategories.update.useMutation({
    onSuccess: (data: any) => {
      setCategories({
        type: 'UPDATE_CATEGORY',
        payload: { category: data.category },
      });
      flow.onNextStep();
    },
    onError: (err) => {
      Alert.alert('Failed to update category', err.message);
    },
  });

  const createCategory = trpc.userCategories.create.useMutation({
    onSuccess: (data: any) => {
      setCategories({
        type: 'ADD_CATEGORY',
        payload: { category: data.category },
      });
      flow.onNextStep();
    },
    onError: (err) => {
      Alert.alert('Failed to create category', err.message);
    },
  });

  const isUpdate = !!category;
  const isLoading = createCategory.isPending || updateCategory.isPending;
  const mutate = () => {
    if (category) {
      updateCategory.mutate({
        categoryId: category.id,
        name: form.getValues().name,
        icon: form.getValues().icon,
      });
    } else {
      createCategory.mutate({
        name: form.getValues().name,
        icon: form.getValues().icon,
      });
    }
  };

  return (
    <FormProvider {...form}>
      <Overlay.Root>
        <Overlay.SheetTrigger>{children}</Overlay.SheetTrigger>
        <Overlay.Sheet
          snapPoints={['37%']}
          onDismiss={() => {
            flow.reset();
          }}
          style={{ justifyContent: 'space-between' }}
        >
          <Flow.Provider
            value={flow}
            style={{ flex: 1 }}
          >
            <Flow.Success>
              <Success isUpdate={isUpdate} />
            </Flow.Success>
            <Flow.Content index={0}>
              <Overlay.SheetHeader>
                <Heading
                  size='2xl'
                  align='center'
                  leading='lg'
                  weight='medium'
                  style={{ maxWidth: 200, marginHorizontal: 'auto' }}
                >
                  {isUpdate
                    ? 'Review and update this category'
                    : 'Sort your farms meaningfully.'}
                </Heading>
              </Overlay.SheetHeader>

              <Overlay.SheetContent mt='2xl'>
                <Form />
              </Overlay.SheetContent>

              <Overlay.SheetFooter>
                <Action.Root
                  loading={isLoading}
                  onPress={() => mutate()}
                  disabled={!form.formState.isValid}
                >
                  <Action.Loader />
                  <Action.Label>
                    {isUpdate ? 'Update category' : 'Create category'}
                  </Action.Label>
                </Action.Root>
              </Overlay.SheetFooter>
            </Flow.Content>
          </Flow.Provider>
        </Overlay.Sheet>
      </Overlay.Root>
    </FormProvider>
  );
};
