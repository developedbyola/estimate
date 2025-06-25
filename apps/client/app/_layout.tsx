import React from 'react';
import { trpc } from '@/lib/trpc';
import { Stack } from 'expo-router';
import { trpcClient } from '@/clients/trpc';
import { queryClient } from '@/clients/query';
import { useThemeColors } from '@/hooks/useThemeColors';
import { AuthProvider, UserProvider } from '@/components';
import { QueryClientProvider } from '@tanstack/react-query';
import { RootSiblingParent } from 'react-native-root-siblings';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Layout = () => {
  const colors = useThemeColors();

  return (
    <RootSiblingParent>
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
                        backgroundColor: colors.getColor('bg.base'),
                      },
                      headerTitleStyle: { fontWeight: 'bold' },
                      headerTintColor: colors.getColor('primary.base'),
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
    </RootSiblingParent>
  );
};

export default Layout;
