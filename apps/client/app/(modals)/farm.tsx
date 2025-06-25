import React from 'react';
import { Farms, useFarms } from '@/features/farms';
import { Box, Heading, Safe, Text } from '@/components';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Border, Space } from '@/constants';
import Icons from '@/features/categories/constants/Icons';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Button } from 'react-native';

const FarmPage = () => {
  const { farm } = useFarms();
  const colors = useThemeColors();

  if (!farm) return null;

  const icon = Icons.find((icon) => icon.id === farm.category.icon);

  return (
    <React.Fragment>
      <Stack.Screen
        name='farm'
        options={{
          title: farm.name,
          headerBackTitle: 'Back',
          presentation: 'fullScreenModal',
        }}
      />

      <Safe
        bg='bg.subtle'
        style={{ flex: 1 }}
      >
        <Box
          px='xl'
          mt='4xl'
          style={{ gap: Space['2xl'], flexDirection: 'row' }}
        >
          <Box
            bg='bg.base'
            style={{
              width: 56,
              aspectRatio: '1/1',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: Border.radius.lg,
              boxShadow: `.5px 2px 3px .5px rgba(0, 0, 0, 0.06)`,
            }}
          >
            <Ionicons
              size={40}
              name={icon?.icon as any}
              color={icon?.normalColor}
            />
          </Box>
          <Box style={{ flex: 1, alignItems: 'flex-start' }}>
            <Heading
              size='2xl'
              leading='lg'
              align='center'
              style={{}}
            >
              {farm.name}
            </Heading>
            <Text
              leading='base'
              style={{ marginTop: Space['2xs'] }}
            >{`${farm.size} ${farm.size_unit}`}</Text>
          </Box>
          <Farms.Add farm={farm}>
            <Button title='Edit' />
          </Farms.Add>
        </Box>
      </Safe>
    </React.Fragment>
  );
};

export default FarmPage;
