import { Alert } from 'react-native';
import { Trpc } from '@/features/trpc';
import { useCategories } from '../components/Provider';

type Props = {
  onSuccess?: (data: any) => void;
};

export const useUpdateCategory = ({ onSuccess }: Props) => {
  const { setCategories } = useCategories();

  const update = Trpc.client.categories.update.useMutation({
    onSuccess: (data: any) => {
      setCategories({
        type: 'UPDATE_CATEGORY',
        payload: { category: data.category },
      });
      onSuccess?.(data);
    },
    onError: (err, input) => {
      Alert.alert('Failed to update category', err.message, [
        { text: 'Cancel' },
        {
          text: 'Retry',
          onPress: async () => {
            await update.mutateAsync(input);
          },
        },
      ]);
    },
  });

  return {
    status: update.status,
    mutate: update.mutateAsync,
  };
};
