import React from 'react';
import { trpc } from '@/lib/trpc';
import { Alert, TouchableOpacity } from 'react-native';
import { useFarms } from './Provider';
import { useRouter } from 'expo-router';
import { ActivityIndicator } from '@/components';

type Props = {
  children: React.ReactNode;
  onSuccess?: (data: any) => any;
};

const Delete = ({ children, onSuccess }: Props) => {
  const router = useRouter();
  const { farm, setFarms } = useFarms();

  const remove = trpc.userFarms.delete.useMutation({
    onSuccess: (data) => {
      setFarms({ type: 'REMOVE_FARM', payload: { farmId: farm!.id } });
      onSuccess?.(data);
      router.back();
    },
    onError: (err) => {
      Alert.alert('We couldn’t delete the farm', err.message, [
        { text: 'Okay' },
      ]);
    },
  });

  if (remove.isPending) return <ActivityIndicator />;

  return (
    <TouchableOpacity
      onPress={async () => remove.mutateAsync({ farmId: farm!.id })}
    >
      {children}
    </TouchableOpacity>
  );
};

export default Delete;
