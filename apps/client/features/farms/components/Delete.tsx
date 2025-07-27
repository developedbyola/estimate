import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { ActivityIndicator } from '@/components';
import { useDeleteFarm } from '../hooks/useDeleteFarm';

type Props = {
  children: React.ReactNode;
};

const Delete = ({ children }: Props) => {
  const { farmId } = useLocalSearchParams<{ farmId: string }>();

  const { status, mutate } = useDeleteFarm();

  if (status === 'pending') return <ActivityIndicator />;

  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      onPress={async () => await mutate({ farmId })}
    >
      {children}
    </TouchableOpacity>
  );
};

export default Delete;
