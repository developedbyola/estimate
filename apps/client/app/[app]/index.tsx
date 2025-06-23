import React from 'react';
import { Stack } from 'expo-router';
import { Image } from 'expo-image';
import { FarmList } from '@/features/farms';
import { Border, Space } from '@/constants';
import { StatusBar } from 'expo-status-bar';
import CreateBottomSheet from '@/features/create';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useCurrencyContext } from '@/features/currency';
import { Action, Heading, Box, Text, Safe } from '@/components';

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
          <Image
            source={require('@/assets/images/avatars/default.png')}
            style={{
              width: 36,
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
          py='4xl'
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
          px='xl'
          style={{ flex: 1 }}
        >
          <FarmList />
        </Box>
      </Safe>
    </React.Fragment>
  );
};

export default Farms;
