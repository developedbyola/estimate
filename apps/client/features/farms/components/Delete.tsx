import React from 'react';
import { useFarms } from './Provider';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { ActivityIndicator } from '@/components';
import { useDeleteFarm } from '../hooks/useDeleteFarm';

type Props = {
  children: React.ReactNode;
};

const Delete = ({ children }: Props) => {
  const router = useRouter();
  const { farm } = useFarms();

  const { status, mutate } = useDeleteFarm({
    onSuccess: () => {
      router.back();
    },
  });

  if (status === 'pending') return <ActivityIndicator />;

  return (
    <TouchableOpacity onPress={async () => await mutate({ farmId: farm!.id })}>
      {children}
    </TouchableOpacity>
  );
};

export default Delete;
