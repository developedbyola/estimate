import React from 'react';
import { router, Stack } from 'expo-router';
import { Popup } from '@/components';
import { Auth } from '@/features/auth';
import { Trpc } from '@/features/trpc';
import { Users } from '@/features/users';
import { Farms } from '@/features/farms';
import { Currency } from '@/features/currency';
import { Estimates } from '@/features/estimates';
import { Categories } from '@/features/categories';
import { useThemeColors } from '@/hooks/useThemeColors';
import { RootSiblingParent } from 'react-native-root-siblings';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stacks = () => {
  const { auth } = Auth.useAuth();
  const colors = useThemeColors();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.getColor('bg.base'),
        },
        headerTitleStyle: { fontWeight: 'bold' },
        headerTintColor: colors.getColor('primary.base'),
      }}
    >
      <Stack.Protected guard={auth.isAuthenticated}>
        <Stack.Screen
          name='(tabs)'
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='farm'
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name='estimate'
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name='add-category'
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name='add-farm'
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name='(settings)'
          options={{
            title: 'Settings',
            headerShown: false,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name='onboard'
          options={{
            presentation: 'formSheet',
          }}
        />
      </Stack.Protected>
      <Stack.Screen
        name='index'
        options={{
          title: 'Home',
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
    </Stack>
  );
};

const Layout = () => {
  return (
    <RootSiblingParent>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <Auth.Provider>
            <Trpc.Provider>
              <Auth.RefreshToken>
                <Users.Provider>
                  <Users.Get>
                    <Currency.Provider>
                      <Categories.Provider>
                        <Farms.Provider>
                          <Estimates.Provider>
                            <Popup.Provider>
                              <Stacks />
                            </Popup.Provider>
                          </Estimates.Provider>
                        </Farms.Provider>
                      </Categories.Provider>
                    </Currency.Provider>
                  </Users.Get>
                </Users.Provider>
              </Auth.RefreshToken>
            </Trpc.Provider>
          </Auth.Provider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </RootSiblingParent>
  );
};

export default Layout;
