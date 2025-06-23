import React from 'react';
import { Border } from '@/constants';
import { FarmType } from '../types/farm';
import { Box, Heading, Text } from '@/components';
import { useCurrencyContext } from '@/features/currency';
import { excerpt } from '@/utils/excerpt';

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
        bg='background'
        style={{
          flex: 1,
          borderRadius: Border.radius['xl'],
        }}
      >
        <Box
          bg='foreground'
          style={{
            flex: 0,
            width: 40,
            aspectRatio: '1/1',
            borderRadius: Border.radius.lg,
          }}
        />
        <Box py='sm' />
        <Box>
          <Heading
            size='lg'
            leading='lg'
          >
            {excerpt(farm.title, 12)}
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
