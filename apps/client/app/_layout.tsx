import React from 'react';
import { trpc } from '@/lib/trpc';
import { Stack } from 'expo-router';
import { trpcClient } from '@/clients/trpc';
import { queryClient } from '@/clients/query';
import { useThemeColors } from '@/hooks/useThemeColors';
import { QueryClientProvider } from '@tanstack/react-query';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider, UserProvider } from '@/components';

const Layout = () => {
  const Colors = useThemeColors();

  return (
    <trpc.Provider
      client={trpcClient}
      queryClient={queryClient}
    >
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <AuthProvider>
              <UserProvider>
                <Stack
                  screenOptions={{
                    headerStyle: {
                      backgroundColor: Colors.others.background,
                    },
                    headerTitleStyle: { fontWeight: 'bold' },
                    headerTintColor: Colors.primary.base,
                  }}
                >
                  <Stack.Screen
                    name='[app]'
                    options={{ headerShown: false }}
                  />
                </Stack>
              </UserProvider>
            </AuthProvider>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default Layout;
