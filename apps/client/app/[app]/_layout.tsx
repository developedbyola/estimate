import React from 'react';
import { Tabs } from 'expo-router';
import { Protected, Text } from '@/components';
import { Ionicons } from '@expo/vector-icons';
import { Currency } from '@/features/currency';
import { useThemeColors } from '@/hooks/useThemeColors';

const Layout = () => {
  const colors = useThemeColors();

  return (
    <Protected>
      <Currency.Provider>
        <Tabs
          screenOptions={{
            animation: 'shift',
            tabBarHideOnKeyboard: true,
            tabBarAllowFontScaling: true,
            tabBarActiveTintColor: colors.getColor('primary.base'),
            tabBarInactiveTintColor: colors.getColor('text.inactive'),
            tabBarStyle: {
              height: 80,
              borderTopWidth: 1,
              backgroundColor: colors.getColor('bg.base'),
              borderColor: colors.getColor('border.inactive'),
            },
            tabBarLabel: (props) => {
              return (
                <Text
                  size='2xs'
                  leading='sm'
                  weight='medium'
                  align='center'
                  style={{
                    textTransform: 'capitalize',
                    color: props.color,
                  }}
                >
                  {props.children}
                </Text>
              );
            },
          }}
        >
          <Tabs.Screen
            name='search'
            options={{
              tabBarIcon: (props) => {
                return (
                  <Ionicons
                    name='search'
                    size={24}
                    color={props.color}
                  />
                );
              },
            }}
          />

          <Tabs.Screen
            name='index'
            options={{
              tabBarIcon: (props) => {
                return (
                  <Ionicons
                    name='leaf'
                    size={28}
                    color={props.color}
                  />
                );
              },
            }}
          />

          <Tabs.Screen
            name='settings'
            options={{
              tabBarIcon: (props) => {
                return (
                  <Ionicons
                    name='cog'
                    size={28}
                    color={props.color}
                  />
                );
              },
            }}
          />
        </Tabs>
      </Currency.Provider>
    </Protected>
  );
};

export default Layout;
