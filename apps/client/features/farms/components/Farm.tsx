import React from 'react';
import { Border } from '@/constants';
import { FarmType } from '../types/farm';
import { Box, Heading, Text } from '@/components';
import { useCurrencyContext } from '@/features/currency';

type FarmProps = { farm: FarmType };

const Farm = (props: FarmProps) => {
  const { farm } = props;
  const { currency } = useCurrencyContext();

  return (
    <Box
      py='xs'
      px='xs'
      style={{ width: '50%' }}
    >
      <Box
        px='lg'
        py='lg'
        bg='foreground'
        style={{
          flex: 1,
          borderRadius: Border.radius['2xl'],
        }}
      >
        <Box
          bg='surface'
          style={{
            flex: 0,
            width: 40,
            aspectRatio: '1/1',
            borderRadius: Border.radius.xl,
          }}
        />
        <Box py='sm' />
        <Box>
          <Heading
            size='lg'
            leading='lg'
          >
            {farm.title}
          </Heading>
          <Text
            size='xs'
            leading='xs'
            color='muted'
          >
            {farm.estimates} estimates
          </Text>
        </Box>
        <Box py='xs' />
        <Box>
          <Heading
            size='xl'
            leading='base'
            color='subtle'
          >
            {currency.symbol}
            {farm.amount.toFixed(2)}
          </Heading>
        </Box>
      </Box>
    </Box>
  );
};

export default Farm;
