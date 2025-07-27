import React from 'react';
import { MotiView } from 'moti';
import { Border, Space } from '@/constants';
import { EstimateSchema } from '../schemas';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useWatchTotal } from '../hooks/useWatchTotal';
import { Box, Field, Scroll, Text } from '@/components';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useFieldArray, useFormContext } from 'react-hook-form';

type FormProps = {
  type: EstimateSchema['calculations'][number]['type'];
};

export const Form = ({ type }: FormProps) => {
  const colors = useThemeColors();
  const form = useFormContext<EstimateSchema>();
  const fieldArray = useFieldArray({
    control: form.control,
    name: 'calculations',
  });

  const fields = fieldArray.fields
    .map((field, i) => ({ ...field, index: i }))
    .filter((field) => field.type === type);
  const [total, filteredTotal] = useWatchTotal({ type });

  return (
    <React.Fragment>
      <Scroll
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: Space['xs'] }}
      >
        {fields.map((field) => {
          return (
            <MotiView
              key={field.id}
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 300 }}
              style={{
                width: '100%',
                gap: Space['xs'],
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              {fields.length > 1 ? (
                <TouchableOpacity
                  hitSlop={20}
                  onPress={() => fieldArray.remove(field.index)}
                >
                  <Ionicons
                    size={18}
                    name='trash'
                    style={{ flexShrink: 0 }}
                    color={colors.getColor('icon.inactive')}
                  />
                </TouchableOpacity>
              ) : null}
              <Field.Root
                control={form.control as any}
                name={`calculations.${field.index}.description`}
                style={{ flex: 1 }}
              >
                <Field.Container
                  style={{
                    height: 32,
                    borderRadius: Border.radius['base'],
                  }}
                >
                  <Field.Row>
                    <Field.TextInput placeholder='Some text' />
                  </Field.Row>
                </Field.Container>
              </Field.Root>
              <Field.Root
                style={{ width: '17%' }}
                control={form.control as any}
                name={`calculations.${field.index}.quantity`}
              >
                <Field.Container
                  style={{
                    height: 32,
                    borderRadius: Border.radius['base'],
                  }}
                >
                  <Field.Row>
                    <Field.TextInput
                      placeholder='10'
                      style={{ textAlign: 'right' }}
                      keyboardType='numeric'
                    />
                  </Field.Row>
                </Field.Container>
              </Field.Root>
              <Field.Root
                style={{ width: '23%' }}
                control={form.control as any}
                name={`calculations.${field.index}.price`}
              >
                <Field.Container
                  style={{
                    height: 32,
                    borderRadius: Border.radius['base'],
                  }}
                >
                  <Field.Row>
                    <Field.TextInput
                      placeholder='0.00'
                      keyboardType='numeric'
                      style={{ textAlign: 'right' }}
                    />
                  </Field.Row>
                </Field.Container>
              </Field.Root>
            </MotiView>
          );
        })}
      </Scroll>

      <Box
        py='lg'
        style={{
          borderBottomWidth: Border.width['xs'],
          borderColor: colors.getColor('border.base'),
        }}
      >
        <Text
          color='text.inactive'
          style={{ fontSize: 20, fontWeight: '500' }}
        >
          Summary
        </Text>
      </Box>
      <Box
        mt='lg'
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box style={{ gap: Space['sm'] }}>
          <Text
            color='text.strong'
            style={{ lineHeight: 24, fontSize: 24, fontWeight: '600' }}
          >
            Total: {total}
          </Text>
          <Text
            color='text.soft'
            style={{ lineHeight: 16 }}
          >
            Sum {type === 'expense' ? 'of expenses' : 'of income'}:{' '}
            {filteredTotal}
          </Text>
        </Box>
        <TouchableOpacity
          hitSlop={20}
          style={{
            height: 32,
            aspectRatio: 1,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: Border.radius.full,
            backgroundColor: colors.getColor('primary.base'),
          }}
          onPress={() => {
            fieldArray.append({
              type,
              price: '0',
              quantity: '1',
              description: '',
              id: String(Date.now()),
            });
          }}
        >
          <Ionicons
            name='add'
            size={24}
            color={colors.getColor('text.base')}
          />
        </TouchableOpacity>
      </Box>
    </React.Fragment>
  );
};
