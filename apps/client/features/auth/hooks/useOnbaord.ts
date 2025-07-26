import { auth } from '@/lib/auth';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { onboardSchema } from '../schemas';
import { zodResolver } from '@hookform/resolvers/zod';

export const useOnboard = () => {
  const form = useForm({
    mode: 'all',
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    resolver: zodResolver(onboardSchema),
  });
  const router = useRouter();

  const mutate = form.handleSubmit(async (data) => {
    auth.updateUser(
      {
        name: `${data.firstName.trim().toLowerCase()} ${data.lastName
          .trim()
          .toLowerCase()}`,
      },
      {
        onSuccess: () => {
          form.reset();
          router.push('/(protected)/(tabs)');
        },
        onError: ({ error }) => {
          Alert.alert('Update Failed', error.message, [
            { text: 'OK' },
            {
              text: 'Try Again',
              onPress: async () => await mutate(),
            },
          ]);
        },
      }
    );
  });

  return { form, mutate };
};

export default useOnboard;
