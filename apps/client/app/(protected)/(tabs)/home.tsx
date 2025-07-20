import React from 'react';
import { Border, Space } from '@/constants';
import { useCurrency } from '@/features/currency';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useRouter } from 'expo-router';
import { Action, Heading, Box, Text, Safe, Scroll } from '@/components';
import { Farms, useFarms } from '@/features/farms';

const HomePage = () => {
  const router = useRouter();
  const colors = useThemeColors();
  const { setFarms } = useFarms();
  const { currency } = useCurrency();

  return (
    <Safe
      bg='primary.base'
      style={{ flex: 1 }}
    >
      <Box
        mt='xl'
        px='xl'
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box
          style={{
            flex: 1,
            gap: Space['sm'],
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}
        >
          <Action.Root
            hitSlop={40}
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
              size={24}
              name='create-outline'
              style={{ color: colors.getColor('icon.base') }}
            />
          </Action.Root>
          <Action.Root
            hitSlop={24}
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
              style={{ color: colors.getColor('icon.base') }}
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
          size='base'
          leading='xs'
          align='center'
          color='text.base'
        >
          Total Estimates
        </Text>
        <Box
          mt='lg'
          style={{
            gap: 2,
            flexDirection: 'row',
            alignItems: 'baseline',
            justifyContent: 'center',
          }}
        >
          <Text
            size='xl'
            color='text.base'
            style={{ lineHeight: 18 }}
          >
            {currency.symbol}
          </Text>
          <Heading
            size='3xl'
            color='text.base'
            style={{ lineHeight: 32 }}
          >
            00.00
          </Heading>
        </Box>
      </Box>

      <Box
        px='xl'
        pt='xl'
        bg='bg.base'
        style={{
          flex: 1,
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
        }}
      >
        <Farms.List />
      </Box>
    </Safe>
  );
};

export default HomePage;
