import React from 'react';
import { Border } from '@/constants';
import Icons from '../constants/Icons';
import { FlatList } from 'react-native';
import { excerpt } from '@/utils/excerpt';
import { Ionicons } from '@expo/vector-icons';
import { Box, RadioGroup, Text } from '@/components';
import { Controller, useFormContext } from 'react-hook-form';

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

export default Icon;
