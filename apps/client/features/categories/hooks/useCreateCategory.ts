import { Popup } from '@/components';
import { Trpc } from '@/features/trpc';
import { useRouter } from 'expo-router';
import { useCategories } from '../components/Provider';

export const useCreateCategory = () => {
  const popup = Popup.use();
  const router = useRouter();
  const { setCategories } = useCategories();

  const create = Trpc.client.categories.me.create.useMutation({
    onSuccess: (data) => {
      setCategories({
        type: 'ADD_CATEGORY',
        payload: { category: data.category },
      });
      router.back();
      popup.open({
        variant: 'success',
        title: 'Category created successfully',
        message: 'You can now add farms to this category',
        actions: [
          {
            text: 'See all categories',
          },
        ],
      });
    },
    onError: (err, input) => {
      popup.open({
        variant: 'destructive',
        title: 'Failed to create category',
        message: err.message,
        actions: [
          {
            text: 'Retry',
            onPress: async () => {
              await create.mutateAsync(input);
            },
          },
        ],
      });
    },
  });

  return {
    status: create.status,
    mutate: create.mutateAsync,
  };
};
