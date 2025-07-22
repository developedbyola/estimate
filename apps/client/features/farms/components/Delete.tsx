import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { ActivityIndicator } from '@/components';
import { useDeleteFarm } from '../hooks/useDeleteFarm';

type Props = {
  children: React.ReactNode;
};

const Delete = ({ children }: Props) => {
  const router = useRouter();
  const { farmId } = useLocalSearchParams<{ farmId: string }>();

  const { status, mutate } = useDeleteFarm({
    onSuccess: () => {
      router.back();
    },
  });

  if (status === 'pending') return <ActivityIndicator />;

  return (
    <TouchableOpacity onPress={async () => await mutate({ farmId })}>
      {children}
    </TouchableOpacity>
  );
};

export default Delete;
