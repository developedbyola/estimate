import { Popup } from '@/components';
import { Trpc } from '@/features/trpc';
import { useFarms } from '../components/Provider';

export const useCreateFarm = () => {
  const popup = Popup.usePopup();
  const { setFarms } = useFarms();

  const create = Trpc.client.farms.me.create.useMutation({
    onSuccess: (data) => {
      const farmName = data.farm.name || 'Your farm';
      setFarms({ type: 'ADD_FARM', payload: { farm: data.farm } });
      popup.open({
        title: '🎉 Farm Created!',
        message: `${farmName} has been successfully created and is now ready to use. You can start adding estimates and managing your farm operations.`,
        variant: 'success',
        actions: [
          {
            text: 'Got it',
            variant: 'primary',
          },
        ],
      });
    },
    onError: (err, TextInputBase) => {
      popup.open({
        title: 'Unable to Create Farm',
        message: err.message,
        variant: 'destructive',
        actions: [
          {
            text: 'Try Again',
            variant: 'primary',
            onPress: async () => {
              await create.mutateAsync(TextInputBase);
            },
          },
        ],
      });
    },
  });

  return { mutate: create.mutateAsync, status: create.status };
};
