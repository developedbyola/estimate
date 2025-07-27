import { Alert } from 'react-native';
import { Trpc } from '@/features/trpc';
import { useForm } from 'react-hook-form';
import { estimateSchema } from '../schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEstimates } from '../components/Provider';

export const useCreateEstimate = () => {
  const { setEstimates } = useEstimates();
  const form = useForm({
    mode: 'onBlur',
    resolver: zodResolver(estimateSchema),
    defaultValues: {
      title: '',
      calculations: [
        {
          id: String(Date.now()),
          description: '',
          type: 'expense',
          quantity: '1',
          price: '0',
        },
        {
          id: String(Date.now()),
          description: '',
          type: 'income',
          quantity: '1',
          price: '0',
        },
      ],
    },
  });

  const create = Trpc.client.estimates.me.create.useMutation({
    onSuccess: (data: any) => {
      setEstimates({
        type: 'UPDATE_ESTIMATE',
        payload: { estimate: data?.estimate },
      });
    },
    onError: (err, input) => {
      Alert.alert('Failed to update estimate', err.message, [
        {
          text: 'Retry',
          onPress: async () => {
            await create.mutateAsync(input);
          },
        },
      ]);
    },
  });

  return { mutate: create.mutateAsync, form };
};
