import React from 'react';
import { trpc } from '@/lib/trpc';
import { Auth } from '@/features/auth';
import { User } from '@/features/user';
import { Farms } from '@/features/farms';
import { trpcClient } from '@/clients/trpc';
import { queryClient } from '@/clients/query';
import { Currency } from '@/features/currency';
import { Estimates } from '@/features/estimates';
import { Categories } from '@/features/categories';
import { QueryClientProvider } from '@tanstack/react-query';
import { RootSiblingParent } from 'react-native-root-siblings';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Popup from './Popup';

type Props = {
  children?: React.ReactNode;
};

const App = ({ children }: Props) => {
  return (
    <RootSiblingParent>
      <trpc.Provider
        client={trpcClient}
        queryClient={queryClient}
      >
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <Auth.Provider>
                <Auth.RefreshToken>
                  <User.Provider>
                    <User.Profile>
                      <Currency.Provider>
                        <Categories.Provider>
                          <Farms.Provider>
                            <Estimates.Provider>
                              <Popup.Provider>{children}</Popup.Provider>
                            </Estimates.Provider>
                          </Farms.Provider>
                        </Categories.Provider>
                      </Currency.Provider>
                    </User.Profile>
                  </User.Provider>
                </Auth.RefreshToken>
              </Auth.Provider>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </trpc.Provider>
    </RootSiblingParent>
  );
};

export default App;
