import { Popup } from '@/components';
import { Trpc } from '@/features/trpc';
import { useCategories } from '../components/Provider';

export const useUpdateCategory = () => {
  const popup = Popup.usePopup();
  const { setCategories } = useCategories();

  const update = Trpc.client.categories.me.update.useMutation({
    onSuccess: (data) => {
      setCategories({
        type: 'UPDATE_CATEGORY',
        payload: { category: data.category },
      });
      popup.open({
        variant: 'success',
        title: 'Category updated successfully',
        message: 'You can now add farms to this category',
        actions: [
          {
            text: 'OK',
          },
        ],
      });
    },
    onError: (err, input) => {
      popup.open({
        variant: 'destructive',
        title: 'Failed to update category',
        message: err.message,
        actions: [
          {
            text: 'Retry',
            onPress: async () => {
              await update.mutateAsync(input);
            },
          },
        ],
      });
    },
  });

  return {
    status: update.status,
    mutate: update.mutateAsync,
  };
};
