import React from 'react';
import { Stack } from 'expo-router';
import { Auth } from '@/features/auth';
import { Trpc } from '@/features/trpc';
import { Farms } from '@/features/farms';
import { Profiles } from '@/features/profiles';
import { Currency } from '@/features/currency';
import { Box, Popup, Banner } from '@/components';
import { Estimates } from '@/features/estimates';
import { Categories } from '@/features/categories';
import * as SplashScreen from 'expo-splash-screen';
import { RootSiblingParent } from 'react-native-root-siblings';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stacks = () => {
  const { isLoading, isAuthenticated } = Auth.useAuth();

  const onLayout = React.useCallback(async () => {
    if (!isLoading) {
      await SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  return (
    <Box
      style={{ flex: 1 }}
      onLayout={onLayout}
    >
      <Stack>
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen
            name='index'
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name='login'
            options={{
              presentation: 'formSheet',
            }}
          />
          <Stack.Screen
            name='register'
            options={{
              presentation: 'formSheet',
            }}
          />
        </Stack.Protected>
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen
            name='(protected)'
            options={{ title: 'App', headerShown: false }}
          />
        </Stack.Protected>
      </Stack>
    </Box>
  );
};

SplashScreen.preventAutoHideAsync();
const RootLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootSiblingParent>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <Banner.Provider>
              <Popup.Provider>
                <Auth.Provider>
                  <Trpc.Provider>
                    <Auth.RefreshToken>
                      <Profiles.Provider>
                        <Currency.Provider>
                          <Categories.Provider>
                            <Farms.Provider>
                              <Estimates.Provider>
                                <Stacks />
                              </Estimates.Provider>
                            </Farms.Provider>
                          </Categories.Provider>
                        </Currency.Provider>
                      </Profiles.Provider>
                    </Auth.RefreshToken>
                  </Trpc.Provider>
                </Auth.Provider>
              </Popup.Provider>
            </Banner.Provider>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </RootSiblingParent>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
