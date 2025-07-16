import { Alert } from 'react-native';
import { useCategories } from '../components/Provider';
import { Trpc } from '@/features/trpc';

type Props = {
  onSuccess?: (data: any) => void;
};

export const useCreateCategory = ({ onSuccess }: Props) => {
  const { setCategories } = useCategories();

  const create = Trpc.client.categories.create.useMutation({
    onSuccess: (data: any) => {
      setCategories({
        type: 'ADD_CATEGORY',
        payload: { category: data.category },
      });
      onSuccess?.(data);
    },
    onError: (err, input) => {
      Alert.alert('Failed to create category', err.message, [
        { text: 'Cancel' },
        {
          text: 'Retry',
          onPress: async () => {
            await create.mutateAsync(input);
          },
        },
      ]);
    },
  });

  return {
    status: create.status,
    mutate: create.mutateAsync,
  };
};
