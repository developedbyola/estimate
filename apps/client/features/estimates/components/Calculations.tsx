import React from 'react';
import { Border } from '@/constants';
import { CalculationItem } from '../schemas';
import { Ionicons } from '@expo/vector-icons';
import { Box, Field, RadioGroup } from '@/components';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

type RowProps = {
  index: number;
  field: CalculationItem;
};

const Operations = [
  { icon: 'add', value: 'add' },
  { icon: 'remove', value: 'subtract' },
] as const;

const Calculations = () => {
  const colors = useThemeColors();
  const { control } = useFormContext<{ calculations: CalculationItem[] }>();
  const { fields, append } = useFieldArray({
    control,
    name: 'calculations',
  });

  const addNewCalculation = (
    operation: 'add' | 'subtract',
    parentId: string
  ) => {
    const existingSubnode = fields.find((f) => f.attachedTo === parentId);
    if (existingSubnode) return; // Only one subnode allowed

    const newId = Date.now().toString();

    append({
      id: newId,
      operation,
      quantity: '1',
      unitPrice: '50',
      description: 'Fertilizer',
      attachedTo: parentId,
    });
  };

  const Row = ({ index, field }: RowProps) => {
    return (
      <Box px='xl'>
        <Box
          bg='bg.soft'
          style={{
            overflow: 'hidden',
            flexDirection: 'row',
            borderRadius: Border.radius.lg,
          }}
        >
          <Field.Root
            style={{
              width: '50%',
              borderRightWidth: 0.75,
              borderColor: colors.getColor('border.base'),
            }}
            control={control as any}
            name={`calculations.${index}.description`}
          >
            <Field.Content>
              <Field.TextInput placeholder='Item name' />
            </Field.Content>
          </Field.Root>
          <Field.Root
            style={{
              width: '30%',
              borderLeftWidth: 0.75,
              borderRightWidth: 0.75,
              borderColor: colors.getColor('border.base'),
            }}
            control={control as any}
            name={`calculations.${index}.unitPrice`}
          >
            <Field.Content>
              <Field.TextInput
                keyboardType='numeric'
                placeholder='Amount'
                style={{ textAlign: 'right' }}
              />
            </Field.Content>
          </Field.Root>
          <Field.Root
            style={{
              width: '20%',
              borderLeftWidth: 0.75,
              borderColor: colors.getColor('border.base'),
            }}
            control={control as any}
            name={`calculations.${index}.quantity`}
          >
            <Field.Content>
              <Field.TextInput
                placeholder='Units'
                keyboardType='number-pad'
                style={{ textAlign: 'right' }}
              />
            </Field.Content>
          </Field.Root>
        </Box>
        <Box my='sm'>
          <Controller
            name={`calculations.${index}.operation`}
            control={control}
            render={({ field: operationField }) => (
              <RadioGroup.Root
                value={operationField.value}
                style={{ alignItems: 'center' }}
                onValueChange={(value) => operationField.onChange(value)}
              >
                <Box
                  bg='bg.soft'
                  style={{
                    overflow: 'hidden',
                    flexDirection: 'row',
                    borderRadius: Border.radius.xl,
                  }}
                >
                  {Operations.map((operation) => {
                    const isActive = operationField.value === operation.value;
                    return (
                      <RadioGroup.Item
                        px='sm'
                        key={operation.value}
                        value={operation.value}
                        bg={isActive ? 'bg.inactive' : undefined}
                        style={{
                          height: 22,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onPress={() =>
                          addNewCalculation(operation.value, field.id)
                        }
                      >
                        <Ionicons
                          size={16}
                          name={operation.icon as any}
                          color={colors.getColor('icon.strong')}
                        />
                      </RadioGroup.Item>
                    );
                  })}
                </Box>
              </RadioGroup.Root>
            )}
          />
        </Box>
      </Box>
    );
  };

  const renderNode = (field: CalculationItem) => {
    const index = fields.findIndex((f) => f.id === field.id);
    const children = fields.filter((f) => f.attachedTo === field.id);

    return (
      <Box key={field.id}>
        <Row
          field={field}
          index={index}
        />
        {children.map((child) => renderNode(child))}
      </Box>
    );
  };

  return (
    <Box>
      {fields.filter((f) => !f.attachedTo).map((root) => renderNode(root))}
    </Box>
  );
};

export default Calculations;
