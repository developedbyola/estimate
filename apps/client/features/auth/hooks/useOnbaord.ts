import { Popup } from '@/components';
import { useRouter } from 'expo-router';

export const useOnboard = () => {
  const router = useRouter();
  const popup = Popup.usePopup();

  return {};
};

export default useOnboard;
