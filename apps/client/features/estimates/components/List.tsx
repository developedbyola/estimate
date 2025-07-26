import React from 'react';
import { Estimate } from '../types';
import { Pressable } from 'react-native';
import { ActivityIndicator, Box, Text } from '@/components';
import { useListEstimates } from '../hooks/useListEstimates';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Border } from '@/constants';
import { useRouter } from 'expo-router';

const DefaultError = ({ refetch }: { refetch: () => void }) => {
  return (
    <Box
      style={{
        flex: 1,
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
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
      <Text style={{ textAlign: 'center', fontSize: 18 }}>
        Please try again later
      </Text>
      <Pressable onPress={refetch}>Retry</Pressable>
    </Box>
  );
};

const DefaultEmpty = () => {
  const router = useRouter();
  const colors = useThemeColors();

  return (
    <Box
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        color='text.strong'
        style={{
          fontSize: 24,
          lineHeight: 28,
          fontWeight: '600',
          textAlign: 'center',
          letterSpacing: -0.25,
        }}
      >
        No estimates
      </Text>
      <Text
        color='text.soft'
        style={{ textAlign: 'center', fontSize: 18 }}
      >
        Please add an estimate
      </Text>
      <Pressable
        onPress={() => router.push('/estimates/create')}
        style={{
          marginTop: 16,
          paddingBlock: 12,
          paddingInline: 20,
          borderRadius: Border.radius.full,
          backgroundColor: colors.getColor('bg.strong'),
        }}
      >
        <Text
          color='text.base'
          style={{ fontSize: 20, fontWeight: '500' }}
        >
          Add estimate
        </Text>
      </Pressable>
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
