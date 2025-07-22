import { Alert } from 'react-native';
import { Trpc } from '@/features/trpc';
import { useCategories } from '../components/Provider';

export const useGetCategories = () => {
  const { setCategories } = useCategories();
  const query = Trpc.client.categories.me.list.useQuery();

  const list = Trpc.useQuery(query, {
    onError: (err) => {
      Alert.alert('Failed to fetch categories', err.message, [
        { text: 'Cancel' },
        {
          text: 'Retry',
          onPress: async () => {
            await query.refetch();
          },
        },
      ]);
    },
    onSuccess: (data) => {
      setCategories({
        type: 'SET_CATEGORIES',
        payload: {
          categories: data.categories,
        },
      });
    },
  });

  return { status: list.status, data: list.data };
};
