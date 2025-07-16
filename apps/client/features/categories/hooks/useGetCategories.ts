import React from 'react';
import { Alert } from 'react-native';
import { Trpc } from '@/features/trpc';
import { useCategories } from '../components/Provider';

export const useGetCategories = () => {
  const { setCategories } = useCategories();
  const list = Trpc.client.categories.list.useQuery();

  React.useEffect(() => {
    if (list.status === 'error') {
      Alert.alert('Unable to fetch categories', list.error.message, [
        { text: 'Cancel' },
        {
          text: 'Retry',
          isPreferred: true,
          onPress: async () => {
            await list.refetch();
          },
        },
      ]);
    }
    if (list.status === 'success') {
      const data = list.data as any;
      if (!data) return;

      setCategories({
        type: 'SET_CATEGORIES',
        payload: {
          categories: data?.categories || [],
        },
      });
    }
  }, [list.status]);

  return { status: list.status };
};
