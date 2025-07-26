import React from 'react';
import { Estimate } from '../types';
import { Pressable } from 'react-native';
import { ActivityIndicator, Box, Text } from '@/components';
import { useListEstimates } from '../hooks/useListEstimates';

const DefaultError = ({ refetch }: { refetch: () => void }) => {
  return (
    <Box style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
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
      <Pressable onPress={refetch}>Retry</Pressable>
    </Box>
  );
};

const DefaultEmpty = () => {
  return (
    <Box style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 24,
          fontWeight: '600',
          letterSpacing: -0.5,
        }}
      >
        No estimates
      </Text>
      <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '500' }}>
        Please add an estimate
      </Text>
    </Box>
  );
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
  const { status, estimates, refetch } = useListEstimates();

  if (status === 'pending') return <Loader />;
  if (status === 'error') return Error || <DefaultError refetch={refetch} />;
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
