import { Stack } from 'expo-router';

const ProtectedLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='(tabs)'
        options={{
          title: 'Tabs',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='(settings)'
        options={{
          title: 'Settings',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='estimates'
        options={{
          title: 'Estimates',
          headerShown: false,
          sheetCornerRadius: 40,
          presentation: 'formSheet',
          contentStyle: { height: '100%' },
        }}
      />
      <Stack.Screen
        name='farms'
        options={{
          title: 'Farms',
          headerShown: false,
          sheetCornerRadius: 40,
          presentation: 'formSheet',
          contentStyle: { height: '100%' },
        }}
      />
      <Stack.Screen
        name='categories'
        options={{
          title: 'Categories',
          headerShown: false,
          sheetCornerRadius: 40,
          presentation: 'formSheet',
          contentStyle: { height: '100%' },
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
      <Stack.Screen name='onboard' />
    </Stack>
  );
};

export default ProtectedLayout;
