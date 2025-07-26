import { signIn } from '@/lib/auth';
import { Popup } from '@/components';
import { useFormContext } from 'react-hook-form';

export const useLogin = () => {
  const form = useFormContext();
  const popup = Popup.usePopup();

  const mutate = async () => {
    await signIn.email(
      {
        email: form.getValues('email'),
        password: form.getValues('password'),
      },
      {
        onSuccess: (data) => {},
        onError: (err: any) => {},
      }
    );
  };

  return { mutate };
};
