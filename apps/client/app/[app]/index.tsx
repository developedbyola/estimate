import React from 'react';
import { Stack } from 'expo-router';
import { FarmList } from '@/features/farms';
import { Border, Space } from '@/constants';
import { StatusBar } from 'expo-status-bar';
import CreateBottomSheet from '@/features/create';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Action, Heading, Box, Text, Safe } from '@/components';
import { useCurrencyContext } from '@/features/currency';

const Farms = () => {
  const Colors = useThemeColors();
  const { currency } = useCurrencyContext();

  return (
    <React.Fragment>
      <Stack.Screen options={{ title: 'Farms', headerShown: false }} />
      <StatusBar style='dark' />

      <Safe
        bg='foreground'
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
          <Box
            bg={'background'}
            style={{
              width: 32,
              aspectRatio: '1/1',
              borderRadius: Border.radius.xl,
            }}
          />

          <Box style={{ gap: Space['2xs'], flexDirection: 'row' }}>
            <CreateBottomSheet>
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
                  color={Colors.primary.base}
                />
              </Action.Root>
            </CreateBottomSheet>
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
                color={Colors.primary.base}
              />
            </Action.Root>
          </Box>
        </Box>

        <Box
          px='xl'
          py='2xl'
        >
          <Text
            size='sm'
            leading='xs'
            color='muted'
            align='center'
          >
            Total Estimates
          </Text>
          <Box py='2xs' />
          <Heading
            size='3xl'
            align='center'
          >
            {currency.symbol}50.89
          </Heading>
        </Box>

        <Box
          bg='background'
          style={{ flex: 1 }}
        >
          <Box
            py='lg'
            px='xl'
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Heading
              size='2xl'
              leading='xl'
            >
              Farms
            </Heading>
            <Action.Root
              size='2xs'
              variant='ghost'
            >
              <Action.Label
                size='xs'
                weight='semibold'
              >
                All
              </Action.Label>
            </Action.Root>
          </Box>

          <Box
            px='xl'
            style={{ flex: 1 }}
          >
            <FarmList />
          </Box>
          <Box
            bg='surface'
            my='3xl'
          />
        </Box>
      </Safe>
    </React.Fragment>
  );
};

export default Farms;
