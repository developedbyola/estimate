import React from 'react';
import { trpc } from '@/lib/trpc';
import { Stack } from 'expo-router';
import { Farms } from '@/features/farms';
import { trpcClient } from '@/clients/trpc';
import { queryClient } from '@/clients/query';
import { Currency } from '@/features/currency';
import { Categories } from '@/features/categories';
import { useThemeColors } from '@/hooks/useThemeColors';
import { QueryClientProvider } from '@tanstack/react-query';
import { RootSiblingParent } from 'react-native-root-siblings';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { AuthProvider, Protected, UserProvider } from '@/components';
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
                  <Protected>
                    <Currency.Provider>
                      <Categories.Provider>
                        <Farms.Provider>
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
                              name='(tabs)'
                              options={{ headerShown: false }}
                            />
                            <Stack.Screen
                              name='(modals)'
                              options={{
                                title: 'Farm',
                                headerBackTitle: 'Back',
                              }}
                            />
                          </Stack>
                        </Farms.Provider>
                      </Categories.Provider>
                    </Currency.Provider>
                  </Protected>
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
