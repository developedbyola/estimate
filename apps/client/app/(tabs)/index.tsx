import React from 'react';
import { Image } from 'expo-image';
import { Border, Space } from '@/constants';
import { useCurrency } from '@/features/currency';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Action, Heading, Box, Text, Safe, Scroll } from '@/components';
import { useRouter } from 'expo-router';
import { Farms, useFarms } from '@/features/farms';

const FarmsPage = () => {
  const router = useRouter();
  const colors = useThemeColors();
  const { setFarms } = useFarms();
  const { currency } = useCurrency();

  return (
    <Safe
      bg='bg.subtle'
      style={{ flex: 1 }}
    >
      <Scroll style={{ flex: 1 }}>
        <Box
          mt='xl'
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
              onPress={() => {
                setFarms({ type: 'SET_FARM', payload: { farm: null } });
                router.push('/add-farm');
              }}
            >
              <Action.Icon
                size={22}
                name='create-outline'
                color={colors.getColor('primary.base')}
              />
            </Action.Root>
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
          mt='6xl'
          mb='4xl'
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

        <Box
          px='xl'
          mt='xl'
        >
          <Farms.List />
        </Box>
      </Scroll>
    </Safe>
  );
};

export default FarmsPage;
