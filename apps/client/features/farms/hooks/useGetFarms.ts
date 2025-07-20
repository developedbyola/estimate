import React from 'react';
import { Alert } from 'react-native';
import { Banner } from '@/components';
import { Trpc } from '@/features/trpc';
import { useFarms } from '../components/Provider';

export const useGetFarms = () => {
  const banner = Banner.useBanner();
  const { setFarms } = useFarms();
  const list = Trpc.client.farms.me.list.useQuery();

  React.useEffect(() => {
    if (list.status === 'error') {
      Alert.alert('Unable to fetch farms', list.error.message, [
        { text: 'Cancel' },
        {
          text: 'Retry',
          onPress: () => list.refetch().catch(console.error),
        },
      ]);
    }

    if (list.status === 'success') {
      const data = list.data as any;
      if (!data) return;

      setFarms({
        type: 'SET_FARMS',
        payload: {
          farms: (list.data as any)?.farms || [],
        },
      });
    }
  }, [list.status]);

  return { status: list.status };
};
