import { Stack } from 'expo-router';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

const AuthLayout = () => {
  const colors = useThemeColors();

  return (
    <Stack>
      <Stack.Screen
        name='login'
        options={{
          contentStyle: {
            backgroundColor: colors.getColor('bg.base'),
          },
          headerStyle: {
            backgroundColor: colors.getColor('bg.base'),
          },
          headerTitleStyle: {
            color: colors.getColor('text.strong'),
          },
          headerLeft: () => {
            return (
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons
                  size={24}
                  name='chevron-back'
                  color={colors.getColor('icon.strong')}
                />
              </TouchableOpacity>
            );
          },
          headerTitle: 'Sign in',
        }}
      />
      <Stack.Screen
        name='register'
        options={{
          contentStyle: {
            backgroundColor: colors.getColor('bg.base'),
          },
          headerStyle: {
            backgroundColor: colors.getColor('bg.base'),
          },
          headerTitleStyle: {
            color: colors.getColor('text.strong'),
          },
          headerLeft: () => {
            return (
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons
                  size={24}
                  name='chevron-back'
                  color={colors.getColor('icon.strong')}
                />
              </TouchableOpacity>
            );
          },
          headerTitle: 'Join',
        }}
      />
    </Stack>
  );
};

export default AuthLayout;
