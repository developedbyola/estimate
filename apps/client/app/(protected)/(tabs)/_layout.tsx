import React from 'react';
import { Tabs } from 'expo-router';
import { Text } from '@/components';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks/useThemeColors';

const Layout = () => {
  const colors = useThemeColors();

  return (
    <Tabs
      screenOptions={{
        animation: 'shift',
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarAllowFontScaling: true,
        tabBarActiveTintColor: colors.getColor('primary.base'),
        tabBarInactiveTintColor: colors.getColor('text.inactive'),
        tabBarStyle: {
          height: 80,
          backgroundColor: colors.getColor('bg.base'),
        },
        tabBarLabel: (props) => {
          return (
            <Text
              size='2xs'
              leading='xs'
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
        name='index'
        options={{
          title: 'Home',
          tabBarIcon: (props) => {
            return (
              <Ionicons
                name='location'
                size={21}
                color={props.color}
              />
            );
          },
        }}
      />

      <Tabs.Screen
        name='categories'
        options={{
          title: 'Categories',
          tabBarIcon: (props) => {
            return (
              <Ionicons
                name='bookmark'
                size={21}
                color={props.color}
              />
            );
          },
        }}
      />

      <Tabs.Screen
        name='estimates'
        options={{
          title: 'Estimates',
          tabBarIcon: (props) => {
            return (
              <Ionicons
                name='reader'
                size={21}
                color={props.color}
              />
            );
          },
        }}
      />
    </Tabs>
  );
};

export default Layout;
