import React from 'react';
import { ActivityIndicator, Box, Text } from '@/components';
import { Estimate } from '../types';
import { useListEstimates } from '../hooks/useListEstimates';
import { Pressable } from 'react-native';

const DefaultError = () => {
  return (
    <Box>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 24,
          fontWeight: '600',
          letterSpacing: -0.5,
        }}
      >
        Something went wrong
      </Text>
      <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '500' }}>
        Please try again later
      </Text>
      <Pressable></Pressable>
    </Box>
  );
};

const DefaultEmpty = () => {
  return <Box style={{ flex: 1 }}></Box>;
};

const Loader = () => {
  return (
    <Box style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator />
    </Box>
  );
};

const Item = ({ estimate }: { estimate: Estimate }) => {
  return <Box></Box>;
};

type ListProps = {
  Empty?: React.ReactNode;
  Error?: React.ReactNode;
};

export const List = ({ Empty, Error }: ListProps) => {
  const { status, estimates } = useListEstimates();

  if (status === 'pending') return <Loader />;
  if (status === 'error') return Error || <DefaultError />;
  if (estimates?.length === 0) return Empty || <DefaultEmpty />;

  return (
    <Box style={{ flex: 1 }}>
      {estimates?.map((estimate) => (
        <Item
          key={estimate.id}
          estimate={estimate}
        />
      ))}
    </Box>
  );
};
