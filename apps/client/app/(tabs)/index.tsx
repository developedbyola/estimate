import React from 'react';
import { Stack } from 'expo-router';
import { Image } from 'expo-image';
import { Farms } from '@/features/farms';
import { Border, Space } from '@/constants';
import { StatusBar } from 'expo-status-bar';
import { useCurrency } from '@/features/currency';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Action, Heading, Box, Text, Safe, Scroll } from '@/components';

const FarmsPage = () => {
  const colors = useThemeColors();
  const { currency } = useCurrency();

  return (
    <React.Fragment>
      <StatusBar style='dark' />

      <Safe
        bg='bg.subtle'
        style={{ flex: 1 }}
      >
        <Box
          my='xl'
          px='xl'
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Image
            source={require('@/assets/images/avatars/default.png')}
            style={{
              width: 36,
              aspectRatio: '1/1',
              borderRadius: Border.radius.xl,
            }}
          />

          <Box style={{ gap: Space['2xs'], flexDirection: 'row' }}>
            <Farms.Add>
              <Action.Root
                hitSlop={40}
                variant='ghost'
                style={{
                  width: 32,
                  height: 32,
                  paddingInline: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Action.Icon
                  size={22}
                  name='create-outline'
                  color={colors.getColor('primary.base')}
                />
              </Action.Root>
            </Farms.Add>
            <Action.Root
              variant='ghost'
              hitSlop={20}
              style={{
                width: 32,
                height: 32,
                paddingInline: 0,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Action.Icon
                size={22}
                name='search-outline'
                color={colors.getColor('primary.base')}
              />
            </Action.Root>
          </Box>
        </Box>

        <Box
          px='xl'
          py='4xl'
        >
          <Text
            size='sm'
            leading='xs'
            align='center'
            color='text.inactive'
          >
            Total Estimates
          </Text>
          <Box py='2xs' />
          <Heading
            size='3xl'
            align='center'
          >
            {currency.symbol}00.00
          </Heading>
        </Box>

        <Scroll
          px='xl'
          style={{ flex: 1 }}
        >
          <Farms.List />
        </Scroll>
      </Safe>
    </React.Fragment>
  );
};

export default FarmsPage;
