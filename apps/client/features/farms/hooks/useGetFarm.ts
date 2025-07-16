import React from 'react';
import { Alert } from 'react-native';
import { Trpc } from '@/features/trpc';
import { Farm, useFarms } from '../components/Provider';
import { useLocalSearchParams } from 'expo-router';

export const useGetFarm = () => {
  const { setFarms } = useFarms();
  const { farmId } = useLocalSearchParams<{ farmId: string }>();

  const farm = Trpc.client.farms.get.useQuery({ farmId });

  const data = farm.data as any;

  React.useEffect(() => {
    if (farm.status === 'error') {
      Alert.alert('Failed to fetch farm', farm.error.message, [
        { text: 'Cancel' },
        {
          text: 'Retry',
          onPress: async () => {
            await farm.refetch();
          },
        },
      ]);
    } else if (farm.status === 'success') {
      setFarms({ type: 'SET_FARM', payload: { farm: data?.farm } });
    }
  }, [farm.status]);

  return { status: farm.status, data: data?.farm as Farm };
};
